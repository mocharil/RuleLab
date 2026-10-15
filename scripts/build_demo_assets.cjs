const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function toDataUri(relPath, mime) {
  const fullPath = path.join(root, relPath);
  const buf = fs.readFileSync(fullPath);
  return `data:${mime};base64,${buf.toString('base64')}`;
}

function simplifyRing(ring, tol = 0.04) {
  const out = [];
  let prev = null;
  for (let i = 0; i < ring.length; i++) {
    const [lon, lat] = ring[i];
    if (!prev || Math.hypot(lon - prev[0], lat - prev[1]) >= tol || i === ring.length - 1) {
      out.push([Number(lon.toFixed(2)), Number(lat.toFixed(2))]);
      prev = [lon, lat];
    }
  }
  return out;
}

function buildIndonesiaGeo() {
  const geoPath = path.join(root, 'app/static/geo/indonesia-provinces.geojson');
  const geo = JSON.parse(fs.readFileSync(geoPath, 'utf8'));
  return geo.features.map((f) => {
    const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
    const rings = [];
    let sumX = 0;
    let sumY = 0;
    let n = 0;
    for (const poly of polys) {
      const outer = poly[0];
      if (!outer || outer.length < 6) continue;
      let minX = 999;
      let maxX = -999;
      let minY = 999;
      let maxY = -999;
      for (const [x, y] of outer) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
      if (Math.hypot(maxX - minX, maxY - minY) < 0.12 && polys.length > 3) continue;
      const simp = simplifyRing(outer, 0.04);
      if (simp.length >= 4) {
        rings.push(simp);
        for (const [x, y] of simp) {
          sumX += x;
          sumY += y;
          n++;
        }
      }
    }
    return {
      id: f.properties.id,
      name: f.properties.name,
      cx: n ? Number((sumX / n).toFixed(2)) : 118,
      cy: n ? Number((sumY / n).toFixed(2)) : -2,
      rings,
    };
  });
}

const assets = {
  logo: toDataUri('app/static/brand/rulelab-logo-manrope-v2.png', 'image/png'),
  hookChaos: toDataUri('demo/media/hook-regulatory-chaos.png', 'image/png'),
  hookCitizen: toDataUri('demo/media/hook-citizen-impact.png', 'image/png'),
  home: toDataUri('screenshots/workspace-visual/home-1440.png', 'image/png'),
  dashboardMap: toDataUri('screenshots/collection/dashboard-intake-map.png', 'image/png'),
  landingMap: toDataUri('screenshots/collection/landing-map.png', 'image/png'),
  guidedBuilder: toDataUri('screenshots/forms-network/guided-perda-preview.png', 'image/png'),
  studioDraft: toDataUri('screenshots/studio/studio-draft.png', 'image/png'),
  studioReview: toDataUri('screenshots/studio/studio-review.png', 'image/png'),
  studioImpact: toDataUri('screenshots/studio/studio-impact.png', 'image/png'),
  network32: toDataUri('screenshots/forms-network/network-32-agents.png', 'image/png'),
  networkExpanded: toDataUri('screenshots/forms-network/network-expanded.png', 'image/png'),
  networkResults: toDataUri('screenshots/workspace-visual/network-results.png', 'image/png'),
  fontManrope: toDataUri('app/static/fonts/Manrope.ttf', 'font/ttf'),
  fontCormorant: toDataUri('app/static/fonts/CormorantGaramond.ttf', 'font/ttf'),
  indonesiaGeo: buildIndonesiaGeo(),
};

const outDir = path.join(root, 'demo');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const outFile = path.join(outDir, 'assets.js');
fs.writeFileSync(
  outFile,
  `// Auto-generated RuleLab demo asset bundle\nwindow.RULELAB_DEMO_ASSETS = ${JSON.stringify(assets)};\n`,
  'utf8'
);

console.log('Wrote demo/assets.js (' + Math.round(fs.statSync(outFile).size / 1024) + ' KB)');
