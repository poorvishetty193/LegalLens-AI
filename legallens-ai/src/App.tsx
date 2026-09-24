import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { ForgotPassword } from "./pages/ForgotPassword";
import { Dashboard } from "./pages/Dashboard";
import { UploadDocument } from "./pages/UploadDocument";
import { Analysis } from "./pages/Analysis";
import { AskDocument } from "./pages/AskDocument";
import { CompareDocuments } from "./pages/CompareDocuments";
import { LawyerPreparation } from "./pages/LawyerPreparation";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadDocument />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analysis/:id"
            element={
              <ProtectedRoute>
                <Analysis />
              </ProtectedRoute>
            }
          />
          <Route
            path="/documents/:id/ask"
            element={
              <ProtectedRoute>
                <AskDocument />
              </ProtectedRoute>
            }
          />
          <Route
            path="/compare"
            element={
              <ProtectedRoute>
                <CompareDocuments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lawyer-prep"
            element={
              <ProtectedRoute>
                <LawyerPreparation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/documents/:id/lawyer-prep"
            element={
              <ProtectedRoute>
                <LawyerPreparation />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

