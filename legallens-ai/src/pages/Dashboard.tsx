import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Top System Bar */}
      <div className="bg-surface-container-high px-6 py-2 rounded-lg flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm mb-6 border border-outline-variant/30">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
          <span>System Status: Optimal • Engine v4.19</span>
        </div>
        <div className="font-code-clause text-code-clause">UID: {user?.uid}</div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/40 flex items-center justify-between">
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-on-surface">
              Dashboard
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Welcome back, <span className="font-semibold text-on-surface">{user?.displayName || user?.email}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/lawyer-prep"
              className="px-4 py-2 bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md rounded-lg shadow-sm font-semibold border border-outline-variant/40 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">gavel</span>
              Lawyer Prep
            </Link>
            <Link
              to="/compare"
              className="px-4 py-2 bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md rounded-lg shadow-sm font-semibold border border-outline-variant/40 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">difference</span>
              Compare Documents
            </Link>
            <Link
              to="/upload"
              className="px-4 py-2 bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md rounded-lg shadow-sm font-semibold transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">upload_file</span>
              Upload Document
            </Link>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md rounded-lg shadow-sm border border-outline-variant/40 transition-all"
            >
              Sign Out
            </button>
          </div>
        </header>

        <main className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/40 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-low text-primary rounded-full font-label-sm text-label-sm font-semibold">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            Authentication Verified
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            You are logged in as <strong className="text-on-surface">{user?.email}</strong>. Protected routes are active.
          </p>
        </main>
      </div>
    </div>
  );
};
