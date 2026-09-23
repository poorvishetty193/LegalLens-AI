import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const UploadDocument: React.FC = () => {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);

    const ext = selectedFile.name.split(".").pop()?.toLowerCase();
    if (ext !== "pdf" && ext !== "docx") {
      setError("Unsupported file format. Please upload a PDF or DOCX contract.");
      return;
    }

    if (selectedFile.size > 4 * 1024 * 1024) {
      setError("File size exceeds 4 MB limit (Vercel deployment constraint).");
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setProgress(20);

    try {
      const token = await getToken();
      if (!token) {
        throw new Error("User authentication required.");
      }

      const formData = new FormData();
      formData.append("file", file);

      setProgress(40);

      // 1. Upload & Extract
      const uploadResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}/api/documents/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }
      );

      if (!uploadResponse.ok) {
        const errData = await uploadResponse.json();
        throw new Error(errData.detail || "Document parsing failed.");
      }

      const uploadData = await uploadResponse.json();
      const docId = uploadData.documentId;
      const fullText = uploadData.extraction.fullText;

      setUploading(false);
      setAnalyzing(true);
      setProgress(70);

      // 2. Trigger Gemini Analysis
      const analysisResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}/api/analysis/${docId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ extracted_text: fullText })
        }
      );

      if (!analysisResponse.ok) {
        const errData = await analysisResponse.json();
        throw new Error(errData.detail || "AI analysis failed.");
      }

      setProgress(100);
      navigate(`/analysis/${docId}`);

    } catch (err: any) {
      setError(err?.message || "Failed to process document.");
      setUploading(false);
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Top System Bar */}
      <div className="bg-surface-container-high px-6 py-2 rounded-lg flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm mb-6 border border-outline-variant/30">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
          <span>Zero-Retention Ephemeral Parser • Active</span>
        </div>
        <div className="font-code-clause text-code-clause">Engine v4.19</div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <header className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-surface-container-low px-3 py-1 rounded-full text-primary font-label-sm text-label-sm font-semibold">
            <span className="material-symbols-outlined text-[16px]">upload_file</span>
            Document Analysis Workbench
          </div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
            Upload Contract for Analysis
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mx-auto">
            Upload PDF or DOCX files for instant client-isolated Gemini AI legal analysis. No files are stored permanently in cloud storage.
          </p>
        </header>

        {/* Stitch-derived Drag & Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative group cursor-pointer rounded-xl border-2 border-dashed transition-all p-10 flex flex-col items-center justify-center text-center ${
            dragActive
              ? "bg-surface-container-high border-primary"
              : "bg-surface-container-lowest border-outline-variant/60 hover:bg-surface-container-low"
          }`}
        >
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer z-20"
          />

          <div className="w-14 h-14 rounded-xl bg-primary-fixed text-primary flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-2xl">cloud_upload</span>
          </div>

          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">
            Drag & drop your contract here, or{" "}
            <span className="text-primary underline decoration-primary/40 font-semibold">browse files</span>
          </h3>

          <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
            PDF or DOCX files up to 4MB. Instant ephemeral parsing.
          </p>

          <div className="inline-flex items-center gap-2 bg-surface-container-low px-3 py-1 rounded-full text-on-surface-variant font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-[16px] text-tertiary">lock</span>
            <span>Files are deleted immediately after text extraction</span>
          </div>
        </div>

        {/* Selected File Details & Upload Action */}
        {file && (
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/40 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-2xl">description</span>
                <div>
                  <h4 className="font-label-md text-label-md font-semibold text-on-surface">{file.name}</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for Gemini AI analysis
                  </p>
                </div>
              </div>
              <button
                onClick={() => setFile(null)}
                disabled={uploading || analyzing}
                className="text-on-surface-variant hover:text-error transition-colors p-2"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>

            {(uploading || analyzing) && (
              <div className="space-y-2">
                <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
                  <span>{uploading ? "Extracting document text..." : "Analyzing with Gemini AI..."}</span>
                  <span>{progress}%</span>
                </div>
              </div>
            )}

            {!uploading && !analyzing && (
              <button
                onClick={handleUploadAndAnalyze}
                className="w-full py-3 bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md rounded-lg shadow-sm font-semibold transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">auto_awesome</span>
                Upload & Perform Gemini AI Analysis
              </button>
            )}
          </div>
        )}

        {/* Validation Errors */}
        {error && (
          <div className="p-4 bg-error-container/60 text-on-error-container rounded-xl font-label-sm text-label-sm border border-error/30 flex items-start gap-3">
            <span className="material-symbols-outlined text-error text-xl shrink-0">error</span>
            <div>
              <strong className="block font-semibold">Validation Error</strong>
              <span>{error}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
