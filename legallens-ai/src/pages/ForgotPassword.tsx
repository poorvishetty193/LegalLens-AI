import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ForgotPassword: React.FC = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getFirebaseErrorMessage = (err: any): string => {
    const code = err?.code || "";
    switch (code) {
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/user-not-found":
        // For security, can give clear info or safe message. Requirement says: "Handle invalid/nonexistent email safely."
        return "If an account exists with this email, a password reset link has been sent.";
      default:
        return err?.message || "Failed to send password reset email. Please try again.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSuccess("Password reset email sent! Check your inbox for instructions to reset your password.");
    } catch (err: any) {
      const code = err?.code;
      if (code === "auth/user-not-found") {
        // Safe messaging for nonexistent email
        setSuccess("If an account exists with this email, a password reset link has been sent.");
      } else {
        setError(getFirebaseErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Ambient decorative blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-xl relative z-10 space-y-4">
        {/* Top Status Bar Pill */}
        <div className="bg-surface-container-lowest/80 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm border border-outline-variant/30 flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            <span>Zero-Retention AI • 256-Bit Encrypted Session</span>
          </div>
          <span className="font-code-clause text-code-clause text-on-surface-variant hidden sm:inline">SOC2 Type II</span>
        </div>

        {/* Elevated Card */}
        <div className="bg-surface-container-lowest rounded-xl shadow-xl p-8 sm:p-12 border border-outline-variant/40">
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center gap-2 bg-surface-container-low px-3 py-1 rounded-full text-primary font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[16px]">lock_reset</span>
              Password Recovery
            </div>
            <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
              Reset your password
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Enter your registered email address and we'll send you a link to reset your password.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-error-container/60 text-on-error-container rounded-lg font-label-sm text-label-sm border border-error/20 flex items-center gap-2">
              <span className="material-symbols-outlined text-base shrink-0">error</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-3 bg-tertiary-container/40 text-on-tertiary-container rounded-lg font-label-sm text-label-sm border border-tertiary/20 flex items-center gap-2">
              <span className="material-symbols-outlined text-base shrink-0 text-tertiary">check_circle</span>
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block font-label-md text-label-md text-on-surface font-medium mb-1.5">
                Work or Personal Email
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
                  <span className="material-symbols-outlined text-xl">alternate_email</span>
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-surface-container-lowest text-on-surface placeholder:text-outline font-body-md text-body-md rounded-lg border border-outline-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="name@organization.com"
                  aria-label="Work or Personal Email"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-lg bg-primary-container text-on-primary hover:bg-primary font-label-md text-label-md shadow-md transition-all group disabled:opacity-50"
            >
              <span>{loading ? "Sending link..." : "Send Reset Link"}</span>
              <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                send
              </span>
            </button>
          </form>

          <div className="mt-8 text-center text-on-surface-variant font-label-sm text-label-sm">
            Remembered your password?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Back to Sign in
            </Link>
          </div>
        </div>

        {/* Bottom Metrics Bar */}
        <div className="text-center font-code-clause text-code-clause text-on-surface-variant">
          Engine v4.19 • ID: LENS-AUTH-2026
        </div>
      </div>
    </div>
  );
};
