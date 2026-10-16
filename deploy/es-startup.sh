#!/bin/bash
set -e
IP=10.184.0.2
sysctl -w vm.max_map_count=262144
echo "vm.max_map_count=262144" > /etc/sysctl.d/99-es.conf
if ! command -v docker >/dev/null; then apt-get update -y && apt-get install -y docker.io; fi
mkdir -p /data/es /data/certs && chown -R 1000:0 /data/es
if [ ! -f /data/certs/ca.crt ]; then
  cd /data/certs
  openssl genrsa -out ca.key 4096
  openssl req -x509 -new -nodes -key ca.key -sha256 -days 3650 -subj "/CN=rulelab-es-ca" -out ca.crt
  openssl genrsa -out server.key 2048
  openssl req -new -key server.key -subj "/CN=rulelab-es" -out server.csr
  printf "subjectAltName=IP:$IP,DNS:localhost,IP:127.0.0.1\n" > san.ext
  openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt -days 3650 -sha256 -extfile san.ext
  chown -R 1000:0 /data/certs; chmod 640 server.key
  gcloud secrets versions add rulelab-es-ca --data-file=ca.crt
fi
ES_PW=$(gcloud secrets versions access latest --secret rulelab-es-password)
if ! docker ps -a --format '{{.Names}}' | grep -q '^es$'; then
  docker run -d --name es --restart always -p 9200:9200 \
    -e discovery.type=single-node -e ELASTIC_PASSWORD="$ES_PW" \
    -e xpack.security.enabled=true -e xpack.security.http.ssl.enabled=true \
    -e xpack.security.http.ssl.key=/usr/share/elasticsearch/config/certs/server.key \
    -e xpack.security.http.ssl.certificate=/usr/share/elasticsearch/config/certs/server.crt \
    -e xpack.security.http.ssl.certificate_authorities=/usr/share/elasticsearch/config/certs/ca.crt \
    -e ES_JAVA_OPTS="-Xms3g -Xmx3g" \
    -v /data/es:/usr/share/elasticsearch/data -v /data/certs:/usr/share/elasticsearch/config/certs:ro \
    docker.elastic.co/elasticsearch/elasticsearch:8.15.3
else
  docker start es || true
fi
