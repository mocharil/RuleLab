# Enriched corpus JSON

The authoritative combined dataset is `data/corpus.json`. Individual documents are in `data/enriched/`.

| Field | Meaning |
| --- | --- |
| schema_version | Dataset format version |
| id | Stable regulation identifier, e.g. uu-25-2009 |
| version_id | Regulation ID plus source-content SHA256 prefix |
| metadata.type / number / year / title | Curated official identity |
| metadata.promulgated_on | Curated date from source; not automatic clause-level temporal consolidation |
| metadata.hierarchy_rank | Rank for types in UU 12/2011 hierarchy; no fixed rank for ministerial regulations |
| metadata.version_kind | original, original_amended, amendment |
| metadata.amends / amended_by / implements | Curated links, not an exhaustive relation graph |
| metadata.status_as_of | null: current legal status has not been certified |
| provenance.source_url / source_page | Downloaded full text and document metadata page |
| provenance.retrieved_at | Download timestamp retained from raw file |
| provenance.sha256 | Hash of unchanged raw bytes |
| provenance.raw_file / extracted_file | Paths relative to data/ |
| quality.ocr_needed_pages | Pages with insufficient text layer, not processed OCR |
| quality.missing_article_numbers | Expected numeric article sequence missing from extraction |
| quality.body_complete_by_number | Number coverage only; not full semantic verification |
| quality.human_verified | false unless a future review validates the entire document |
| articles[].id | Stable source-qualified citation ID |
| articles[].number / chapter / section | Extracted heading structure |
| articles[].text | Whitespace-normalized text, not rewritten by AI |
| articles[].pages | PDF pages; empty for HTML sources |
| articles[].paragraphs | Detected numbered clauses; definition_or_ayat for Pasal 1 |
| articles[].letters | Detected lettered list units; boundaries need review |
| articles[].target_regulation_id | Amended regulation for replacement blocks |
| articles[].legal_status | Original snapshot or not_consolidated, not a validity ruling |
| articles[].enrichment.method | deterministic_rules_v1 |
| articles[].enrichment.topics / actors / norm_types | Rules-based tags, not verified legal interpretation |
| articles[].enrichment.references | Pattern-extracted article references, not resolved graph edges |
| articles[].enrichment.extractive_preview | First 240 characters, not a generated legal summary |
| articles[].enrichment.exceptions_detected | Keyword signal for context expansion |
| articles[].source | URL, SHA256, unchanged raw file and pages |

Amendment document counts include Pasal I/II and replacement blocks. They must not be interpreted as stand-alone current-law clauses without consolidation and review. Instructions surrounding replacement blocks may remain in extracted text. Full page text in extracted/ lets you inspect those boundaries.

No dataset field certifies a clause as valid, invalid, or conflict-free. Unknown values remain unknown rather than being completed by an LLM.
