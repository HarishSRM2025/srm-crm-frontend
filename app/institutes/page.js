"use client";

import { useState, useEffect } from "react";
import {
  LuPlus as Plus,
  LuTrash2 as Trash,
  LuGraduationCap as GraduationCap,
  LuBookOpen as BookOpen,
  LuLoader as Loader,
  LuCircleAlert as AlertCircle,
  LuCircleCheck as CheckCircle,
  LuChevronRight as ChevronRight,
  LuX as XIcon,
  LuTriangleAlert as WarningIcon,
} from "react-icons/lu";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import {
  fetchInstitutes,
  createInstitute,
  deleteInstitute,
  createDepartment,
  deleteDepartment,
} from "@/lib/events-api";

export default function InstitutesPage() {
  const [institutes, setInstitutes] = useState([]);
  const [selectedInstId, setSelectedInstId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Input states
  const [newInstName, setNewInstName] = useState("");
  const [newDeptName, setNewDeptName] = useState("");
  const [submittingInst, setSubmittingInst] = useState(false);
  const [submittingDept, setSubmittingDept] = useState(false);

  // Confirmation modal state
  const [confirmDialog, setConfirmDialog] = useState(null);
  // confirmDialog shape: { title, message, onConfirm, loading }

  // Load data
  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchInstitutes();
      setInstitutes(data || []);
      // Auto-select the first institute if nothing is selected yet
      if (data && data.length > 0 && !selectedInstId) {
        setSelectedInstId(data[0].id);
      }
    } catch (err) {
      setError("Failed to load institutes and departments: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddInstitute = async (e) => {
    e.preventDefault();
    if (!newInstName.trim()) return;
    setSubmittingInst(true);
    setError("");
    setSuccess("");
    try {
      const created = await createInstitute(newInstName.trim());
      setSuccess(`Institute "${created.institute_name}" created successfully.`);
      setNewInstName("");
      // Reload institutes list
      const data = await fetchInstitutes();
      setInstitutes(data || []);
      setSelectedInstId(created.id);
    } catch (err) {
      setError("Failed to create institute: " + err.message);
    } finally {
      setSubmittingInst(false);
    }
  };

  const handleDeleteInstitute = (id, name) => {
    setConfirmDialog({
      title: "Delete Institute",
      message: `Are you sure you want to delete "${name}"? All departments under this institute will also be permanently removed.`,
      loading: false,
      onConfirm: async () => {
        setConfirmDialog((prev) => ({ ...prev, loading: true }));
        setError("");
        setSuccess("");
        try {
          await deleteInstitute(id);
          setSuccess(`Institute "${name}" has been deleted.`);
          if (selectedInstId === id) {
            setSelectedInstId(null);
          }
          const data = await fetchInstitutes();
          setInstitutes(data || []);
          if (data && data.length > 0) {
            setSelectedInstId(data[0].id);
          }
        } catch (err) {
          setError("Failed to delete institute: " + err.message);
        } finally {
          setConfirmDialog(null);
        }
      },
    });
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!newDeptName.trim() || !selectedInstId) return;
    setSubmittingDept(true);
    setError("");
    setSuccess("");
    try {
      const created = await createDepartment(newDeptName.trim(), selectedInstId);
      setSuccess(`Department "${created.department_name}" added successfully.`);
      setNewDeptName("");
      // Reload
      const data = await fetchInstitutes();
      setInstitutes(data || []);
    } catch (err) {
      setError("Failed to add department: " + err.message);
    } finally {
      setSubmittingDept(false);
    }
  };

  const handleDeleteDepartment = (id, name) => {
    setConfirmDialog({
      title: "Delete Department",
      message: `Are you sure you want to delete the department "${name}"? This action cannot be undone.`,
      loading: false,
      onConfirm: async () => {
        setConfirmDialog((prev) => ({ ...prev, loading: true }));
        setError("");
        setSuccess("");
        try {
          await deleteDepartment(id);
          setSuccess(`Department "${name}" deleted.`);
          const data = await fetchInstitutes();
          setInstitutes(data || []);
        } catch (err) {
          setError("Failed to delete department: " + err.message);
        } finally {
          setConfirmDialog(null);
        }
      },
    });
  };

  const selectedInst = institutes.find((i) => i.id === selectedInstId);

  return (
    <div className="min-h-screen bg-transparent">
      <Sidebar />

      <div className="lg:pl-72">
        <Topbar
          title="Institutes &amp; Departments"
          subtitle="Manage SRM institutes and their respective departments."
        />

        <main className="p-4 lg:p-8 space-y-6">
          {/* Status alerts */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600 shadow-sm transition-all animate-in fade-in duration-300">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-600 shadow-sm transition-all animate-in fade-in duration-300">
              <CheckCircle size={16} />
              <span>{success}</span>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader className="animate-spin text-blue-600" size={32} />
              <p className="text-xs font-semibold mt-3">Loading institutes database...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Institutes List */}
              <div className="lg:col-span-5 space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <GraduationCap className="text-blue-600" size={16} />
                    <span>Create Institute</span>
                  </h2>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5 mb-4">
                    Add a new primary college/institute unit.
                  </p>

                  <form onSubmit={handleAddInstitute} className="flex gap-2">
                    <input
                      type="text"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all"
                      placeholder="e.g. SRM College of Dental Sciences"
                      value={newInstName}
                      onChange={(e) => setNewInstName(e.target.value)}
                      disabled={submittingInst}
                    />
                    <button
                      type="submit"
                      disabled={submittingInst || !newInstName.trim()}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-600/25 disabled:opacity-50 disabled:shadow-none transition-all"
                    >
                      {submittingInst ? <Loader className="animate-spin" size={16} /> : <Plus size={16} />}
                    </button>
                  </form>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-xs font-bold text-slate-800 mb-4">
                    All Institutes ({institutes.length})
                  </h2>

                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                    {institutes.length === 0 ? (
                      <div className="text-center py-8 text-slate-400 text-xs font-medium">
                        No institutes created yet.
                      </div>
                    ) : (
                      institutes.map((inst) => (
                        <div
                          key={inst.id}
                          onClick={() => setSelectedInstId(inst.id)}
                          className={`group flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-all duration-200 ${
                            selectedInstId === inst.id
                              ? "border-blue-200 bg-blue-50/45 text-blue-700 shadow-sm"
                              : "border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                                selectedInstId === inst.id
                                  ? "border-blue-200 bg-white text-blue-600"
                                  : "border-slate-200 bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-blue-500"
                              }`}
                            >
                              <GraduationCap size={16} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold truncate">{inst.institute_name}</p>
                              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                                {inst.departments?.length || 0} Departments
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity pl-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteInstitute(inst.id, inst.institute_name);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                              title="Delete Institute"
                            >
                              <Trash size={14} />
                            </button>
                            <ChevronRight
                              size={14}
                              className={selectedInstId === inst.id ? "text-blue-500" : "text-slate-300"}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Departments of selected Institute */}
              <div className="lg:col-span-7">
                {selectedInst ? (
                  <div className="space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                        <BookOpen className="text-blue-600" size={16} />
                        <span>Add Department to "{selectedInst.institute_name}"</span>
                      </h2>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5 mb-4">
                        Register a clinical or academic department under this college.
                      </p>

                      <form onSubmit={handleAddDepartment} className="flex gap-2">
                        <input
                          type="text"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all"
                          placeholder="e.g. Oral Medicine &amp; Radiology"
                          value={newDeptName}
                          onChange={(e) => setNewDeptName(e.target.value)}
                          disabled={submittingDept}
                        />
                        <button
                          type="submit"
                          disabled={submittingDept || !newDeptName.trim()}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-600/25 disabled:opacity-50 disabled:shadow-none transition-all"
                        >
                          {submittingDept ? <Loader className="animate-spin" size={16} /> : <Plus size={16} />}
                        </button>
                      </form>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <h2 className="text-xs font-bold text-slate-800 mb-4">
                        Departments in "{selectedInst.institute_name}" ({selectedInst.departments?.length || 0})
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
                        {(!selectedInst.departments || selectedInst.departments.length === 0) ? (
                          <div className="md:col-span-2 text-center py-12 text-slate-400 text-xs font-medium">
                            No departments registered in this institute yet. Add one above.
                          </div>
                        ) : (
                          selectedInst.departments.map((dept) => (
                            <div
                              key={dept.id}
                              className="group flex items-center justify-between rounded-xl border border-slate-100 p-3 hover:border-slate-200 hover:bg-slate-50 transition-all duration-200"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-blue-500 transition-colors">
                                  <BookOpen size={13} />
                                </div>
                                <span className="text-xs font-bold text-slate-700 truncate">
                                  {dept.department_name}
                                </span>
                              </div>

                              <button
                                onClick={() => handleDeleteDepartment(dept.id, dept.department_name)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 shrink-0"
                                title="Delete Department"
                              >
                                <Trash size={13} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-400">
                    <GraduationCap size={32} className="mx-auto text-slate-300 mb-3 animate-pulse" />
                    <p className="text-xs font-bold text-slate-600">No college selected</p>
                    <p className="text-[10px] font-semibold text-slate-400 mt-1">
                      Select or create an institute on the left panel to manage its departments.
                    </p>
                  </div>
                )}
              </div>

            </div>
          )}
        </main>
      </div>
      {/* Delete Confirmation Modal */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => !confirmDialog.loading && setConfirmDialog(null)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-md mx-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/10 animate-in zoom-in-95 duration-200">
            {/* Close button */}
            <button
              onClick={() => !confirmDialog.loading && setConfirmDialog(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              disabled={confirmDialog.loading}
            >
              <XIcon size={16} />
            </button>

            {/* Warning icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 border border-red-100 mx-auto mb-4">
              <WarningIcon size={22} className="text-red-500" />
            </div>

            {/* Title */}
            <h3 className="text-sm font-bold text-slate-800 text-center">
              {confirmDialog.title}
            </h3>

            {/* Message */}
            <p className="mt-2 text-xs text-slate-500 text-center leading-relaxed">
              {confirmDialog.message}
            </p>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => setConfirmDialog(null)}
                disabled={confirmDialog.loading}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                disabled={confirmDialog.loading}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-red-500 shadow-md shadow-red-600/25 transition-all disabled:opacity-70"
              >
                {confirmDialog.loading ? (
                  <>
                    <Loader className="animate-spin" size={14} />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash size={14} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
