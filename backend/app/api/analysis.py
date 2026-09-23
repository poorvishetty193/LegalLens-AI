import uuid
from fastapi import APIRouter, Depends, HTTPException, Body
from pydantic import BaseModel, Field
from app.auth.firebase_auth import get_current_user
from app.models.firestore_service import FirestoreService
from app.ai.gemini_service import GeminiAnalysisService
from app.ai.schemas import DocumentAnalysisSchema

router = APIRouter(prefix="/api/analysis", tags=["analysis"])

class RunAnalysisRequest(BaseModel):
    extracted_text: str = Field(..., description="Extracted text of the document to analyze")

@router.post("/{document_id}")
async def run_document_analysis(
    document_id: str,
    payload: RunAnalysisRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    POST /api/analysis/{document_id}
    - Firebase authentication required
    - Validates that document exists and belongs to requesting user UID
    - Invokes Gemini API for structured legal analysis
    - Stores analysis in Firestore under /users/{uid}/analyses/{analysis_id}
    """
    uid = current_user.get("uid")
    if not uid:
        raise HTTPException(status_code=401, detail="Authentication failed")

    # 1. Ownership & Existence Verification
    doc_meta = FirestoreService.get_document_meta(uid, document_id)
    if not doc_meta:
        # Return 403 Forbidden to prevent cross-user ID enumeration
        raise HTTPException(
            status_code=403,
            detail="Access denied: Document not found or you do not have permission to access it."
        )

    # 2. Text Content Check
    extracted_text = payload.extracted_text
    if not extracted_text or not extracted_text.strip():
        raise HTTPException(status_code=400, detail="Cannot analyze empty text content.")

    # 3. Perform AI Analysis via Gemini API
    analysis_result: DocumentAnalysisSchema = GeminiAnalysisService.analyze_document_text(extracted_text)
    
    analysis_id = str(uuid.uuid4())
    analysis_dict = analysis_result.model_dump()

    # 4. Save analysis to Firestore (/users/{uid}/analyses/{analysis_id})
    FirestoreService.save_analysis(
        uid=uid,
        doc_id=analysis_id,
        analysis_data={
            "analysisId": analysis_id,
            "documentId": document_id,
            "uid": uid,
            "model": "gemini-3.8-flash",
            "result": analysis_dict
        }
    )

    # Update document status to complete
    FirestoreService.save_document_meta(uid, document_id, {"analysisStatus": "complete", "analysisId": analysis_id})

    return {
        "status": "success",
        "analysisId": analysis_id,
        "documentId": document_id,
        "analysis": analysis_dict
    }

@router.get("/{document_id}")
async def get_document_analysis(
    document_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    GET /api/analysis/{document_id}
    Retrieve existing AI analysis from Firestore for a document owned by the user.
    """
    uid = current_user.get("uid")
    doc_meta = FirestoreService.get_document_meta(uid, document_id)
    if not doc_meta:
        raise HTTPException(status_code=403, detail="Access denied")

    analysis_id = doc_meta.get("analysisId", document_id)
    analysis_record = FirestoreService.get_analysis(uid, analysis_id)
    
    if not analysis_record:
        raise HTTPException(status_code=404, detail="Analysis not found for this document.")

    return {
        "status": "success",
        "analysis": analysis_record.get("result", {})
    }
