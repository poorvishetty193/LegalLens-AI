from typing import List, Optional
from pydantic import BaseModel, Field

class GroundedSource(BaseModel):
    page: Optional[int] = Field(None, description="Page number reference in document")
    section: Optional[str] = Field(None, description="Section heading or number reference")
    excerpt: Optional[str] = Field(None, description="Direct quote or snippet from document text")

class AskQuestionRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=1000, description="User's question about the uploaded document")
    session_id: Optional[str] = Field(None, max_length=64, description="Optional existing chat session ID")

class AskQuestionResponseSchema(BaseModel):
    answer: str = Field(..., description="Grounded answer to the question based ONLY on the document text")
    sources: List[GroundedSource] = Field(default_factory=list, description="List of source citations from the document")
    confidence: str = Field(default="high", description="Grounded confidence assessment ('high', 'medium', 'low')")
    disclaimer: str = Field(
        default="LegalLens AI provides AI-assisted legal information and document analysis. It does not provide legal advice or replace a qualified legal professional.",
        description="Mandatory legal disclaimer"
    )
