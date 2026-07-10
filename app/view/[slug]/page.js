"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  LuLock as LockIcon,
  LuEye as Eye,
  LuEyeOff as EyeOff,
  LuClock as Clock,
  LuCircleAlert as AlertCircle,
  LuShieldCheck as ShieldCheck,
  LuFileText as FileIcon,
  LuX as CloseIcon,
  LuMessageSquare as MessageIcon,
  LuSend as SendIcon,
  LuCircleCheck as CheckCircle,
} from "react-icons/lu";
import { fetchTemplateBySlug, getDownloadUrl, submitCommentBySlug } from "@/lib/templates-api";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "https://srm-crm-backend.onrender.com"
).replace(/\/$/, "");

export default function SecureViewerPage() {
  const params = useParams();
  const slug = params.slug;

  // States
  const [phase, setPhase] = useState("loading"); // loading | password | viewing | expired | error
  const [templateInfo, setTemplateInfo] = useState(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [blobUrl, setBlobUrl] = useState(null);
  const [mimeType, setMimeType] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [passwordVerifying, setPasswordVerifying] = useState(false);

  // Comment states (for expired phase)
  const [comment, setComment] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentSubmitted, setCommentSubmitted] = useState(false);
  const [commentError, setCommentError] = useState("");

  const iframeRef = useRef(null);
  const timerRef = useRef(null);
  const docxContainerRef = useRef(null);
  const slideContainerRef = useRef(null);

  // PPTX rendering states
  const [slides, setSlides] = useState([]);
  const [renderingPptx, setRenderingPptx] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [slideScale, setSlideScale] = useState(1);

  const isDocx =
    mimeType.includes("wordprocessingml") ||
    mimeType.includes("msword") ||
    templateInfo?.template_file_ext === ".docx" ||
    templateInfo?.template_file_ext === ".doc";

  const isPptx =
    mimeType.includes("presentationml") ||
    mimeType.includes("powerpoint") ||
    templateInfo?.template_file_ext === ".pptx" ||
    templateInfo?.template_file_ext === ".ppt";

  // Step 1: Load template metadata by slug
  useEffect(() => {
    if (!slug) return;

    async function loadMeta() {
      try {
        const info = await fetchTemplateBySlug(slug);
        setTemplateInfo(info);

        // Check if already expired (only if firstViewedAt has been initialized)
        if (info.template_blob_url_epires_duriation > 0 && info.firstViewedAt) {
          const firstViewed = new Date(info.firstViewedAt);
          const expiresAt = new Date(
            firstViewed.getTime() +
              info.template_blob_url_epires_duriation * 60 * 1000
          );
          if (new Date() > expiresAt) {
            setPhase("expired");
            return;
          }
        }

        // Check if inactive
        if (info.template_url_status === "inactive") {
          setErrorMessage("This link has been deactivated by the administrator.");
          setPhase("error");
          return;
        }

        setPhase("password");
      } catch (err) {
        setErrorMessage(
          err.message || "This link is invalid or has been removed."
        );
        setPhase("error");
      }
    }

    loadMeta();
  }, [slug]);

  // Step 2: Verify password and fetch file as blob
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setPasswordVerifying(true);

    if (!password.trim()) {
      setErrorMessage("Please enter the access password.");
      setPasswordVerifying(false);
      return;
    }

    try {
      // Fetch the file from backend download route with password.
      // We need to know the actual filename first. To do this, we query the
      // backend slug endpoint which returns templateInfo. But templateInfo
      // does NOT expose the filename for security. So we need a different
      // approach: use the slug itself as the lookup key in the download route.
      // Let's add a slug-based download on the backend... Actually the download
      // route uses the internal filename. Let's use the slug-based verification
      // endpoint that returns the file details when password is correct.

      // We'll fetch via a special endpoint: /template-blob-url/view-file/:slug?password=xxx
      // But we don't have that yet. Instead, let's fetch using the existing download
      // route pattern. The backend getTemplateFileDetails finds by filename.
      // Since we don't have the filename from the frontend (it's hidden for security),
      // we'll create a new proxy approach: fetch from /template-blob-url/download-by-slug/:slug?password=xxx

      // Actually, the simplest approach: make a fetch directly to the backend
      // and use the slug to look up the record + verify password in one call.
      const res = await fetch(
        `${API_BASE_URL}/template-blob-url/view-file/${slug}?password=${encodeURIComponent(password)}`,
        { cache: "no-store" }
      );

      if (!res.ok) {
        let msg = "Invalid password or access denied.";
        try {
          const err = await res.json();
          msg = err.message || msg;
        } catch {
          // ignore
        }
        setErrorMessage(msg);
        setPasswordVerifying(false);
        return;
      }

      const contentType = res.headers.get("content-type") || "application/octet-stream";
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      setBlobUrl(url);
      setMimeType(contentType);

      // Calculate remaining seconds
      if (templateInfo && templateInfo.template_blob_url_epires_duriation > 0) {
        const baseDateString = templateInfo.firstViewedAt || new Date().toISOString();
        const baseDate = new Date(baseDateString);
        const expiresAt = new Date(
          baseDate.getTime() +
            templateInfo.template_blob_url_epires_duriation * 60 * 1000
        );
        const nowMs = Date.now();
        const remainMs = expiresAt.getTime() - nowMs;
        if (remainMs <= 0) {
          setPhase("expired");
          setPasswordVerifying(false);
          return;
        }
        setRemainingSeconds(Math.floor(remainMs / 1000));
        
        if (!templateInfo.firstViewedAt) {
          setTemplateInfo(prev => ({
            ...prev,
            firstViewedAt: baseDateString
          }));
        }
      }

      setPhase("viewing");
      setPasswordVerifying(false);
    } catch (err) {
      setErrorMessage(err.message || "Failed to verify password.");
      setPasswordVerifying(false);
    }
  };

  const handleExpire = useCallback(() => {
    // Clear blob URL and revoke object URL
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
      setBlobUrl(null);
    }
    setPhase("expired");
  }, [blobUrl]);

  // Step 3: Live countdown timer
  useEffect(() => {
    if (phase !== "viewing") return;
    if (!templateInfo || templateInfo.template_blob_url_epires_duriation === 0) return;

    const checkExpiry = () => {
      const baseDateString = templateInfo.firstViewedAt || new Date().toISOString();
      const baseDate = new Date(baseDateString);
      const expiresAt = new Date(
        baseDate.getTime() +
          templateInfo.template_blob_url_epires_duriation * 60 * 1000
      );
      const nowMs = Date.now();
      const remainMs = expiresAt.getTime() - nowMs;
      const remainSecs = Math.max(0, Math.floor(remainMs / 1000));

      setRemainingSeconds(remainSecs);

      if (remainSecs <= 0) {
        handleExpire();
        return true;
      }
      return false;
    };

    const expired = checkExpiry();
    if (expired) return;

    const interval = setInterval(() => {
      checkExpiry();
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, templateInfo, handleExpire]);

  // Step 4: Prevent right-click, Ctrl+S, Ctrl+P, PrintScreen
  useEffect(() => {
    if (phase !== "viewing") return;

    const handleContextMenu = (e) => e.preventDefault();

    const handleKeyDown = (e) => {
      // Block Ctrl+S, Ctrl+P, Ctrl+C, Ctrl+A, F12, PrintScreen
      if (
        (e.ctrlKey && (e.key === "s" || e.key === "S")) ||
        (e.ctrlKey && (e.key === "p" || e.key === "P")) ||
        (e.ctrlKey && (e.key === "c" || e.key === "C")) ||
        (e.ctrlKey && (e.key === "a" || e.key === "A")) ||
        e.key === "F12" ||
        e.key === "PrintScreen"
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [phase]);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [blobUrl]);

  // Step 5: Render Word document inline (.docx / .doc)
  useEffect(() => {
    if (phase !== "viewing" || !blobUrl || !isDocx || !docxContainerRef.current) return;

    let active = true;

    async function renderDocx() {
      try {
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        const docx = await import("docx-preview");
        if (active && docxContainerRef.current) {
          docxContainerRef.current.innerHTML = ""; // Clear loaders
          await docx.renderAsync(blob, docxContainerRef.current, null, {
            className: "docx",
            inWrapper: true,
            ignoreWidth: false,
            ignoreHeight: false,
            experimental: true,
          });
        }
      } catch (err) {
        console.error("Error rendering docx:", err);
        if (active && docxContainerRef.current) {
          docxContainerRef.current.innerHTML = `
            <div class="text-center p-8 space-y-3">
              <p class="text-xs font-bold text-red-400">Failed to render Word document inline.</p>
              <p class="text-[10px] text-slate-500 font-semibold">Please contact your administrator.</p>
            </div>
          `;
        }
      }
    }

    renderDocx();

  }, [phase, blobUrl, isDocx]);

  // Step 6: Handle PPTX slide scaling dynamically based on container width
  useEffect(() => {
    if (phase !== "viewing" || !slideContainerRef.current || slides.length === 0) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        const scale = width / 960;
        setSlideScale(scale);
      }
    });

    resizeObserver.observe(slideContainerRef.current);
    return () => resizeObserver.disconnect();
  }, [phase, slides]);

  // Step 7: Parse and convert PowerPoint slides (.pptx / .ppt)
  useEffect(() => {
    if (phase !== "viewing" || !blobUrl || !isPptx) return;

    let active = true;

    async function renderPptx() {
      setRenderingPptx(true);
      try {
        const response = await fetch(blobUrl);
        const arrayBuffer = await response.arrayBuffer();
        const { pptxToHtml } = await import("@jvmr/pptx-to-html");
        
        const slidesHtml = await pptxToHtml(arrayBuffer, {
          width: 960,
          height: 540,
          scaleToFit: true,
          letterbox: true,
        });

        if (active) {
          setSlides(slidesHtml);
          setCurrentSlideIndex(0);
        }
      } catch (err) {
        console.error("Error rendering pptx:", err);
      } finally {
        if (active) {
          setRenderingPptx(false);
        }
      }
    }

    renderPptx();

    return () => {
      active = false;
    };
  }, [phase, blobUrl, isPptx]);

  // Format remaining time
  const formatTime = (totalSec) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // --- RENDER ---

  // Loading state
  if (phase === "loading") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary-500 border-t-transparent mx-auto" />
          <p className="text-xs font-bold text-slate-500">Verifying secure link...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (phase === "error") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="w-full max-w-sm rounded-3xl border border-red-200 bg-white p-8 shadow-2xl text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500 border border-red-100">
            <AlertCircle size={28} />
          </div>
          <h1 className="text-sm font-bold text-slate-800">Access Denied</h1>
          <p className="text-xs text-slate-500 font-semibold">{errorMessage}</p>

        </div>
      </div>
    );
  }

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentError("");

    if (!comment.trim()) {
      setCommentError("Please enter a comment before submitting.");
      return;
    }

    setCommentSubmitting(true);
    try {
      await submitCommentBySlug(slug, comment.trim());
      setCommentSubmitted(true);
    } catch (err) {
      setCommentError(err.message || "Failed to submit comment.");
    } finally {
      setCommentSubmitting(false);
    }
  };

  // Expired state
  if (phase === "expired") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="w-full max-w-md rounded-3xl border border-amber-200 bg-white p-8 shadow-2xl text-center space-y-5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
            <Clock size={28} />
          </div>
          <h1 className="text-sm font-bold text-slate-800">Link Expired</h1>
          <p className="text-xs text-slate-500 font-semibold">
            This secure viewing session has expired. The document is no longer accessible through this link.
          </p>
          <p className="text-[10px] text-slate-400 font-bold">
            Contact the administrator for a new link with a fresh password.
          </p>

          {/* Comment / Feedback Section */}
          <div className="border-t border-slate-100 pt-5 text-left space-y-3">
            <div className="flex items-center gap-2">
              <MessageIcon size={14} className="text-slate-500" />
              <span className="text-[11px] font-bold text-slate-700">Send a Comment to Admin</span>
            </div>

            {commentSubmitted ? (
              <div className="flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50/50 p-3">
                <CheckCircle size={14} className="text-teal-600 shrink-0" />
                <p className="text-[11px] font-semibold text-teal-700">
                  Your comment has been sent to the administrator. Thank you!
                </p>
              </div>
            ) : (
              <form onSubmit={handleCommentSubmit} className="space-y-3">
                <textarea
                  rows={3}
                  placeholder="e.g. I need more time to review the document, please resend the link."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all resize-none"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />

                {commentError && (
                  <p className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                    <AlertCircle size={11} /> {commentError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={commentSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary-600 py-2.5 text-xs font-bold text-white hover:bg-primary-700 disabled:bg-primary-300 transition-all cursor-pointer shadow-sm shadow-primary-500/10"
                >
                  {commentSubmitting ? (
                    <>
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <SendIcon size={13} /> Send Comment
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Password prompt state
  if (phase === "password") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 via-primary-50/20 to-slate-100 p-4">
        <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 border border-primary-100">
              <LockIcon size={28} />
            </div>
            <h1 className="text-sm font-bold text-slate-800">Secure Document Access</h1>
            <p className="text-[10px] text-slate-400 font-semibold">
              &quot;{templateInfo?.template_blob_url_name || "Document"}&quot; is password protected.
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <label className="block">
              <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider flex items-center gap-1">
                Access Password <span className="text-red-500">*</span>
              </span>
              <div className="relative mt-1.5">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your access password"
                  autoFocus
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-3 pr-10 py-3 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            {errorMessage && (
              <p className="text-[10px] font-bold text-red-500 text-center flex items-center justify-center gap-1">
                <AlertCircle size={12} /> {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={passwordVerifying}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary-600 py-3 text-xs font-bold text-white hover:bg-primary-700 disabled:bg-primary-300 transition-all cursor-pointer shadow-sm shadow-primary-500/10"
            >
              {passwordVerifying ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Verifying...
                </>
              ) : (
                <>
                  <ShieldCheck size={14} /> Unlock &amp; View Document
                </>
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-[9px] text-slate-400 font-semibold">
              This document is view-only. Downloads, copying, and printing are disabled.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Viewing state — Secure embedded viewer
  if (phase === "viewing") {
    const urgentTimer = remainingSeconds <= 60;

    return (
      <div
        className="fixed inset-0 flex flex-col bg-slate-900"
        style={{ userSelect: "none", WebkitUserSelect: "none" }}
      >
        {/* Top bar with timer and info */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800 border-b border-slate-700 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-600/20 text-primary-400">
              <ShieldCheck size={14} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-200 truncate max-w-[300px]">
                {templateInfo?.template_blob_url_name || "Secure Document"}
              </p>
              <p className="text-[9px] font-semibold text-slate-500">
                View-only · Downloads disabled
              </p>
            </div>
          </div>

          {/* Countdown Timer */}
          {templateInfo?.template_blob_url_epires_duriation > 0 && (
            <div
              className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-bold border ${
                urgentTimer
                  ? "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse"
                  : "bg-slate-700/60 text-slate-300 border-slate-600"
              }`}
            >
              <Clock size={13} />
              <span className="tabular-nums">{formatTime(remainingSeconds)}</span>
              <span className="text-[9px] font-semibold opacity-70">remaining</span>
            </div>
          )}
        </div>

        {/* Document Viewer Area */}
        <div className="flex-1 relative overflow-hidden">
          {/* Transparent overlay to block interactions with the iframe content */}
          <div
            className="absolute inset-0 z-10"
            style={{ pointerEvents: "none" }}
            onContextMenu={(e) => e.preventDefault()}
          />

          {mimeType.includes("pdf") ? (
            <iframe
              ref={iframeRef}
              src={`${blobUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
              className="w-full h-full border-0"
              title="Secure Document Viewer"
              sandbox="allow-same-origin"
              style={{ pointerEvents: "auto" }}
            />
          ) : mimeType.includes("image") ? (
            <div className="flex items-center justify-center h-full p-8 bg-slate-900">
              <img
                src={blobUrl}
                alt="Secure Document"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
              />
            </div>
          ) : isDocx ? (
            <div className="w-full h-full overflow-y-auto bg-slate-900 p-4 md:p-8 flex flex-col items-center">
              <div
                ref={docxContainerRef}
                className="w-full max-w-4xl docx-container"
              >
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-slate-800 rounded-2xl border border-slate-700">
                  <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary-500 border-t-transparent mb-3" />
                  <p className="text-xs font-bold">Rendering Word document inline...</p>
                </div>
              </div>
            </div>
          ) : isPptx ? (
            <div className="w-full h-full overflow-y-auto bg-slate-900 p-4 md:p-8 flex flex-col items-center justify-start">
              {renderingPptx ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-4xl">
                  <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary-500 border-t-transparent mb-3 animate-bounce" />
                  <p className="text-xs font-bold">Rendering PowerPoint slides inline...</p>
                </div>
              ) : slides.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-4xl">
                  <p className="text-xs font-bold text-red-400">Failed to render PowerPoint presentation.</p>
                </div>
              ) : (
                <div className="w-full max-w-4xl flex flex-col items-center space-y-4">
                  {/* Active Slide Rendering Container */}
                  <div
                    ref={slideContainerRef}
                    className="w-full bg-white rounded-2xl border border-slate-700 shadow-2xl overflow-hidden relative"
                    style={{ aspectRatio: "16/9", position: "relative" }}
                  >
                    {/* The slide itself, scaled */}
                    <div
                      className="absolute left-0 top-0 origin-top-left"
                      style={{
                        transform: `scale(${slideScale})`,
                        width: "960px",
                        height: "540px",
                        position: "absolute",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        className="pptx-slide w-full h-full p-0 text-black select-none pointer-events-none"
                        dangerouslySetInnerHTML={{ __html: slides[currentSlideIndex] }}
                      />
                    </div>
                  </div>

                  {/* Navigation Controls */}
                  <div className="flex items-center justify-between w-full bg-slate-800/80 backdrop-blur border border-slate-700 px-4 py-3 rounded-xl shrink-0">
                    <button
                      onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
                      disabled={currentSlideIndex === 0}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-700 text-slate-200 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Previous
                    </button>
                    
                    <span className="text-xs font-bold text-slate-300">
                      Slide {currentSlideIndex + 1} of {slides.length}
                    </span>

                    <button
                      onClick={() => setCurrentSlideIndex(prev => Math.min(slides.length - 1, prev + 1))}
                      disabled={currentSlideIndex === slides.length - 1}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-700 text-slate-200 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Next
                    </button>
                  </div>

                  {/* Thumbnails list */}
                  <div className="flex items-center gap-2 overflow-x-auto py-2 w-full max-w-full no-scrollbar">
                    {slides.map((slide, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlideIndex(idx)}
                        className={`relative flex-shrink-0 w-28 aspect-[16/9] bg-white rounded-lg border-2 overflow-hidden cursor-pointer transition-all ${
                          idx === currentSlideIndex 
                            ? "border-primary-500 scale-105 shadow-md shadow-primary-500/20" 
                            : "border-slate-700 hover:border-slate-500 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <div 
                          className="w-full h-full p-1 text-[2px] leading-[3px] select-none pointer-events-none overflow-hidden scale-[0.15] origin-top-left"
                          style={{ width: "666%", height: "666%" }}
                          dangerouslySetInnerHTML={{ __html: slide }}
                        />
                        <div className="absolute bottom-1 right-1 bg-slate-900/80 px-1 py-0.5 rounded text-[8px] font-bold text-white leading-none">
                          {idx + 1}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-slate-400 border border-slate-700">
                <FileIcon size={32} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-300">
                  {templateInfo?.template_blob_url_name || "Document"}
                </p>
                <p className="text-[10px] text-slate-500 font-semibold mt-1">
                  This file format ({mimeType.split("/")[1] || "unknown"}) can only be viewed in its native application.
                </p>
                <p className="text-[10px] text-slate-600 font-semibold mt-0.5">
                  The file has been verified and is accessible during the countdown period.
                </p>
              </div>

              {/* For non-renderable files, allow inline viewing via object tag */}
              <object
                data={blobUrl}
                type={mimeType}
                className="w-full max-w-3xl h-[60vh] rounded-xl border border-slate-700 bg-white"
              >
                <p className="text-xs text-slate-500 p-4">
                  Your browser does not support inline viewing of this file type.
                </p>
              </object>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
