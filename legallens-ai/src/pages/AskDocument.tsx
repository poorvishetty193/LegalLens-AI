import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  sources?: Array<{ page?: number; section?: string; excerpt?: string }>;
  confidence?: string;
  timestamp: string;
}

export const AskDocument: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getToken } = useAuth();

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const suggestedPrompts = [
    "What happens to my stock options if I leave in year 1?",
    "Is there a non-compete clause and what is its duration?",
    "What are the grounds for immediate termination by employer?"
  ];

  const handleSend = async (customQuestion?: string) => {
    const qText = customQuestion || question;
    if (!qText.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: qText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customQuestion) setQuestion("");
    setLoading(true);
    setError(null);

    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication required.");

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}/api/documents/${id}/ask`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            question: qText,
            session_id: sessionId
          })
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Failed to get AI answer.");
      }

      const data = await response.json();
      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: data.qa.answer,
        sources: data.qa.sources,
        confidence: data.qa.confidence,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setError(err?.message || "Failed to process question.");
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
          <span>Grounded Retrieval Mode Active • 100% Contract Evidence</span>
        </div>
        <div className="font-code-clause text-code-clause">Doc ID: {id}</div>
      </div>

      <div className="max-w-[1520px] mx-auto space-y-6">
        {/* Header Bar */}
        <header className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/40 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm mb-1">
              <span>Ask Document AI</span>
              <span>•</span>
              <span className="text-tertiary font-semibold">Zero-Hallucination Sandbox</span>
            </div>
            <h1 className="font-headline-md text-headline-md font-bold text-on-surface">
              Interactive Contract Q&A
            </h1>
          </div>
          <Link
            to={`/analysis/${id}`}
            className="px-4 py-2 bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md rounded-lg font-semibold border border-outline-variant/40"
          >
            View Full Analysis
          </Link>
        </header>

        {/* Grounding Guardrail Banner */}
        <div className="bg-tertiary-fixed/30 p-4 rounded-xl text-on-tertiary-fixed-variant flex items-center gap-3 border border-tertiary/20">
          <span className="material-symbols-outlined text-tertiary text-xl shrink-0">gavel</span>
          <p className="font-body-sm text-body-sm">
            <strong>Grounded Analysis Guardrail:</strong> Answers are extracted strictly from contract text. Questions requiring external legal speculation or missing document details will decline to answer.
          </p>
        </div>

        {/* Split-pane Workbench (xl:grid-cols-12) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Left 5 cols: Suggested Prompts & Sandbox Rules */}
          <div className="xl:col-span-5 space-y-4">
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/40 space-y-4">
              <h3 className="font-label-md text-label-md font-bold text-on-surface uppercase tracking-wide">
                Suggested Contract Prompts
              </h3>
              <div className="space-y-2">
                {suggestedPrompts.map((promptText, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(promptText)}
                    disabled={loading}
                    className="w-full text-left p-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-body-sm transition-all border border-outline-variant/20 flex items-start gap-2.5 group"
                  >
                    <span className="material-symbols-outlined text-[16px] text-primary mt-0.5 group-hover:translate-x-0.5 transition-transform">
                      help_outline
                    </span>
                    <span>{promptText}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/40 space-y-2">
              <div className="flex items-center gap-2 text-primary font-label-sm text-label-sm font-semibold">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Evidence Grounding Active
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Every AI response includes citations linking back to explicit clauses and page numbers in your contract.
              </p>
            </div>
          </div>

          {/* Right 7 cols: Chat Interface */}
          <div className="xl:col-span-7 bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/40 flex flex-col h-[640px]">
            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center text-on-surface-variant space-y-3">
                  <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-2xl">neurology</span>
                  </div>
                  <h4 className="font-headline-sm text-headline-sm font-semibold text-on-surface">Ask any question about this contract</h4>
                  <p className="font-body-sm text-body-sm max-w-sm">Select a suggested prompt or type your question below.</p>
                </div>
              )}

              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.sender === "user" ? (
                    <div className="max-w-[85%] bg-primary-container text-on-primary rounded-xl rounded-tr-xs p-4 shadow-sm space-y-1">
                      <p className="font-body-md text-body-md text-on-primary">{msg.text}</p>
                      <span className="font-label-sm text-[10px] text-on-primary/70 block text-right">{msg.timestamp}</span>
                    </div>
                  ) : (
                    <div className="max-w-[92%] bg-surface-container-low text-on-surface rounded-xl rounded-tl-xs p-4 shadow-sm space-y-3 border border-outline-variant/30">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary-container flex items-center justify-center text-on-primary">
                          <span className="material-symbols-outlined text-[14px]">neurology</span>
                        </span>
                        <span className="font-label-md text-label-md font-bold text-on-surface">LegalLens AI Assistant</span>
                        <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-semibold">
                          100% Grounded
                        </span>
                      </div>

                      <p className="font-body-md text-body-md text-on-surface leading-relaxed">{msg.text}</p>

                      {/* Source Citations */}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="space-y-1.5 pt-2 border-t border-outline-variant/20">
                          <span className="font-label-sm text-label-sm font-bold text-on-surface-variant uppercase tracking-wider block">
                            Document Citations
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {msg.sources.map((src, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container-high text-primary font-code-clause text-code-clause font-semibold border border-outline-variant/30">
                                <span className="material-symbols-outlined text-[14px]">link</span>
                                {src.page ? `Page ${src.page}` : ""} {src.section ? `• ${src.section}` : ""}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-surface-container-low p-4 rounded-xl rounded-tl-xs flex items-center gap-3 border border-outline-variant/30">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Searching contract text for citations...</span>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-2 p-3 bg-error-container/60 text-on-error-container rounded-lg font-label-sm text-label-sm border border-error/20">
                {error}
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="mt-4 pt-4 border-t border-outline-variant/30 flex gap-2"
            >
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask a question about this contract (e.g. non-compete duration, termination notice)..."
                rows={2}
                className="flex-1 bg-surface-container-low text-on-surface font-body-md text-body-md p-3 rounded-lg border border-outline-variant/30 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>
              <button
                type="submit"
                disabled={!question.trim() || loading}
                className="px-5 bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md rounded-lg font-semibold shadow-sm transition-all flex items-center justify-center disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-xl">send</span>
              </button>
            </form>
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
              LegalLens AI provides AI-assisted legal information and document analysis. It does not provide legal advice or replace a qualified legal professional.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};
