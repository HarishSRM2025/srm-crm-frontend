"use client";

function Field({ label, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "mt-1.5 w-full rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all";

const sessionOptions = [
  { value: "forenoon", label: "Forenoon (8:00 – 12:00 noon)" },
  { value: "afternoon", label: "Afternoon (1:00 – 4:00 PM)" },
  { value: "full-day", label: "Full day" },
];

export default function MeetingDetailsSection({ form, onChange }) {
  return (
    <section
      aria-label="Meeting, seminar or function details"
      className="rounded-2xl border border-slate-100 bg-white p-5"
    >
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
          2
        </span>
        <h2 className="text-xs font-bold text-slate-800">Details of meeting / seminar / function</h2>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="A. Purpose" className="sm:col-span-2">
          <input
            className={inputCls}
            placeholder="e.g. National Conference on AI in Healthcare"
            value={form.purpose}
            onChange={(e) => onChange("purpose", e.target.value)}
          />
        </Field>

        <Field label="B. Date(s)">
          <input
            className={inputCls}
            placeholder="e.g. 10 Jul 2026"
            value={form.dates}
            onChange={(e) => onChange("dates", e.target.value)}
          />
        </Field>

        <Field label="D. No. of expected participants">
          <input
            className={inputCls}
            type="number"
            min="0"
            placeholder="e.g. 150"
            value={form.expectedParticipants}
            onChange={(e) => onChange("expectedParticipants", e.target.value)}
          />
        </Field>

        <Field label="C. Session" className="sm:col-span-2">
          <div className="mt-1.5 flex flex-wrap gap-2">
            {sessionOptions.map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => onChange("session", opt.value)}
                className={`rounded-full border px-3.5 py-2 text-[10px] font-bold transition-all ${
                  form.session === opt.value
                    ? "border-slate-800 bg-slate-900 text-white"
                    : "border-slate-100 bg-slate-50/50 text-slate-600 hover:border-slate-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Field>

        <Field label="E. Name of VIP / guest">
          <input
            className={inputCls}
            placeholder="e.g. Dr. Anita Rao, Dean of Research"
            value={form.vipGuest}
            onChange={(e) => onChange("vipGuest", e.target.value)}
          />
        </Field>

        <Field label="7. No. of presiding officers">
          <input
            className={inputCls}
            type="number"
            min="0"
            placeholder="e.g. 2"
            value={form.presidingOfficers}
            onChange={(e) => onChange("presidingOfficers", e.target.value)}
          />
        </Field>
      </div>
    </section>
  );
}
