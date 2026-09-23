import logging
from typing import Dict, Any, List, Optional
from firebase_admin import firestore
from app.auth.firebase_auth import get_firestore_db

logger = logging.getLogger("legallens.firestore")

class FirestoreService:
    """Firestore CRUD service for user-isolated documents, analyses, chat sessions, and compare sessions."""

    @staticmethod
    def save_user_profile(uid: str, email: str, display_name: Optional[str] = None) -> None:
        """Create or update user document."""
        db = get_firestore_db()
        user_ref = db.collection("users").document(uid)
        user_ref.set({
            "uid": uid,
            "email": email,
            "displayName": display_name or "",
            "lastActiveAt": firestore.SERVER_TIMESTAMP
        }, merge=True)

    @staticmethod
    def save_document_meta(uid: str, doc_id: str, meta_data: Dict[str, Any]) -> None:
        """Save document metadata under /users/{uid}/documents/{doc_id}."""
        db = get_firestore_db()
        doc_ref = db.collection("users").document(uid).collection("documents").document(doc_id)
        payload = {
            "documentId": doc_id,
            "uploadedAt": firestore.SERVER_TIMESTAMP,
            **meta_data
        }
        doc_ref.set(payload, merge=True)

    @staticmethod
    def get_document_meta(uid: str, doc_id: str) -> Optional[Dict[str, Any]]:
        """Fetch single document metadata for ownership checking."""
        db = get_firestore_db()
        doc = db.collection("users").document(uid).collection("documents").document(doc_id).get()
        if doc.exists:
            return doc.to_dict()
        return None

    @staticmethod
    def check_document_exists_globally(doc_id: str) -> bool:
        """Helper to distinguish 404 (non-existent) from 403 (exists but owned by another user)."""
        db = get_firestore_db()
        query = db.collection_group("documents").where("documentId", "==", doc_id).limit(1).get()
        return len(query) > 0

    @staticmethod
    def list_user_documents(uid: str) -> List[Dict[str, Any]]:
        """List all document metadata belonging to a user."""
        db = get_firestore_db()
        docs = db.collection("users").document(uid).collection("documents").stream()
        return [d.to_dict() for d in docs]

    @staticmethod
    def save_analysis(uid: str, doc_id: str, analysis_data: Dict[str, Any]) -> None:
        """Save AI analysis result under /users/{uid}/analyses/{doc_id}."""
        db = get_firestore_db()
        analysis_ref = db.collection("users").document(uid).collection("analyses").document(doc_id)
        payload = {
            "documentId": doc_id,
            "createdAt": firestore.SERVER_TIMESTAMP,
            **analysis_data
        }
        analysis_ref.set(payload, merge=True)

    @staticmethod
    def get_analysis(uid: str, doc_id: str) -> Optional[Dict[str, Any]]:
        """Fetch AI analysis result by document ID."""
        db = get_firestore_db()
        analysis = db.collection("users").document(uid).collection("analyses").document(doc_id).get()
        if analysis.exists:
            return analysis.to_dict()
        return None

    @staticmethod
    def save_chat_message(uid: str, session_id: str, doc_id: str, user_message: str, ai_response: Dict[str, Any]) -> None:
        """Store chat session and messages under /users/{uid}/chatSessions/{session_id}."""
        db = get_firestore_db()
        session_ref = db.collection("users").document(uid).collection("chatSessions").document(session_id)
        
        session_data = {
            "sessionId": session_id,
            "documentId": doc_id,
            "uid": uid,
            "updatedAt": firestore.SERVER_TIMESTAMP
        }
        session_ref.set(session_data, merge=True)

        msg_ref = session_ref.collection("messages").document()
        msg_ref.set({
            "messageId": msg_ref.id,
            "question": user_message,
            "answer": ai_response.get("answer"),
            "sources": ai_response.get("sources", []),
            "confidence": ai_response.get("confidence", "high"),
            "createdAt": firestore.SERVER_TIMESTAMP
        })

    @staticmethod
    def get_chat_session(uid: str, session_id: str) -> Optional[Dict[str, Any]]:
        """Fetch chat session for ownership checking."""
        db = get_firestore_db()
        session = db.collection("users").document(uid).collection("chatSessions").document(session_id).get()
        if session.exists:
            return session.to_dict()
        return None

    @staticmethod
    def get_chat_messages(uid: str, session_id: str) -> List[Dict[str, Any]]:
        """List messages in a chat session."""
        db = get_firestore_db()
        messages = db.collection("users").document(uid).collection("chatSessions").document(session_id).collection("messages").order_by("createdAt").stream()
        return [m.to_dict() for m in messages]

    @staticmethod
    def save_comparison_session(uid: str, comparison_id: str, doc_a_id: str, doc_b_id: str, comparison_data: Dict[str, Any]) -> None:
        """Store comparison result under /users/{uid}/compareSessions/{comparisonId}."""
        db = get_firestore_db()
        comp_ref = db.collection("users").document(uid).collection("compareSessions").document(comparison_id)
        payload = {
            "comparisonId": comparison_id,
            "uid": uid,
            "documentIdA": doc_a_id,
            "documentIdB": doc_b_id,
            "model": "gemini-3.8-flash",
            "createdAt": firestore.SERVER_TIMESTAMP,
            "result": comparison_data
        }
        comp_ref.set(payload, merge=True)

    @staticmethod
    def get_comparison_session(uid: str, comparison_id: str) -> Optional[Dict[str, Any]]:
        """Fetch comparison session by comparisonId."""
        db = get_firestore_db()
        comp = db.collection("users").document(uid).collection("compareSessions").document(comparison_id).get()
        if comp.exists:
            return comp.to_dict()
        return None

    @staticmethod
    def save_lawyer_brief(uid: str, brief_id: str, doc_id: str, brief_data: Dict[str, Any]) -> None:
        """Store generated brief under /users/{uid}/lawyerBriefs/{briefId}."""
        db = get_firestore_db()
        brief_ref = db.collection("users").document(uid).collection("lawyerBriefs").document(brief_id)
        payload = {
            "briefId": brief_id,
            "documentId": doc_id,
            "uid": uid,
            "createdAt": firestore.SERVER_TIMESTAMP,
            "model": "gemini-3.8-flash",
            "result": brief_data
        }
        brief_ref.set(payload, merge=True)

    @staticmethod
    def get_lawyer_brief(uid: str, brief_id: str) -> Optional[Dict[str, Any]]:
        """Fetch generated lawyer brief by briefId."""
        db = get_firestore_db()
        brief = db.collection("users").document(uid).collection("lawyerBriefs").document(brief_id).get()
        if brief.exists:
            return brief.to_dict()
        return None

    @staticmethod
    def delete_document(uid: str, doc_id: str) -> bool:
        """Delete document metadata and analysis for a user."""
        db = get_firestore_db()
        user_ref = db.collection("users").document(uid)
        user_ref.collection("documents").document(doc_id).delete()
        user_ref.collection("analyses").document(doc_id).delete()
        return True

