"use client";

import { useState, useEffect } from "react";
import { fetchInstitutes, fetchDepartments } from "@/lib/events-api";

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all appearance-none";

export default function InstitutionSection({ form, onChange }) {
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadMetadata() {
      try {
        const instList = await fetchInstitutes();
        if (active) {
          setInstitutes(instList || []);
        }
      } catch (err) {
        console.error("Error loading dropdown data:", err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    loadMetadata();
    return () => {
      active = false;
    };
  }, []);

  const selectedInst = institutes.find(
    (inst) => inst.institute_name === form.event_applicant_institution
  );
  const departments = selectedInst ? selectedInst.departments : [];

  return (
    <section
      aria-label="Institution and applicant details"
      className="rounded-2xl border border-slate-200 bg-white p-5"
    >
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
          1
        </span>
        <h2 className="text-xs font-bold text-slate-800">College &amp; applicant details</h2>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Name of the institution (applicant)">
          <div className="relative">
            <select
              className={inputCls}
              value={form.event_applicant_institution || ""}
              onChange={(e) => {
                onChange("event_applicant_institution", e.target.value);
                onChange("event_department", "");
              }}
              disabled={loading}
            >
              <option value="">{loading ? "Loading institutions..." : "Select Institution"}</option>
              {institutes.map((inst) => (
                <option key={inst.id} value={inst.institute_name}>
                  {inst.institute_name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 pt-1.5 text-slate-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </Field>

        <Field label="Name of the applicant">
          <input
            className={inputCls}
            placeholder="Full name"
            value={form.event_applicant_name || ""}
            onChange={(e) => onChange("event_applicant_name", e.target.value)}
          />
        </Field>

        <Field label="Department">
          <div className="relative">
            <select
              className={inputCls}
              value={form.event_department || ""}
              onChange={(e) => onChange("event_department", e.target.value)}
              disabled={loading || !form.event_applicant_institution}
            >
              <option value="">
                {loading
                  ? "Loading departments..."
                  : !form.event_applicant_institution
                  ? "Select an institution first"
                  : "Select Department"}
              </option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.department_name}>
                  {dept.department_name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 pt-1.5 text-slate-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </Field>

        <Field label="Designation">
          <input
            className={inputCls}
            placeholder="e.g. Assistant Professor"
            value={form.event_designation || ""}
            onChange={(e) => onChange("event_designation", e.target.value)}
          />
        </Field>

        <Field label="Name of the organizer">
          <input
            className={inputCls}
            placeholder="Organizer name"
            value={form.event_organizer_name || ""}
            onChange={(e) => onChange("event_organizer_name", e.target.value)}
          />
        </Field>

        <Field label="Organizer phone number">
          <input
            className={inputCls}
            placeholder="e.g. +91 9876543210"
            value={form.event_organizer_phone || ""}
            onChange={(e) => onChange("event_organizer_phone", e.target.value)}
          />
        </Field>
      </div>
    </section>
  );
}

