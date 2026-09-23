import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Analysis: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getToken } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"clauses" | "risks" | "obligations" | "omissions" | "questions">("clauses");

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        if (!token) throw new Error("Authentication required");

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}/api/analysis/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.detail || "Failed to fetch document analysis.");
        }

        const data = await response.json();
        setAnalysis(data.analysis);
      } catch (err: any) {
        setError(err?.message || "Failed to load analysis.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAnalysis();
  }, [id, getToken]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="font-label-md text-label-md text-on-surface font-semibold">
            Analyzing document with Gemini AI engine...
          </span>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-background p-8 flex flex-col items-center justify-center text-center">
        <div className="max-w-md bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/40 space-y-4">
          <div className="w-12 h-12 rounded-full bg-error-container text-error flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-2xl">warning</span>
          </div>
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">Analysis Error</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">{error || "No analysis available."}</p>
          <Link
            to="/upload"
            className="inline-block px-4 py-2 bg-primary-container text-on-primary font-label-md text-label-md rounded-lg font-semibold"
          >
            Return to Upload
          </Link>
        </div>
      </div>
    );
  }

  const attentionColorClass =
    analysis.attention_level === "critical"
      ? "text-error border-error/30 bg-error-container/40"
      : analysis.attention_level === "high"
      ? "text-accent-moderate border-accent-moderate/30 bg-orange-50"
      : "text-tertiary border-tertiary/30 bg-surface-container-low";

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* System Bar */}
      <div className="bg-surface-container-high px-6 py-2 rounded-lg flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm border border-outline-variant/30">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
          <span>LegalLens AI Engine • Verified Grounded Output</span>
        </div>
        <div className="font-code-clause text-code-clause">Doc ID: {id}</div>
      </div>

      <div className="max-w-[1520px] mx-auto space-y-6">
        {/* Document Header Bar */}
        <header className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm mb-1">
              <span>Document Analysis</span>
              <span>•</span>
              <span className="text-tertiary font-semibold">100% Grounded</span>
            </div>
            <h1 className="font-headline-md text-headline-md font-bold text-on-surface">
              Contract Analytical Breakdown
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to={`/documents/${id}/lawyer-prep`}
              className="px-4 py-2 bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md rounded-lg font-semibold border border-outline-variant/40 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">gavel</span>
              Lawyer Prep Brief
            </Link>
            <Link
              to={`/documents/${id}/ask`}
              className="px-4 py-2 bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md rounded-lg font-semibold shadow-sm transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">forum</span>
              Ask Document AI
            </Link>
            <Link
              to="/upload"
              className="px-4 py-2 bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md rounded-lg font-semibold border border-outline-variant/40"
            >
              Analyze Another
            </Link>
          </div>
        </header>

        {/* Top 12-Column Analytical Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
          {/* 4-col: Attention Score Arc Gauge Card */}
          <div className="xl:col-span-4 bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/40 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
                Attention & Risk Gauge
              </span>
              <span className={`px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-bold uppercase ${attentionColorClass}`}>
                {analysis.attention_level} Risk
              </span>
            </div>

            <div className="flex items-center gap-6 my-2">
              {/* Circular SVG Arc */}
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-surface-container-highest stroke-current"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeWidth="3.5"
                  />
                  <path
                    className={`${analysis.attention_score > 70 ? "text-error" : "text-primary"} stroke-current`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeDasharray={`${analysis.attention_score}, 100`}
                    strokeLinecap="round"
                    strokeWidth="3.5"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-headline-sm text-headline-sm font-bold text-on-surface">
                  {analysis.attention_score}
                </div>
              </div>

              <div className="space-y-1 font-label-sm text-label-sm text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-error"></span>
                  <span>Critical Risks: {analysis.risks.filter((r: any) => r.severity === 'high' || r.severity === 'critical').length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span>Clauses Scanned: {analysis.important_clauses.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                  <span>Key Dates: {analysis.key_dates.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 8-col: Executive Summary */}
          <div className="xl:col-span-8 bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/40 space-y-3">
            <div className="flex items-center gap-2 text-primary font-label-md text-label-md font-semibold">
              <span className="material-symbols-outlined text-[18px]">short_text</span>
              Executive Plain-English Summary
            </div>
            <p className="font-body-md text-body-md text-on-surface leading-relaxed">
              {analysis.overall_summary}
            </p>
          </div>
        </div>

        {/* Segmented Tab Navigation */}
        <div className="flex items-center gap-2 bg-surface-container-low p-1.5 rounded-xl border border-outline-variant/30 overflow-x-auto">
          <button
            onClick={() => setActiveTab("clauses")}
            className={`px-4 py-2 rounded-lg font-label-sm text-label-sm font-semibold transition-all ${
              activeTab === "clauses"
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Important Clauses ({analysis.important_clauses.length})
          </button>
          <button
            onClick={() => setActiveTab("risks")}
            className={`px-4 py-2 rounded-lg font-label-sm text-label-sm font-semibold transition-all ${
              activeTab === "risks"
                ? "bg-surface-container-lowest text-error shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Risks & Liabilities ({analysis.risks.length})
          </button>
          <button
            onClick={() => setActiveTab("obligations")}
            className={`px-4 py-2 rounded-lg font-label-sm text-label-sm font-semibold transition-all ${
              activeTab === "obligations"
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Obligations ({analysis.obligations.length})
          </button>
          <button
            onClick={() => setActiveTab("omissions")}
            className={`px-4 py-2 rounded-lg font-label-sm text-label-sm font-semibold transition-all ${
              activeTab === "omissions"
                ? "bg-surface-container-lowest text-accent-moderate shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Missing Info & Gaps ({analysis.missing_information.length})
          </button>
          <button
            onClick={() => setActiveTab("questions")}
            className={`px-4 py-2 rounded-lg font-label-sm text-label-sm font-semibold transition-all ${
              activeTab === "questions"
                ? "bg-surface-container-lowest text-tertiary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Lawyer Questions ({analysis.lawyer_questions.length})
          </button>
        </div>

        {/* Tab Content Stream */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          <div className="xl:col-span-8 space-y-4">
            {activeTab === "clauses" && (
              <div className="space-y-4">
                {analysis.important_clauses.map((clause: any, index: number) => (
                  <div key={index} className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold">
                        {clause.clause_type}
                      </span>
                      {clause.source_page && (
                        <span className="font-code-clause text-code-clause text-on-surface-variant">
                          Page {clause.source_page} {clause.source_section ? `• ${clause.source_section}` : ""}
                        </span>
                      )}
                    </div>
                    <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">{clause.title}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{clause.explanation}</p>
                    {clause.suggested_redline && (
                      <div className="p-3 bg-surface-container-low rounded-lg font-code-clause text-code-clause text-on-surface border border-outline-variant/30">
                        <strong className="block text-primary font-semibold mb-1">Recommended Redline:</strong>
                        {clause.suggested_redline}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "risks" && (
              <div className="space-y-4">
                {analysis.risks.map((risk: any, index: number) => (
                  <div key={index} className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-error/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold uppercase">
                        {risk.severity} Severity Risk
                      </span>
                      {risk.source_page && (
                        <span className="font-code-clause text-code-clause text-on-surface-variant">
                          Page {risk.source_page}
                        </span>
                      )}
                    </div>
                    <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">{risk.title}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{risk.explanation}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "obligations" && (
              <div className="space-y-4">
                {analysis.obligations.map((ob: any, index: number) => (
                  <div key={index} className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/40 space-y-2">
                    <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
                      <span className="font-semibold text-primary">Responsible Party: {ob.party}</span>
                      {ob.deadline && <span className="font-code-clause text-code-clause text-error">Deadline: {ob.deadline}</span>}
                    </div>
                    <p className="font-body-md text-body-md text-on-surface">{ob.obligation}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "omissions" && (
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/40 space-y-3">
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Missing Protections & Contractual Gaps</h3>
                <ul className="space-y-2">
                  {analysis.missing_information.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 font-body-md text-body-md text-on-surface-variant">
                      <span className="material-symbols-outlined text-accent-moderate text-xl shrink-0">visibility_off</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "questions" && (
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/40 space-y-3">
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Recommended Questions for Counsel</h3>
                <div className="space-y-3">
                  {analysis.lawyer_questions.map((q: string, index: number) => (
                    <div key={index} className="p-3 bg-surface-container-low rounded-lg flex items-start gap-3 font-body-md text-body-md text-on-surface">
                      <span className="font-code-clause text-code-clause text-primary font-bold">{index + 1}</span>
                      <p className="flex-1">{q}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* xl:col-span-4 Contextual Rail */}
          <div className="xl:col-span-4 space-y-6">
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/40 space-y-3">
              <h4 className="font-label-md text-label-md font-bold text-on-surface uppercase tracking-wide">Key Dates & Deadlines</h4>
              {analysis.key_dates.length === 0 ? (
                <p className="font-body-sm text-body-sm text-on-surface-variant">No explicit dates found.</p>
              ) : (
                <div className="space-y-2">
                  {analysis.key_dates.map((kd: any, idx: number) => (
                    <div key={idx} className="p-3 bg-surface-container-low rounded-lg space-y-1">
                      <span className="font-label-sm text-label-sm font-semibold text-on-surface">{kd.description}</span>
                      {kd.date && <div className="font-code-clause text-code-clause text-primary">{kd.date}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mandatory Legal Disclaimer Banner */}
        <footer className="p-4 rounded-xl bg-surface-container-low text-on-surface-variant flex items-start space-x-3 border border-outline-variant/30">
          <span className="material-symbols-outlined text-primary text-xl flex-shrink-0 mt-0.5">shield</span>
          <div className="text-left space-y-1">
            <p className="font-label-sm text-label-sm font-semibold text-on-surface uppercase tracking-wide">
              Analytical Intelligence Guardrail
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              {analysis.disclaimer}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};
