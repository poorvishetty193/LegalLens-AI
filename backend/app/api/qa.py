import uuid
from fastapi import APIRouter, Depends, HTTPException, Body
from app.auth.firebase_auth import get_current_user
from app.models.firestore_service import FirestoreService
from app.ai.gemini_service import GeminiAnalysisService
from app.ai.qa_schemas import AskQuestionRequest, AskQuestionResponseSchema

router = APIRouter(prefix="/api/documents", tags=["qa"])

@router.post("/{document_id}/ask")
async def ask_document_question(
    document_id: str,
    payload: AskQuestionRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    POST /api/documents/{document_id}/ask
    - Firebase authentication required
    - Derive UID from verified token
    - Reject empty/oversized question
    - Return 404 if document does not exist globally
    - Return 403 if document exists but belongs to another user
    - Run Gemini grounded Q&A
    - Save session and message to Firestore under /users/{uid}/chatSessions/{session_id}
    """
    uid = current_user.get("uid")
    if not uid:
        raise HTTPException(status_code=401, detail="Authentication failed")

    # 1. Question validation
    question = payload.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question cannot be empty.")
    if len(question) > 1000:
        raise HTTPException(status_code=400, detail="Question exceeds maximum allowed length of 1000 characters.")

    # 2. Document existence and ownership validation
    user_doc = FirestoreService.get_document_meta(uid, document_id)
    if not user_doc:
        # Check if doc exists for another user vs globally non-existent
        doc_exists_elsewhere = FirestoreService.check_document_exists_globally(document_id)
        if doc_exists_elsewhere:
            raise HTTPException(status_code=403, detail="Access denied: You do not own this document.")
        else:
            raise HTTPException(status_code=404, detail="Document not found.")

    # 3. Retrieve document analysis or extracted text for grounding
    analysis_rec = FirestoreService.get_analysis(uid, user_doc.get("analysisId", document_id))
    
    # Construct grounded context text
    if analysis_rec and "result" in analysis_rec:
        doc_result = analysis_rec["result"]
        document_context = f"SUMMARY: {doc_result.get('overall_summary', '')}\n\nIMPORTANT CLAUSES: {doc_result.get('important_clauses', [])}\n\nRISKS: {doc_result.get('risks', [])}\n\nOBLIGATIONS: {doc_result.get('obligations', [])}"
    else:
        document_context = f"Document: {user_doc.get('originalFileName', 'Agreement')}"

    # 4. Perform Grounded Q&A via Gemini API
    qa_response: AskQuestionResponseSchema = GeminiAnalysisService.answer_document_question(
        document_text=document_context,
        question=question
    )

    session_id = payload.session_id or str(uuid.uuid4())
    response_dict = qa_response.model_dump()

    # 5. Persist Chat Session & Message in Firestore (/users/{uid}/chatSessions/{session_id})
    FirestoreService.save_chat_message(
        uid=uid,
        session_id=session_id,
        doc_id=document_id,
        user_message=question,
        ai_response=response_dict
    )

    return {
        "status": "success",
        "sessionId": session_id,
        "documentId": document_id,
        "qa": response_dict
    }

@router.get("/{document_id}/chat-history")
async def get_chat_history(
    document_id: str,
    session_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Retrieve chat history for a session owned by the authenticated user."""
    uid = current_user.get("uid")
    session = FirestoreService.get_chat_session(uid, session_id)
    if not session or session.get("uid") != uid:
        raise HTTPException(status_code=403, detail="Access denied: Chat session not found or unauthorized.")

    messages = FirestoreService.get_chat_messages(uid, session_id)
    return {
        "status": "success",
        "sessionId": session_id,
        "messages": messages
    }
