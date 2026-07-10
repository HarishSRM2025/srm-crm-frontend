"use client";

function Field({ label, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all";

const sessionOptions = [
  { value: "forenoon", label: "Forenoon (8:00 – 12:00 noon)" },
  { value: "afternoon", label: "Afternoon (1:00 – 4:00 PM)" },
  { value: "full-day", label: "Full day" },
];

export default function MeetingDetailsSection({ form, onChange }) {
  return (
    <section
      aria-label="Meeting, seminar or function details"
      className="rounded-2xl border border-slate-200 bg-white p-5 "
    >
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
          2
        </span>
        <h2 className="text-xs font-bold text-slate-800">Details of meeting / seminar / function</h2>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Purpose" className="sm:col-span-2">
          <input
            className={inputCls}
            placeholder="e.g. National Conference on AI in Healthcare"
            value={form.event_purpose || ""}
            onChange={(e) => onChange("event_purpose", e.target.value)}
          />
        </Field>

        <Field label="Event Details" className="sm:col-span-2">
          <input
            className={inputCls}
            placeholder="Additional details about the event"
            value={form.event_details || ""}
            onChange={(e) => onChange("event_details", e.target.value)}
          />
        </Field>

        <Field label="Date">
          <input
            className={inputCls}
            type="date"
            value={form.event_date || ""}
            onChange={(e) => onChange("event_date", e.target.value)}
          />
        </Field>

        <Field label="No. of expected participants">
          <input
            className={inputCls}
            type="number"
            min="0"
            placeholder="e.g. 150"
            value={form.event_participant_count || ""}
            onChange={(e) => onChange("event_participant_count", e.target.value)}
          />
        </Field>

        <Field label="Start Time">
          <input
            className={inputCls}
            type="time"
            value={form.event_start_time || ""}
            onChange={(e) => onChange("event_start_time", e.target.value)}
          />
        </Field>

        <Field label="End Time">
          <input
            className={inputCls}
            type="time"
            value={form.event_end_time || ""}
            onChange={(e) => onChange("event_end_time", e.target.value)}
          />
        </Field>

        <Field label="Name of VIP / guest">
          <input
            className={inputCls}
            placeholder="e.g. Dr. Anita Rao, Dean of Research"
            value={form.event_guest_name || ""}
            onChange={(e) => onChange("event_guest_name", e.target.value)}
          />
        </Field>

        <Field label="No. of presiding officers">
          <input
            className={inputCls}
            type="number"
            min="0"
            placeholder="e.g. 2"
            value={form.event_presiding_officers || ""}
            onChange={(e) => onChange("event_presiding_officers", e.target.value)}
          />
        </Field>
      </div>
    </section>
  );
}
