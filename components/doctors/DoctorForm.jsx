"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LuCircleCheck as CircleCheck,
  LuPlus as Plus,
  LuTrash2 as Trash,
  LuSave as Save,
  LuUser as User,
  LuBookOpen as BookOpen,
  LuFlaskConical as Flask,
} from "react-icons/lu";
import { useDoctors, DEPARTMENTS, STATUSES } from "@/context/DoctorsContext";

const TABS = [
  { key: "general", label: "General", icon: User },
  { key: "academic", label: "Academic & Clinical", icon: Flask },
  { key: "research", label: "Research & Publications", icon: BookOpen },
];

export default function DoctorForm({ existingDoctor }) {
  const router = useRouter();
  const { addDoctor, updateDoctor, blankDoctor } = useDoctors();
  const isEdit = !!existingDoctor;

  const [activeTab, setActiveTab] = useState("general");
  const [form, setForm] = useState(existingDoctor || blankDoctor());
  const [newPub, setNewPub] = useState("");
  const [saved, setSaved] = useState(false);

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const addPublication = () => {
    if (!newPub.trim()) return;
    onChange("publications", [...form.publications, newPub.trim()]);
    setNewPub("");
  };

  const removePublication = (index) => {
    onChange(
      "publications",
      form.publications.filter((_, i) => i !== index)
    );
  };

  const handleSave = () => {
    if (isEdit) {
      updateDoctor(existingDoctor.id, form);
    } else {
      addDoctor(form);
    }
    setSaved(true);
    setTimeout(() => router.push("/doctors"), 600);
  };

  const canSave = form.name && form.department && form.designation;

  return (
    <div className="space-y-5">
      {/* Tab Navigation */}
      <div className="flex gap-1 rounded-xl border border-primary-100 bg-white p-1.5">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition-all ${
                isActive
                  ? "border border-primary-700 bg-primary-600 text-white"
                  : "border border-transparent text-primary-500 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="rounded-xl border border-primary-100 bg-white p-6">
        {/* General Tab */}
        {activeTab === "general" && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 border-b border-primary-50 pb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                1
              </span>
              <h2 className="text-sm font-semibold text-primary-950">Personal Information</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-medium text-primary-600">
                  Full Name <span className="text-rose-500">*</span>
                </span>
                <input
                  className="mt-1.5 w-full rounded-lg border border-primary-100 bg-primary-50/40 px-3 py-2.5 text-sm text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-colors"
                  placeholder="e.g. Dr. Kavitha Rajan"
                  value={form.name}
                  onChange={(e) => onChange("name", e.target.value)}
                />
              </label>

              <label className="block">
                <span className="text-xs font-medium text-primary-600">
                  Department <span className="text-rose-500">*</span>
                </span>
                <select
                  className="mt-1.5 w-full rounded-lg border border-primary-100 bg-primary-50/40 px-3 py-2.5 text-sm text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-colors"
                  value={form.department}
                  onChange={(e) => onChange("department", e.target.value)}
                >
                  <option value="">Select department…</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-medium text-primary-600">
                  Designation <span className="text-rose-500">*</span>
                </span>
                <input
                  className="mt-1.5 w-full rounded-lg border border-primary-100 bg-primary-50/40 px-3 py-2.5 text-sm text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-colors"
                  placeholder="e.g. Associate Professor"
                  value={form.designation}
                  onChange={(e) => onChange("designation", e.target.value)}
                />
              </label>

              <label className="block">
                <span className="text-xs font-medium text-primary-600">Profile Status</span>
                <select
                  className="mt-1.5 w-full rounded-lg border border-primary-100 bg-primary-50/40 px-3 py-2.5 text-sm text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-colors"
                  value={form.status}
                  onChange={(e) => onChange("status", e.target.value)}
                >
                  <option value={STATUSES.DRAFT}>Draft</option>
                  <option value={STATUSES.REVIEW}>Review Required</option>
                  <option value={STATUSES.PUBLISHED}>Published</option>
                </select>
              </label>
            </div>

            <label className="block">
              <span className="text-xs font-medium text-primary-600">Bio / Description</span>
              <textarea
                className="mt-1.5 w-full rounded-lg border border-primary-100 bg-primary-50/40 px-3 py-2.5 text-sm text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-colors"
                placeholder="A brief professional biography…"
                rows={4}
                value={form.bio}
                onChange={(e) => onChange("bio", e.target.value)}
              />
            </label>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-medium text-primary-600">Email</span>
                <input
                  type="email"
                  className="mt-1.5 w-full rounded-lg border border-primary-100 bg-primary-50/40 px-3 py-2.5 text-sm text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-colors"
                  placeholder="email@srm.edu"
                  value={form.email}
                  onChange={(e) => onChange("email", e.target.value)}
                />
              </label>

              <label className="block">
                <span className="text-xs font-medium text-primary-600">Phone</span>
                <input
                  className="mt-1.5 w-full rounded-lg border border-primary-100 bg-primary-50/40 px-3 py-2.5 text-sm text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-colors"
                  placeholder="98765 43210"
                  value={form.phone}
                  onChange={(e) => onChange("phone", e.target.value)}
                />
              </label>
            </div>
          </div>
        )}

        {/* Academic & Clinical Tab */}
        {activeTab === "academic" && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 border-b border-primary-50 pb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                2
              </span>
              <h2 className="text-sm font-semibold text-primary-950">Academic & Clinical Details</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="text-xs font-medium text-primary-600">Qualifications</span>
                <input
                  className="mt-1.5 w-full rounded-lg border border-primary-100 bg-primary-50/40 px-3 py-2.5 text-sm text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-colors"
                  placeholder="e.g. MBBS, MD (Biochemistry)"
                  value={form.qualifications}
                  onChange={(e) => onChange("qualifications", e.target.value)}
                />
              </label>

              <label className="block">
                <span className="text-xs font-medium text-primary-600">Medical Registration No.</span>
                <input
                  className="mt-1.5 w-full rounded-lg border border-primary-100 bg-primary-50/40 px-3 py-2.5 text-sm text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-colors"
                  placeholder="e.g. TN-MED-44821"
                  value={form.registrationNo}
                  onChange={(e) => onChange("registrationNo", e.target.value)}
                />
              </label>

              <label className="block">
                <span className="text-xs font-medium text-primary-600">Years of Experience</span>
                <input
                  type="number"
                  min="0"
                  className="mt-1.5 w-full rounded-lg border border-primary-100 bg-primary-50/40 px-3 py-2.5 text-sm text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-colors"
                  placeholder="e.g. 12"
                  value={form.yearsOfExperience}
                  onChange={(e) => onChange("yearsOfExperience", parseInt(e.target.value, 10) || "")}
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-xs font-medium text-primary-600">OPD / Consultation Timings</span>
                <input
                  className="mt-1.5 w-full rounded-lg border border-primary-100 bg-primary-50/40 px-3 py-2.5 text-sm text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-colors"
                  placeholder="e.g. Mon, Wed, Fri — 9:00 AM to 12:00 PM"
                  value={form.opdTimings}
                  onChange={(e) => onChange("opdTimings", e.target.value)}
                />
              </label>
            </div>
          </div>
        )}

        {/* Research & Publications Tab */}
        {activeTab === "research" && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 border-b border-primary-50 pb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                3
              </span>
              <h2 className="text-sm font-semibold text-primary-950">Research & Publications</h2>
            </div>

            {/* Add new publication */}
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-lg border border-primary-100 bg-primary-50/40 px-3 py-2.5 text-sm text-primary-900 placeholder:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-colors"
                placeholder="Paper title, journal, year…"
                value={newPub}
                onChange={(e) => setNewPub(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPublication())}
              />
              <button
                type="button"
                onClick={addPublication}
                className="flex items-center gap-1.5 rounded-lg border border-secondary-700 bg-secondary-600 px-4 py-2.5 text-xs font-semibold text-white hover:border-secondary-800 hover:bg-secondary-700 transition-colors"
              >
                <Plus size={14} />
                Add
              </button>
            </div>

            {/* Publication list */}
            {form.publications.length > 0 ? (
              <div className="space-y-2">
                {form.publications.map((pub, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-lg border border-primary-50 bg-primary-50/30 p-3"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-[10px] font-bold text-primary-600">
                      {i + 1}
                    </div>
                    <p className="flex-1 text-xs text-primary-700 leading-relaxed">{pub}</p>
                    <button
                      type="button"
                      onClick={() => removePublication(i)}
                      className="rounded-lg p-1.5 text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    >
                      <Trash size={12} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-primary-200 bg-primary-50/30 p-6 text-center">
                <BookOpen size={20} className="mx-auto text-primary-300 mb-2" />
                <p className="text-xs text-primary-400">No publications yet. Add one above.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Save Actions */}
      <div className="flex items-center justify-between rounded-xl border border-primary-100 bg-white p-4">
        <div>
          {!canSave && (
            <p className="text-xs text-primary-400">
              Fill in name, department, and designation to save.
            </p>
          )}
          {saved && (
            <p className="flex items-center gap-1.5 text-xs font-semibold text-secondary-700">
              <CircleCheck size={14} />
              Profile saved successfully! Redirecting…
            </p>
          )}
        </div>
        <button
          type="button"
          disabled={!canSave || saved}
          onClick={handleSave}
          className="flex items-center gap-2 rounded-lg border border-primary-700 bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:border-primary-800 hover:bg-primary-700 disabled:border-primary-100 disabled:bg-primary-100 disabled:text-primary-400 disabled:cursor-not-allowed transition-colors"
        >
          <Save size={15} />
          {isEdit ? "Update Profile" : "Create Profile"}
        </button>
      </div>
    </div>
  );
}
