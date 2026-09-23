import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface DocItem {
  documentId: string;
  originalFileName: string;
  fileType: string;
  uploadedAt?: string;
}

export const CompareDocuments: React.FC = () => {
  const { getToken } = useAuth();
  const [userDocs, setUserDocs] = useState<DocItem[]>([]);
  const [docAId, setDocAId] = useState<string>("");
  const [docBId, setDocBId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [fetchingDocs, setFetchingDocs] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comparison, setComparison] = useState<any | null>(null);

  useEffect(() => {
    const loadDocs = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}/api/documents`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUserDocs(data.documents || []);
          if (data.documents && data.documents.length >= 2) {
            setDocAId(data.documents[0].documentId);
            setDocBId(data.documents[1].documentId);
          } else if (data.documents && data.documents.length === 1) {
            setDocAId(data.documents[0].documentId);
          }
        }
      } catch (err) {
        console.error("Failed to load documents:", err);
      } finally {
        setFetchingDocs(false);
      }
    };

    loadDocs();
  }, [getToken]);

  const handleCompare = async () => {
    if (!docAId || !docBId) {
      setError("Please select two documents to compare.");
      return;
    }

    if (docAId === docBId) {
      setError("Cannot compare a document with itself. Select two different documents.");
      return;
    }

    setLoading(true);
    setError(null);
    setComparison(null);

    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication required.");

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}/api/documents/compare`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            document_id_a: docAId,
            document_id_b: docBId
          })
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Document comparison failed.");
      }

      const data = await response.json();
      setComparison(data.comparison);
    } catch (err: any) {
      setError(err?.message || "Failed to run document comparison.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* System Bar */}
      <div className="bg-surface-container-high px-6 py-2 rounded-lg flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm border border-outline-variant/30">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
          <span>LegalLens AI Compare Engine • Active</span>
        </div>
        <div className="font-code-clause text-code-clause">Engine v4.19</div>
      </div>

      <div className="max-w-[1520px] mx-auto space-y-6">
        {/* Header Bar */}
        <header className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/40 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm mb-1">
              <span>Document Comparison</span>
              <span>•</span>
              <span className="text-tertiary font-semibold">Grounded Risk Delta</span>
            </div>
            <h1 className="font-headline-md text-headline-md font-bold text-on-surface">
              Side-by-Side Contract Comparison
            </h1>
          </div>
          <Link
            to="/upload"
            className="px-4 py-2 bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md rounded-lg font-semibold border border-outline-variant/40"
          >
            Upload New Document
          </Link>
        </header>

        {/* Document Selection Card */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/40 space-y-4">
          <h3 className="font-label-md text-label-md font-bold text-on-surface uppercase tracking-wide">
            Select Documents for Comparison
          </h3>

          {fetchingDocs ? (
            <p className="font-body-sm text-body-sm text-on-surface-variant">Loading your uploaded documents...</p>
          ) : userDocs.length < 2 ? (
            <div className="p-4 bg-surface-container-low rounded-lg text-on-surface-variant font-body-sm text-body-sm flex items-center justify-between">
              <span>You need at least 2 uploaded documents to compare versions.</span>
              <Link to="/upload" className="text-primary font-semibold hover:underline">
                Upload Second Document
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Document A Selector */}
              <div className="space-y-1.5">
                <label className="block font-label-sm text-label-sm font-semibold text-on-surface">
                  Base Document (Document A)
                </label>
                <select
                  value={docAId}
                  onChange={(e) => setDocAId(e.target.value)}
                  className="w-full bg-surface-container-low text-on-surface p-3 rounded-lg border border-outline-variant/40 font-body-md text-body-md focus:outline-none"
                >
                  {userDocs.map((doc) => (
                    <option key={doc.documentId} value={doc.documentId}>
                      {doc.originalFileName} ({doc.fileType.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Document B Selector */}
              <div className="space-y-1.5">
                <label className="block font-label-sm text-label-sm font-semibold text-on-surface">
                  Revised Document (Document B)
                </label>
                <select
                  value={docBId}
                  onChange={(e) => setDocBId(e.target.value)}
                  className="w-full bg-surface-container-low text-on-surface p-3 rounded-lg border border-outline-variant/40 font-body-md text-body-md focus:outline-none"
                >
                  {userDocs.map((doc) => (
                    <option key={doc.documentId} value={doc.documentId}>
                      {doc.originalFileName} ({doc.fileType.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-error-container/60 text-on-error-container rounded-lg font-label-sm text-label-sm border border-error/20">
              {error}
            </div>
          )}

          {userDocs.length >= 2 && (
            <button
              onClick={handleCompare}
              disabled={loading}
              className="w-full py-3 bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md rounded-lg shadow-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined">difference</span>
              {loading ? "Comparing Documents..." : "Run Side-by-Side Comparison"}
            </button>
          )}
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/40 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="font-label-md text-label-md font-semibold text-on-surface">
              Analyzing diffs, risk deltas, and clause modifications...
            </p>
          </div>
        )}

        {/* Comparison Output */}
        {comparison && (
          <div className="space-y-6">
            {/* Executive Summary & Risk Delta */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              <div className="xl:col-span-8 bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/40 space-y-3">
                <div className="flex items-center gap-2 text-primary font-label-md text-label-md font-semibold">
                  <span className="material-symbols-outlined text-[18px]">short_text</span>
                  Executive Comparison Summary
                </div>
                <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                  {comparison.executive_summary}
                </p>
              </div>

              <div className="xl:col-span-4 bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/40 space-y-3">
                <div className="flex items-center gap-2 text-accent-moderate font-label-md text-label-md font-semibold">
                  <span className="material-symbols-outlined text-[18px]">trending_up</span>
                  Attention Score Delta
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {comparison.attention_changes}
                </p>
              </div>
            </div>

            {/* Differences Stream */}
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/40 space-y-4">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Detailed Clause Diffs ({comparison.key_differences.length} Identified)
              </h3>

              <div className="space-y-4">
                {comparison.key_differences.map((diff: any, idx: number) => {
                  const badgeColor =
                    diff.change_type === "ADDED"
                      ? "bg-tertiary-fixed text-on-tertiary-fixed font-bold"
                      : diff.change_type === "REMOVED"
                      ? "bg-error-container text-on-error-container font-bold"
                      : "bg-surface-container-high text-primary font-bold";

                  return (
                    <div key={idx} className="p-6 rounded-xl bg-surface-container-low space-y-4 border border-outline-variant/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full font-label-sm text-label-sm ${badgeColor}`}>
                            {diff.change_type}
                          </span>
                          <span className="font-label-md text-label-md font-bold text-on-surface">{diff.category}</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm font-semibold uppercase">
                          {diff.severity} Severity
                        </span>
                      </div>

                      <h4 className="font-headline-sm text-headline-sm font-semibold text-on-surface">{diff.title}</h4>
                      <p className="font-body-md text-body-md text-on-surface-variant">{diff.description}</p>

                      {/* Side-by-Side Text Comparison */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        {/* Doc A Text */}
                        <div className="p-4 rounded-lg bg-surface-container-lowest border border-outline-variant/30 space-y-1">
                          <span className="font-label-sm text-label-sm font-bold text-on-surface-variant block uppercase tracking-wide">
                            {comparison.document_a_name} (Doc A)
                          </span>
                          <p className="font-code-clause text-code-clause text-on-surface">
                            {diff.document_a_text || <span className="italic text-on-surface-variant">[Not present in Document A]</span>}
                          </p>
                        </div>

                        {/* Doc B Text */}
                        <div className="p-4 rounded-lg bg-surface-container-lowest border border-outline-variant/30 space-y-1">
                          <span className="font-label-sm text-label-sm font-bold text-primary block uppercase tracking-wide">
                            {comparison.document_b_name} (Doc B)
                          </span>
                          <p className="font-code-clause text-code-clause text-on-surface">
                            {diff.document_b_text || <span className="italic text-on-surface-variant">[Removed in Document B]</span>}
                          </p>
                        </div>
                      </div>

                      <p className="font-body-sm text-body-sm text-on-surface italic pt-1">
                        <strong>Practical Impact:</strong> {diff.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Mandatory Legal Disclaimer Banner */}
        <footer className="p-4 rounded-xl bg-surface-container-low text-on-surface-variant flex items-start space-x-3 border border-outline-variant/30">
          <span className="material-symbols-outlined text-primary text-xl flex-shrink-0 mt-0.5">shield</span>
          <div className="text-left space-y-1">
            <p className="font-label-sm text-label-sm font-semibold text-on-surface uppercase tracking-wide">
              Analytical Intelligence Guardrail
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              LegalLens AI provides AI-assisted legal information and document analysis. It does not provide legal advice or replace a qualified legal professional.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};
