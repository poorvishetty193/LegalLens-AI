from typing import List, Optional
from pydantic import BaseModel, Field

class LawyerBriefRequest(BaseModel):
    user_concerns: Optional[str] = Field(None, max_length=2000, description="Optional user-supplied custom concerns or questions")

class BriefQuestionItem(BaseModel):
    number: int = Field(..., description="Sequential question number")
    question: str = Field(..., description="Actionable question to ask legal counsel")
    clause_reference: Optional[str] = Field(None, description="Related section or clause reference")
    context: str = Field(..., description="Plain-English explanation of why this question is crucial")

class LawyerBriefResponseSchema(BaseModel):
    document_summary: str = Field(..., description="Concise executive summary of the document for legal consultation")
    key_concerns: List[str] = Field(default_factory=list, description="Top high-risk concerns to bring to counsel's attention")
    important_clauses: List[str] = Field(default_factory=list, description="Key contractual terms requiring attorney review")
    questions_for_lawyer: List[BriefQuestionItem] = Field(default_factory=list, description="Structured questions for consultation")
    information_to_bring: List[str] = Field(default_factory=list, description="List of supporting documents, past emails, or exhibits to bring")
    key_dates: List[str] = Field(default_factory=list, description="Critical deadlines or milestones to clarify with counsel")
    unclear_or_missing_information: List[str] = Field(default_factory=list, description="Contractual omissions or ambiguous terms")
    discussion_topics: List[str] = Field(default_factory=list, description="Agenda topics for the consultation")
    disclaimer: str = Field(
        default="LegalLens AI provides AI-assisted legal information and document preparation support. It does not provide legal advice or replace a qualified legal professional.",
        description="Mandatory legal disclaimer"
    )
