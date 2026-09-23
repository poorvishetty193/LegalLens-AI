import uuid
from fastapi import APIRouter, Depends, HTTPException
from app.auth.firebase_auth import get_current_user
from app.models.firestore_service import FirestoreService
from app.ai.gemini_service import GeminiAnalysisService
from app.ai.lawyer_schemas import LawyerBriefRequest, LawyerBriefResponseSchema

router = APIRouter(prefix="/api/documents", tags=["lawyer-preparation"])

@router.post("/{document_id}/lawyer-brief")
async def generate_lawyer_brief_endpoint(
    document_id: str,
    payload: LawyerBriefRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    POST /api/documents/{document_id}/lawyer-brief
    Requirements:
    - Firebase authentication required.
    - Derive UID from verified Firebase token.
    - Verify document ownership (404 if nonexistent globally, 403 if owned by another user).
    - Validate request size / concerns.
    - Fetch document analysis & QA history for inputs.
    - Validate Gemini response using Pydantic.
    - Save in Firestore under /users/{uid}/lawyerBriefs/{briefId}.
    """
    uid = current_user.get("uid")
    if not uid:
        raise HTTPException(status_code=401, detail="Authentication failed")

    # 1. Verify document ownership
    doc_meta = FirestoreService.get_document_meta(uid, document_id)
    if not doc_meta:
        if FirestoreService.check_document_exists_globally(document_id):
            raise HTTPException(status_code=403, detail="Access denied: You do not own this document.")
        else:
            raise HTTPException(status_code=404, detail="Document not found.")

    # 2. Retrieve document analysis
    analysis_record = FirestoreService.get_analysis(uid, document_id)
    if not analysis_record or "result" not in analysis_record:
        raise HTTPException(
            status_code=400,
            detail="Document has not been analyzed yet. Please run initial analysis first."
        )

    analysis_data = analysis_record["result"]

    # User concerns
    user_concerns = payload.user_concerns or ""

    # 3. Call Gemini service to generate lawyer brief
    brief_schema: LawyerBriefResponseSchema = GeminiAnalysisService.generate_lawyer_brief(
        analysis_data=analysis_data,
        user_concerns=user_concerns
    )

    brief_id = str(uuid.uuid4())
    brief_dict = brief_schema.model_dump()

    # 4. Save to Firestore under /users/{uid}/lawyerBriefs/{briefId}
    FirestoreService.save_lawyer_brief(
        uid=uid,
        brief_id=brief_id,
        doc_id=document_id,
        brief_data=brief_dict
    )

    return {
        "status": "success",
        "briefId": brief_id,
        "documentId": document_id,
        "result": brief_dict
    }

@router.get("/lawyer-briefs/{brief_id}")
async def get_lawyer_brief_endpoint(
    brief_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get stored lawyer brief by briefId."""
    uid = current_user.get("uid")
    brief_record = FirestoreService.get_lawyer_brief(uid, brief_id)
    if not brief_record or brief_record.get("uid") != uid:
        raise HTTPException(status_code=403, detail="Access denied: Lawyer brief not found or unauthorized.")

    return {
        "status": "success",
        "brief": brief_record
    }
