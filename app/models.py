import re
from typing import Literal
from datetime import date
from pydantic import BaseModel, Field, field_validator, model_validator

RegType=Literal['UU','PP','PERPRES','PERDA_PROV','PERDA_KAB','PERMEN','PERPPU','PERGUB','PERBUP','PERWALI','PER_LEMBAGA','PERDES','PERKADES','PERDPRD_PROV','PERDPRD_KAB']
class Article(BaseModel):
 number: str = Field(pattern=r'^(?:\d+[A-Z]?|I|II)$', max_length=8)
 text: str = Field(min_length=1,max_length=12000)
 chapter: str = Field(default='',max_length=160)
 @field_validator('number',mode='before')
 @classmethod
 def strip_pasal_prefix(cls,v):
  # Vertex drops the schema pattern, so Gemini often writes "Pasal 1"; keep only the number.
  return re.sub(r'^\s*pasal\s+','',v,flags=re.I).strip() if isinstance(v,str) else v
class DraftingMetadata(BaseModel):
 form: Literal['new','amendment'] = 'new'
 region: str = Field(default='',max_length=100)
 local_level: Literal['kabupaten','kota'] = 'kabupaten'
 institution: str = Field(default='',max_length=140)
 legislative_origin: Literal['DPR','PRESIDEN','DPD'] = 'DPR'
 year: int = Field(default_factory=lambda:date.today().year,ge=1945,le=2100)
 number: str = Field(default='',max_length=40)
 place: str = Field(default='',max_length=100)
 include_transition: bool = False
 include_explanation: bool = False
 include_attachment: bool = False
class DraftInput(BaseModel):
 title: str = Field(min_length=3,max_length=300)
 regulation_type: RegType = 'PP'
 preamble: str = Field(default='',max_length=10000)
 articles: list[Article] = Field(min_length=1,max_length=100)
 scope: str = Field(default='Layanan publik digital',max_length=1000)
 document_heading: str = Field(default='',max_length=1200)
 closing: str = Field(default='',max_length=4000)
 explanation: str = Field(default='',max_length=10000)
 attachments: str = Field(default='',max_length=10000)
 drafting: DraftingMetadata | None = None
 template_source_ids: list[str] = Field(default_factory=list,max_length=10)
 @model_validator(mode='after')
 def unique_numbers(self):
  if len({a.number for a in self.articles})!=len(self.articles):raise ValueError('Article numbers must be unique')
  if self.drafting and self.drafting.form=='amendment' and [a.number for a in self.articles]!=['I','II']:raise ValueError('An amendment must contain Pasal I and Pasal II')
  if sum(len(a.text) for a in self.articles)>100000:raise ValueError('The draft is too long for this MVP')
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
 temporal: str = 'not verified'
 scope: str = 'not verified'
 authority: str = 'not verified'
 exceptions: str = 'not verified'
 alternative_interpretation: str = 'not verified'
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

class SocialOptions(BaseModel):
 persona_count: Literal[8,16,24,32] = 24
 rounds: int = Field(default=4,ge=2,le=5)
