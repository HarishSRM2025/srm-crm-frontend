"use client";

function ToggleField({ label, value, onChange }) {
  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-3">
      <p className="text-xs font-medium text-blue-700">{label}</p>
      <div className="mt-2 flex gap-2">
        {[
          { value: true, label: "Required" },
          { value: false, label: "Not required" },
        ].map((opt) => (
          <button
            type="button"
            key={opt.value.toString()}
            onClick={() => onChange(opt.value)}
            className={`flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              value === opt.value
                ? opt.value
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "bg-slate-200 text-slate-700"
                : "bg-white text-slate-400 border border-slate-200 hover:border-blue-300"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function RequirementsSection({ form, onChange }) {
  return (
    <section
      aria-label="Hall requirements"
      className="rounded-2xl border border-slate-200 bg-white p-5"
    >
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
          3
        </span>
        <h2 className="text-sm font-semibold text-slate-800">Requirements</h2>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ToggleField
          label="Mike sets required"
          value={!!form.event_micset}
          onChange={(v) => onChange("event_micset", v)}
        />
        <ToggleField
          label="White board"
          value={!!form.event_white_board}
          onChange={(v) => onChange("event_white_board", v)}
        />
      </div>
    </section>
  );
}
