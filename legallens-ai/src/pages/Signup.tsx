import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Signup: React.FC = () => {
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignup = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Failed to create account with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Ambient decorative blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-xl relative z-10 space-y-4">
        {/* Elevated Card */}
        <div className="bg-surface-container-lowest rounded-xl shadow-xl p-8 sm:p-12 border border-outline-variant/40">
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center gap-2 bg-surface-container-low px-3 py-1 rounded-full text-primary font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
              Create Account
            </div>
            <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
              Get Started with LegalLens AI
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Understand legal agreements with zero retention and instant risk analysis.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-error-container/60 text-on-error-container rounded-lg font-label-sm text-label-sm border border-error/20">
              {error}
            </div>
          )}

          {/* Federated Google SSO */}
          <div className="space-y-4">
            <button
              onClick={handleGoogleSignup}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md rounded-lg shadow-sm transition-all border border-outline-variant/40 group disabled:opacity-50"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span className="font-semibold">{loading ? "Connecting..." : "Sign up with Google"}</span>
            </button>
          </div>

          <div className="mt-8 text-center text-on-surface-variant font-label-sm text-label-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
