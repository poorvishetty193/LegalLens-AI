import uuid
from fastapi import APIRouter, Depends, HTTPException
from app.auth.firebase_auth import get_current_user
from app.models.firestore_service import FirestoreService
from app.ai.gemini_service import GeminiAnalysisService
from app.ai.comparison_schemas import DocumentComparisonRequest, DocumentComparisonResponseSchema

router = APIRouter(prefix="/api/documents", tags=["comparison"])

@router.post("/compare")
async def compare_documents_endpoint(
    payload: DocumentComparisonRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    POST /api/documents/compare
    - Firebase authentication required
    - Derive UID from verified token
    - Reject same-document comparison (400)
    - Validate both documents exist and belong to current user (404/403)
    - Run Gemini structured comparison pipeline
    - Save result in Firestore under /users/{uid}/compareSessions/{comparison_id}
    """
    uid = current_user.get("uid")
    if not uid:
        raise HTTPException(status_code=401, detail="Authentication failed")

    doc_a_id = payload.document_id_a
    doc_b_id = payload.document_id_b

    # 1. Reject same document comparison
    if doc_a_id == doc_b_id:
        raise HTTPException(status_code=400, detail="Cannot compare a document with itself. Please select two different documents.")

    # 2. Validate Document A existence and ownership
    doc_a_meta = FirestoreService.get_document_meta(uid, doc_a_id)
    if not doc_a_meta:
        if FirestoreService.check_document_exists_globally(doc_a_id):
            raise HTTPException(status_code=403, detail="Access denied: You do not own Document A.")
        else:
            raise HTTPException(status_code=404, detail="Document A not found.")

    # 3. Validate Document B existence and ownership
    doc_b_meta = FirestoreService.get_document_meta(uid, doc_b_id)
    if not doc_b_meta:
        if FirestoreService.check_document_exists_globally(doc_b_id):
            raise HTTPException(status_code=403, detail="Access denied: You do not own Document B.")
        else:
            raise HTTPException(status_code=404, detail="Document B not found.")

    # 4. Fetch extracted text/analyses for grounding
    analysis_a = FirestoreService.get_analysis(uid, doc_a_meta.get("analysisId", doc_a_id))
    analysis_b = FirestoreService.get_analysis(uid, doc_b_meta.get("analysisId", doc_b_id))

    doc_a_name = doc_a_meta.get("originalFileName", "Document A")
    doc_b_name = doc_b_meta.get("originalFileName", "Document B")

    doc_a_text = f"Title: {doc_a_name}\nSummary: {analysis_a.get('result', {}).get('overall_summary', '')}\nClauses: {analysis_a.get('result', {}).get('important_clauses', [])}\nRisks: {analysis_a.get('result', {}).get('risks', [])}" if analysis_a else f"Document A ({doc_a_name})"
    doc_b_text = f"Title: {doc_b_name}\nSummary: {analysis_b.get('result', {}).get('overall_summary', '')}\nClauses: {analysis_b.get('result', {}).get('important_clauses', [])}\nRisks: {analysis_b.get('result', {}).get('risks', [])}" if analysis_b else f"Document B ({doc_b_name})"

    # 5. Run Gemini Comparison
    comparison_res: DocumentComparisonResponseSchema = GeminiAnalysisService.compare_documents(
        doc_a_name=doc_a_name,
        doc_a_text=doc_a_text,
        doc_b_name=doc_b_name,
        doc_b_text=doc_b_text
    )

    comparison_id = str(uuid.uuid4())
    comp_dict = comparison_res.model_dump()

    # 6. Store comparison session in Firestore
    FirestoreService.save_comparison_session(
        uid=uid,
        comparison_id=comparison_id,
        doc_a_id=doc_a_id,
        doc_b_id=doc_b_id,
        comparison_data=comp_dict
    )

    return {
        "status": "success",
        "comparisonId": comparison_id,
        "documentIdA": doc_a_id,
        "documentIdB": doc_b_id,
        "comparison": comp_dict
    }

@router.get("/compare/{comparison_id}")
async def get_comparison_session(
    comparison_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Retrieve comparison session owned by the authenticated user."""
    uid = current_user.get("uid")
    comp = FirestoreService.get_comparison_session(uid, comparison_id)
    if not comp or comp.get("uid") != uid:
        raise HTTPException(status_code=403, detail="Access denied: Comparison session not found or unauthorized.")

    return {
        "status": "success",
        "comparison": comp.get("result", {})
    }
