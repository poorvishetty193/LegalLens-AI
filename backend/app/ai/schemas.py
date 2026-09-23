from typing import List, Optional, Literal
from pydantic import BaseModel, Field

class ImportantClause(BaseModel):
    title: str = Field(..., description="Short title of the clause")
    clause_type: str = Field(..., description="Category of clause (e.g. Non-Compete, Indemnification, Termination)")
    explanation: str = Field(..., description="Plain-English explanation of what this clause means")
    attention_level: Literal["low", "medium", "high", "critical"] = Field(..., description="Risk or attention severity")
    source_page: Optional[int] = Field(None, description="Page number where this clause appears, if known")
    source_section: Optional[str] = Field(None, description="Section heading or number, if known")
    suggested_redline: Optional[str] = Field(None, description="Recommended counter-proposal or safer language")

class RiskItem(BaseModel):
    title: str = Field(..., description="Short title of the risk")
    explanation: str = Field(..., description="Detailed explanation of the potential risk or liability")
    severity: Literal["low", "medium", "high", "critical"] = Field(..., description="Severity level")
    source_page: Optional[int] = Field(None, description="Page number reference")
    source_section: Optional[str] = Field(None, description="Section reference")

class ObligationItem(BaseModel):
    party: str = Field(..., description="Party responsible for the obligation")
    obligation: str = Field(..., description="Description of the obligation or requirement")
    deadline: Optional[str] = Field(None, description="Deadline or timeframe if specified")
    source_page: Optional[int] = Field(None, description="Page number reference")

class KeyDateItem(BaseModel):
    description: str = Field(..., description="Description of the milestone, expiration, or event")
    date: Optional[str] = Field(None, description="Extracted date or duration string")
    source_page: Optional[int] = Field(None, description="Page number reference")

class DocumentAnalysisSchema(BaseModel):
    overall_summary: str = Field(..., description="Plain-English executive summary of the agreement")
    attention_level: Literal["low", "medium", "high", "critical"] = Field(..., description="Overall document risk score")
    attention_score: int = Field(..., ge=0, le=100, description="Numerical attention score (0-100)")
    important_clauses: List[ImportantClause] = Field(default_factory=list)
    risks: List[RiskItem] = Field(default_factory=list)
    obligations: List[ObligationItem] = Field(default_factory=list)
    key_dates: List[KeyDateItem] = Field(default_factory=list)
    inconsistencies: List[str] = Field(default_factory=list)
    missing_information: List[str] = Field(default_factory=list, description="Missing protections, omissions, or gaps")
    lawyer_questions: List[str] = Field(default_factory=list, description="Recommended questions to ask a qualified lawyer")
    disclaimer: str = Field(
        default="LegalLens AI provides AI-assisted legal information and document analysis. It does not provide legal advice or replace a qualified legal professional.",
        description="Mandatory legal disclaimer"
    )
