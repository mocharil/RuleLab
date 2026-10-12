from typing import Literal
from datetime import date
from pydantic import BaseModel, Field, model_validator

RegType=Literal['UU','PP','PERPRES','PERDA_PROV','PERDA_KAB','PERMEN']
class Article(BaseModel):
 number: str = Field(pattern=r'^\d+[A-Z]?$', max_length=8)
 text: str = Field(min_length=1,max_length=12000)
class DraftInput(BaseModel):
 title: str = Field(min_length=3,max_length=300)
 regulation_type: RegType = 'PP'
 preamble: str = Field(default='',max_length=10000)
 articles: list[Article] = Field(min_length=1,max_length=100)
 scope: str = Field(default='Layanan publik digital',max_length=1000)
 @model_validator(mode='after')
 def unique_numbers(self):
  if len({a.number for a in self.articles})!=len(self.articles):raise ValueError('Nomor pasal harus unik')
  if sum(len(a.text) for a in self.articles)>100000:raise ValueError('Draft terlalu panjang untuk MVP')
  return self
class SaveDraft(DraftInput):
 expected_revision: int = Field(ge=1)
class GenerateRequest(BaseModel):
 brief: str = Field(min_length=10,max_length=6000)
 regulation_type: RegType = 'PP'
class AnalyzeRequest(BaseModel):
 as_of_date: date | None = None
class EvidenceQuote(BaseModel):
 evidence_id: str
 quote: str = Field(min_length=1,max_length=12000)
class LegalChecks(BaseModel):
 temporal: str = 'belum diverifikasi'
 scope: str = 'belum diverifikasi'
 authority: str = 'belum diverifikasi'
 exceptions: str = 'belum diverifikasi'
 alternative_interpretation: str = 'belum diverifikasi'
class Finding(BaseModel):
 article_number: str
 category: Literal['potential_vertical_conflict','potential_horizontal_conflict','ambiguity','implementation_risk','coverage_gap']
 severity: Literal['high','medium','low']
 title: str
 reasoning: str
 evidence_ids: list[str] = Field(default_factory=list)
 counterargument: str
 proposed_text: str
 review_questions: list[str] = Field(default_factory=list)
 legal_rule_ids: list[str] = Field(default_factory=list)
 evidence_quotes: list[EvidenceQuote] = Field(default_factory=list)
 norm_collision: str = ''
 legal_checks: LegalChecks = Field(default_factory=LegalChecks)
class AnalysisOutput(BaseModel):
 summary: str
 findings: list[Finding]
 limitations: list[str]
class Assumptions(BaseModel):
 population: int = Field(default=1000,ge=1,le=10000000)
 digital_access_pct: float = Field(default=70,ge=0,le=100)
 assisted_success_pct: float = Field(default=80,ge=0,le=100)
 digital_cost: float = Field(default=20000,ge=0,le=100000000)
 assisted_cost: float = Field(default=50000,ge=0,le=100000000)
 staff_capacity: int = Field(default=40,ge=1,le=100000)
class SimulationRequest(BaseModel):
 alternative_text: str = Field(min_length=10,max_length=100000)
 assumptions: Assumptions = Field(default_factory=Assumptions)
class StakeholderOutput(BaseModel):
 stakeholder: str
 benefits: list[str]
 risks: list[str]
 mitigations: list[str]
 evidence_ids: list[str]
 questions_to_validate: list[str]
class RevisionRequest(BaseModel):
 run_id: str
 finding_index: int = Field(ge=0)
 expected_revision: int = Field(ge=1)
class ReviewRequest(BaseModel):
 status: Literal['needs_review','reviewed_with_notes']
 notes: str = Field(min_length=5,max_length=4000)
class ImportRequest(BaseModel):
 filename: str = Field(max_length=200)
 content_base64: str = Field(max_length=14000000)
class CompareRequest(BaseModel):
 left_id: str
 right_id: str
 left_article: str
 right_article: str
