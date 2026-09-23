import unittest
from unittest.mock import patch, MagicMock
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from app.auth.firebase_auth import get_current_user
from app.models.firestore_service import FirestoreService

class TestAuthenticationAndSecurity(unittest.IsolatedAsyncioTestCase):

    @patch("app.auth.firebase_auth.auth.verify_id_token")
    async def test_valid_firebase_token(self, mock_verify):
        """Test authentication succeeds with a valid Firebase ID token."""
        mock_verify.return_value = {
            "uid": "user_abc123",
            "email": "sarah@legallens.ai",
            "name": "Sarah Jenkins",
            "picture": "https://example.com/avatar.jpg"
        }
        
        credentials = HTTPAuthorizationCredentials(
            scheme="Bearer",
            credentials="valid_token_xyz"
        )
        
        user = await get_current_user(credentials)
        self.assertEqual(user["uid"], "user_abc123")
        self.assertEqual(user["email"], "sarah@legallens.ai")
        mock_verify.assert_called_once_with("valid_token_xyz")

    async def test_missing_firebase_token(self):
        """Test request without Authorization header is rejected with 401."""
        with self.assertRaises(HTTPException) as cm:
            await get_current_user(None)
        self.assertEqual(cm.exception.status_code, 401)
        self.assertIn("Missing authorization token", cm.exception.detail)

    @patch("app.auth.firebase_auth.auth.verify_id_token")
    async def test_invalid_firebase_token(self, mock_verify):
        """Test request with invalid Firebase token is rejected with 401."""
        from firebase_admin.auth import InvalidIdTokenError
        mock_verify.side_effect = InvalidIdTokenError("Invalid token signature")
        
        credentials = HTTPAuthorizationCredentials(
            scheme="Bearer",
            credentials="invalid_token_xyz"
        )
        
        with self.assertRaises(HTTPException) as cm:
            await get_current_user(credentials)
        self.assertEqual(cm.exception.status_code, 401)
        self.assertIn("Invalid auth token", cm.exception.detail)

    @patch("app.auth.firebase_auth.auth.verify_id_token")
    async def test_expired_firebase_token(self, mock_verify):
        """Test request with expired Firebase token is rejected with 401."""
        from firebase_admin.auth import ExpiredIdTokenError
        mock_verify.side_effect = ExpiredIdTokenError("Token has expired", None)
        
        credentials = HTTPAuthorizationCredentials(
            scheme="Bearer",
            credentials="expired_token_xyz"
        )
        
        with self.assertRaises(HTTPException) as cm:
            await get_current_user(credentials)
        self.assertEqual(cm.exception.status_code, 401)
        self.assertIn("Token has expired", cm.exception.detail)

    @patch("app.auth.firebase_auth.auth.verify_id_token")
    async def test_authenticated_user_uid_extraction(self, mock_verify):
        """Test that UID extracted from verified token is never user-controlled."""
        mock_verify.return_value = {"uid": "verified_system_uid_789"}
        credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials="token")
        user = await get_current_user(credentials)
        self.assertEqual(user["uid"], "verified_system_uid_789")

    @patch("app.models.firestore_service.get_firestore_db")
    def test_user_ownership_validation(self, mock_get_db):
        """Test user document meta lookup is strictly scoped to user's UID path."""
        mock_db = MagicMock()
        mock_get_db.return_value = mock_db
        
        doc_mock = MagicMock()
        doc_mock.exists = True
        doc_mock.to_dict.return_value = {"documentId": "doc_1", "fileName": "contract.pdf"}
        
        mock_db.collection.return_value.document.return_value.collection.return_value.document.return_value.get.return_value = doc_mock
        
        result = FirestoreService.get_document_meta("user_123", "doc_1")
        
        # Verify call path uses /users/{uid}/documents/{doc_id}
        mock_db.collection.assert_called_with("users")
        mock_db.collection().document.assert_called_with("user_123")
        self.assertEqual(result["fileName"], "contract.pdf")

if __name__ == "__main__":
    unittest.main()
