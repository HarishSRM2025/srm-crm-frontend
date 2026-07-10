"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import {
  LuUpload as UploadCloud,
  LuCopy as Copy,
  LuCheck as Check,
  LuTrash2 as Trash,
  LuEye as Eye,
  LuEyeOff as EyeOff,
  LuClock as Clock,
  LuCircleAlert as AlertCircle,
  LuFileText as FileIcon,
  LuSearch as Search,
  LuLock as LockIcon,
  LuCircleCheck as CheckCircle,
  LuX as CloseIcon,
  LuRefreshCw as RefreshIcon,
  LuMessageSquare as MessageIcon,
} from "react-icons/lu";
import {
  fetchTemplates,
  createTemplate,
  deleteTemplate,
  uploadTemplateFile,
  reactivateTemplate,
  getViewUrl,
} from "@/lib/templates-api";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Upload state
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form state
  const [name, setName] = useState("");
  const [expiresDuration, setExpiresDuration] = useState("10"); // Default 10 minutes
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("active");

  // Search/filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  // Reactivate modal state
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [reactivateTemplateId, setReactivateTemplateId] = useState(null);
  const [reactivateTemplateName, setReactivateTemplateName] = useState("");
  const [reactivatePassword, setReactivatePassword] = useState("");
  const [reactivateDuration, setReactivateDuration] = useState("10"); // Default 10 minutes
  const [showReactivatePassword, setShowReactivatePassword] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  async function loadTemplates() {
    setLoading(true);
    try {
      const data = await fetchTemplates();
      setTemplates(data);
    } catch (err) {
      setError(err.message || "Failed to load templates.");
    } finally {
      setLoading(false);
    }
  }

  // Handle drag/drop events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      if (!name) {
        const cleanName = droppedFile.name.replace(/\.[^/.]+$/, "");
        setName(cleanName.replace(/[-_]/g, " "));
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (!name) {
        const cleanName = selectedFile.name.replace(/\.[^/.]+$/, "");
        setName(cleanName.replace(/[-_]/g, " "));
      }
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  // Submit Template Blob creation
  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!file) {
      setError("Please drop or select a file first.");
      return;
    }
    if (!name.trim()) {
      setError("Please specify a name for this template.");
      return;
    }
    if (!password.trim()) {
      setError("Access password is required to publish a secure template link.");
      return;
    }
    if (parseInt(expiresDuration) <= 0 || isNaN(parseInt(expiresDuration))) {
      setError("Please enter a valid expiry duration in minutes (minimum 1).");
      return;
    }

    setUploading(true);

    // Simulate progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    try {
      // Step 1: Upload file to disk
      const uploadResult = await uploadTemplateFile(file);
      setUploadProgress(100);
      clearInterval(interval);

      // Step 2: Create Template Blob URL entry in Prisma
      await createTemplate({
        template_blob_url_name: name,
        template_file: uploadResult.filename,
        template_blob_url: "", // Auto-generated UUID is handled by backend service
        template_blob_url_epires_duriation: parseInt(expiresDuration),
        template_url_status: status,
        template_password: password,
      });

      setSuccess("Template published and secure link generated!");
      setFile(null);
      setName("");
      setPassword("");
      setExpiresDuration("10");
      setStatus("active");
      
      loadTemplates();
    } catch (err) {
      setError(err.message || "Failed to publish template.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Delete template
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this template link? This cannot be undone.")) {
      return;
    }
    try {
      await deleteTemplate(id);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      setSuccess("Template deleted successfully.");
    } catch (err) {
      setError("Failed to delete template.");
    }
  };

  // Copy blob link
  const handleCopyLink = (template) => {
    if (isExpired(template)) {
      setError("Cannot copy expired link. Please reactivate it first.");
      return;
    }
    const fullUrl = getViewUrl(template.template_blob_url);
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Check expiration status helpers
  const isExpired = (template) => {
    if (template.template_blob_url_epires_duriation === 0) return false;
    // If it hasn't been viewed yet, it's not expired
    if (!template.firstViewedAt) return false;

    const baseDate = new Date(template.firstViewedAt);
    const expiresAt = new Date(baseDate.getTime() + template.template_blob_url_epires_duriation * 60 * 1000);
    return new Date() > expiresAt;
  };

  const getExpirationBadge = (template) => {
    if (template.template_blob_url_epires_duriation === 0) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-200">
          No Expiry
        </span>
      );
    }

    if (!template.firstViewedAt) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700 border border-sky-100 animate-pulse">
          Starts on view ({template.template_blob_url_epires_duriation}m)
        </span>
      );
    }

    const baseDate = new Date(template.firstViewedAt);
    const expiresAt = new Date(baseDate.getTime() + template.template_blob_url_epires_duriation * 60 * 1000);
    const now = new Date();

    if (now > expiresAt) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600 border border-red-100">
          Expired
        </span>
      );
    }

    const diffMs = expiresAt - now;
    const diffMins = Math.ceil(diffMs / (1000 * 60));
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-100">
        Expires in {diffMins}m
      </span>
    );
  };

  // Reactivation Modal trigger
  const handleOpenReactivate = (template) => {
    setReactivateTemplateId(template.id);
    setReactivateTemplateName(template.template_blob_url_name);
    setReactivatePassword("");
    setReactivateDuration("10");
    setShowReactivatePassword(false);
    setShowReactivateModal(true);
  };

  const handleReactivateSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!reactivatePassword.trim()) {
      setError("A new access password is required to reactivate the link.");
      return;
    }
    if (parseInt(reactivateDuration) <= 0 || isNaN(parseInt(reactivateDuration))) {
      setError("Please specify a valid reactivation duration in minutes.");
      return;
    }

    try {
      const updated = await reactivateTemplate(
        reactivateTemplateId,
        reactivatePassword,
        parseInt(reactivateDuration)
      );

      setTemplates((prev) =>
        prev.map((t) => (t.id === reactivateTemplateId ? updated : t))
      );
      
      setShowReactivateModal(false);
      setSuccess(`"${reactivateTemplateName}" has been reactivated with a new secure URL!`);
    } catch (err) {
      setError(err.message || "Failed to reactivate template.");
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter templates list
  const filteredTemplates = templates.filter((template) =>
    template.template_blob_url_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-transparent">
      <Sidebar />

      <div className="lg:pl-72">
        <Topbar
          title="Secure Template Hub"
          subtitle="Publish files in secure view-only browser mode with mandatory password access and strict minute-based countdown."
        />

        <main className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-6">
          {/* Notifications */}
          {error && (
            <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50/50 p-4 text-xs font-semibold text-red-700 backdrop-blur-md">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-3 rounded-2xl border border-teal-200 bg-teal-50/50 p-4 text-xs font-semibold text-teal-700 backdrop-blur-md">
              <CheckCircle size={16} />
              <span>{success}</span>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Upload Form (Left 5 Cols) */}
            <section className="xl:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
              <div>
                <h2 className="text-sm font-bold text-slate-800">Publish New Template</h2>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Enforces view-only protection and password credentials.</p>
              </div>

              <form onSubmit={handleCreateTemplate} className="space-y-4">
                {/* Drag and Drop Zone */}
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={triggerFileSelect}
                  className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
                    dragActive
                      ? "border-primary-500 bg-primary-50/30"
                      : file
                      ? "border-emerald-500 bg-emerald-50/10"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  {file ? (
                    <div className="space-y-2">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 border border-emerald-200">
                        <FileIcon size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 max-w-[280px] truncate mx-auto">
                          {file.name}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                        }}
                        className="text-[10px] font-bold text-red-500 hover:text-red-700 underline"
                      >
                        Change file
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 border border-primary-100">
                        <UploadCloud size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-700">
                          Drag and drop file here, or <span className="text-primary-600 hover:text-primary-800 underline">browse</span>
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 mt-1">
                          Supports PDFs, spreadsheets, templates, docs (Max 25MB)
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Progress overlay */}
                  {uploading && (
                    <div className="absolute inset-0 bg-white/95 rounded-2xl flex flex-col items-center justify-center p-6 space-y-3 z-10">
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-600 transition-all duration-200"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-700">Uploading File ({uploadProgress}%)</span>
                    </div>
                  )}
                </div>

                {/* Form fields */}
                <div className="space-y-3.5">
                  <div>
                    <label className="block">
                      <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">Template Name</span>
                      <input
                        type="text"
                        placeholder="e.g. Master Admission Registration Sheet"
                        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block">
                        <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">Expiry Duration (Minutes)</span>
                        <input
                          type="number"
                          min="1"
                          placeholder="e.g. 10"
                          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all"
                          value={expiresDuration}
                          onChange={(e) => setExpiresDuration(e.target.value)}
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block">
                        <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">Link Status</span>
                        <select
                          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all"
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block">
                      <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider flex items-center gap-1">
                        Access Password <span className="text-red-500 font-bold">*</span>
                      </span>
                      <div className="relative mt-1.5">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter mandatory download/view password"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-3 pr-10 py-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all"
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
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary-600 py-3 text-xs font-bold text-white hover:bg-primary-700 disabled:bg-primary-300 transition-all cursor-pointer shadow-sm shadow-primary-500/10"
                >
                  <UploadCloud size={14} />
                  Publish Template Blob
                </button>
              </form>
            </section>

            {/* List Section (Right 7 Cols) */}
            <section className="xl:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col min-h-[500px]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-100">
                <div>
                  <h2 className="text-sm font-bold text-slate-800">Published Templates</h2>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Manage secure, shareable documents.</p>
                </div>

                {/* Inline Search */}
                <div className="relative w-full sm:w-60">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-8 pr-3 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-400 space-y-2">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
                  <span className="text-xs font-bold font-semibold">Loading templates...</span>
                </div>
              ) : filteredTemplates.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-400">
                  <FileIcon size={32} className="text-slate-300 mb-2" />
                  <span className="text-xs font-bold font-semibold">No templates found</span>
                  <span className="text-[10px] text-slate-400 mt-1">Upload a file to get started.</span>
                </div>
              ) : (
                <div className="flex-1 overflow-x-auto mt-4">
                  <div className="min-w-[600px] divide-y divide-slate-100">
                    {filteredTemplates.map((template) => {
                      const expired = isExpired(template);
                      const isUrlActive = template.template_url_status === "active";
                      
                      return (
                        <div key={template.id} className="py-4 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-150 text-slate-500">
                              <FileIcon size={18} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-800 truncate max-w-[250px]">
                                {template.template_blob_url_name}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                <span className="text-[10px] font-bold text-slate-400">
                                  {formatDate(template.createdAt)}
                                </span>
                                <span className="h-1 w-1 rounded-full bg-slate-300" />
                                {getExpirationBadge(template)}
                                <span className="h-1 w-1 rounded-full bg-slate-300" />
                                <span className="inline-flex items-center gap-0.5 rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-bold text-primary-600 border border-primary-100">
                                  <LockIcon size={9} /> Private
                                </span>
                                {template.template_activated_count > 1 && (
                                  <>
                                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                                    <span className="inline-flex items-center gap-0.5 rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-600 border border-violet-100">
                                      <RefreshIcon size={9} /> Activated {template.template_activated_count}x
                                    </span>
                                  </>
                                )}
                              </div>
                              {template.template_comment && (
                                <div className="flex items-start gap-1.5 mt-2 rounded-lg border border-sky-100 bg-sky-50/50 px-2.5 py-1.5 max-w-[320px]">
                                  <MessageIcon size={11} className="text-sky-500 shrink-0 mt-0.5" />
                                  <p className="text-[10px] font-semibold text-sky-700 leading-relaxed">
                                    {template.template_comment}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Actions side */}
                          <div className="flex items-center gap-2.5">
                            {expired ? (
                              <button
                                onClick={() => handleOpenReactivate(template)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-200 bg-amber-50 text-[10px] font-bold text-amber-700 hover:bg-amber-100 transition-colors shadow-sm"
                              >
                                <RefreshIcon size={12} /> Reactivate
                              </button>
                            ) : (
                              <>
                                {/* View Link (Strict secure viewer) */}
                                <a
                                  href={getViewUrl(template.template_blob_url)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={`p-2 rounded-lg border transition-colors flex items-center justify-center ${
                                    isUrlActive
                                      ? "border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300"
                                      : "border-slate-100 text-slate-300 cursor-not-allowed"
                                  }`}
                                  onClick={(e) => {
                                    if (!isUrlActive) e.preventDefault();
                                  }}
                                  title={isUrlActive ? "View Document Securely" : "Link is inactive"}
                                >
                                  <Eye size={14} />
                                </a>

                                {/* Copy URL Button */}
                                <button
                                  onClick={() => handleCopyLink(template)}
                                  disabled={!isUrlActive}
                                  className={`p-2 rounded-lg border transition-colors flex items-center justify-center ${
                                    isUrlActive
                                      ? "border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300"
                                      : "border-slate-150 bg-slate-50 text-slate-300 cursor-not-allowed"
                                  }`}
                                  title="Copy secure link"
                                >
                                  {copiedId === template.id ? (
                                    <Check size={14} className="text-emerald-500" />
                                  ) : (
                                    <Copy size={14} />
                                  )}
                                </button>
                              </>
                            )}

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDelete(template.id)}
                              className="p-2 rounded-lg border border-slate-200 text-red-500 hover:text-red-700 hover:border-red-200 hover:bg-red-50/50 transition-colors"
                              title="Remove template link"
                            >
                              <Trash size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>

      {/* Reactivate Link Modal */}
      {showReactivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <button
              onClick={() => setShowReactivateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <CloseIcon size={18} />
            </button>

            <div className="text-center space-y-1">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                <RefreshIcon size={18} />
              </div>
              <h3 className="text-xs font-bold text-slate-800">Reactivate Template</h3>
              <p className="text-[10px] text-slate-400 font-semibold">
                Generate a fresh link for &quot;{reactivateTemplateName}&quot;.
              </p>
            </div>

            <form onSubmit={handleReactivateSubmit} className="space-y-4">
              <div className="space-y-3.5">
                <div>
                  <label className="block">
                    <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider flex items-center gap-1">
                      New Access Password <span className="text-red-500 font-bold">*</span>
                    </span>
                    <div className="relative mt-1.5">
                      <input
                        type={showReactivatePassword ? "text" : "password"}
                        placeholder="Must enter a new password"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-3 pr-10 py-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all"
                        value={reactivatePassword}
                        onChange={(e) => setReactivatePassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowReactivatePassword(!showReactivatePassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showReactivatePassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </label>
                </div>

                <div>
                  <label className="block">
                    <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">
                      New Expiry Duration (Minutes)
                    </span>
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 10"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all"
                      value={reactivateDuration}
                      onChange={(e) => setReactivateDuration(e.target.value)}
                    />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary-600 py-3 text-xs font-bold text-white hover:bg-primary-700 transition-all cursor-pointer shadow-sm shadow-primary-500/10"
              >
                <CheckCircle size={14} /> Save &amp; Regenerate Link
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
