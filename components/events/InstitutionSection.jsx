"use client";

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all";

export default function InstitutionSection({ form, onChange }) {
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
          <input
            className={inputCls}
            placeholder="Institution submitting the request"
            value={form.event_applicant_institution || ""}
            onChange={(e) => onChange("event_applicant_institution", e.target.value)}
          />
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
          <input
            className={inputCls}
            placeholder="e.g. Computer Science"
            value={form.event_department || ""}
            onChange={(e) => onChange("event_department", e.target.value)}
          />
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
