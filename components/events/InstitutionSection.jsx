"use client";

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "mt-1.5 w-full rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all";

export default function InstitutionSection({ form, onChange }) {
  return (
    <section
      aria-label="Institution and applicant details"
      className="rounded-2xl border border-slate-100 bg-white p-5"
    >
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
          1
        </span>
        <h2 className="text-xs font-bold text-slate-800">College &amp; applicant details</h2>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="College">
          <input
            className={inputCls}
            placeholder="e.g. St. Xavier's College of Engineering"
            value={form.college}
            onChange={(e) => onChange("college", e.target.value)}
          />
        </Field>

        <Field label="Name of the institution (applicant)">
          <input
            className={inputCls}
            placeholder="Institution submitting the request"
            value={form.institution}
            onChange={(e) => onChange("institution", e.target.value)}
          />
        </Field>

        <Field label="Name of the applicant">
          <input
            className={inputCls}
            placeholder="Full name"
            value={form.applicantName}
            onChange={(e) => onChange("applicantName", e.target.value)}
          />
        </Field>

        <Field label="Department">
          <input
            className={inputCls}
            placeholder="e.g. Computer Science"
            value={form.department}
            onChange={(e) => onChange("department", e.target.value)}
          />
        </Field>

        <Field label="Designation">
          <input
            className={inputCls}
            placeholder="e.g. Assistant Professor"
            value={form.designation}
            onChange={(e) => onChange("designation", e.target.value)}
          />
        </Field>

        <Field label="Name of the organizer / mobile no.">
          <input
            className={inputCls}
            placeholder="Organizer name and phone number"
            value={form.organizerName}
            onChange={(e) => onChange("organizerName", e.target.value)}
          />
        </Field>
      </div>
    </section>
  );
}
