from typing import List, Optional, Literal
from pydantic import BaseModel, Field

class ComparisonItem(BaseModel):
    category: str = Field(..., description="Category of comparison (e.g. Non-Compete, Liability Cap, Termination)")
    change_type: Literal["ADDED", "REMOVED", "MODIFIED", "UNCHANGED"] = Field(..., description="Nature of change")
    title: str = Field(..., description="Title or summary of the difference")
    description: str = Field(..., description="Detailed explanation of the difference")
    document_a_text: Optional[str] = Field(None, description="Relevant text/language from Document A")
    document_b_text: Optional[str] = Field(None, description="Relevant text/language from Document B")
    document_a_reference: Optional[str] = Field(None, description="Source page/section in Document A")
    document_b_reference: Optional[str] = Field(None, description="Source page/section in Document B")
    severity: Literal["low", "medium", "high", "critical"] = Field(..., description="Impact or risk severity of this difference")
    explanation: str = Field(..., description="Plain-English explanation of why this change matters")

class DocumentComparisonRequest(BaseModel):
    document_id_a: str = Field(..., description="First document ID")
    document_id_b: str = Field(..., description="Second document ID to compare against")

class DocumentComparisonResponseSchema(BaseModel):
    document_a_name: str = Field(..., description="Name or title of Document A")
    document_b_name: str = Field(..., description="Name or title of Document B")
    executive_summary: str = Field(..., description="Overall executive summary of key differences between the documents")
    key_differences: List[ComparisonItem] = Field(default_factory=list, description="All identified clause and risk differences")
    changed_clauses: List[ComparisonItem] = Field(default_factory=list, description="Modified clauses")
    added_clauses: List[ComparisonItem] = Field(default_factory=list, description="Clauses present in B but missing in A")
    removed_clauses: List[ComparisonItem] = Field(default_factory=list, description="Clauses present in A but missing in B")
    changed_obligations: List[ComparisonItem] = Field(default_factory=list, description="Modified party obligations")
    changed_risks: List[ComparisonItem] = Field(default_factory=list, description="Risk level deltas")
    changed_dates: List[ComparisonItem] = Field(default_factory=list, description="Date, milestone, or timeline changes")
    attention_changes: str = Field(..., description="Summary of how overall risk attention shifted from Document A to Document B")
    disclaimer: str = Field(
        default="LegalLens AI provides AI-assisted legal information and document analysis. It does not provide legal advice or replace a qualified legal professional.",
        description="Mandatory legal disclaimer"
    )
