import { useEffect, useState } from "react";

/** Public collection summary served by GET /api/public/collection (no login, no hardcoded numbers). */
export interface CollectionSummary {
  unique_regulations: number;
  documents: number;
  articles: number;
  national: number;
  mapped_provinces: number;
  province_total: number;
}
export interface PublicCollection {
  summary: CollectionSummary;
  types: Record<string, number>;
  topics: Record<string, number>;
}

let cache: Promise<PublicCollection | null> | null = null;

export function loadCollection(): Promise<PublicCollection | null> {
  cache ??= fetch("/api/public/collection", { headers: { Accept: "application/json" } })
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null);
  return cache;
}

export function useCollection() {
  const [data, setData] = useState<PublicCollection | null | undefined>(undefined);
  useEffect(() => {
    let alive = true;
    loadCollection().then((d) => alive && setData(d));
    return () => { alive = false; };
  }, []);
  return data; // undefined = loading, null = unavailable
}

/** Readable names for regulation type codes used in the corpus. */
export const TYPE_NAMES: Record<string, string> = {
  UU: "Undang-Undang", PERPPU: "Perppu", PP: "Peraturan Pemerintah", PERPRES: "Peraturan Presiden",
  PERMEN: "Peraturan Menteri", PER_LEMBAGA: "Peraturan Lembaga", PERDA_PROV: "Perda Provinsi",
  PERDA_KAB: "Perda Kabupaten/Kota", PERGUB: "Peraturan Gubernur", PERBUP: "Peraturan Bupati",
  PERWALI: "Peraturan Wali Kota", INPRES: "Instruksi Presiden", KEPPRES: "Keputusan Presiden",
};

/** English labels for the enrichment topics stored with each article. */
export const TOPIC_NAMES: Record<string, string> = {
  pembentukan_regulasi: "Law-making", biaya: "Costs & fees", akses_layanan: "Service access", informasi: "Public information",
  partisipasi: "Participation", disabilitas: "Disability rights", pengaduan: "Complaints", data_pribadi: "Personal data",
};

export const MEDIA = "/static/landing";
