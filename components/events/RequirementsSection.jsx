"use client";

function ToggleField({ label, value, onChange }) {
  return (
    <div className="rounded-lg border border-primary-100 bg-primary-50/40 p-3">
      <p className="text-xs font-medium text-primary-600">{label}</p>
      <div className="mt-2 flex gap-2">
        {[
          { value: "required", label: "Required" },
          { value: "not-required", label: "Not required" },
        ].map((opt) => (
          <button
            type="button"
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              value === opt.value
                ? opt.value === "required"
                  ? "bg-secondary-600 text-white"
                  : "bg-primary-200 text-primary-800"
                : "bg-white text-primary-400 border border-primary-100 hover:border-primary-300"
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
      className="rounded-xl border border-primary-100 bg-white p-5"
    >
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-xs font-semibold text-white">
          3
        </span>
        <h2 className="text-sm font-semibold text-primary-950">Requirements</h2>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ToggleField
          label="8. Mike sets required"
          value={form.mikeSets}
          onChange={(v) => onChange("mikeSets", v)}
        />
        <ToggleField
          label="9. White board"
          value={form.whiteBoard}
          onChange={(v) => onChange("whiteBoard", v)}
        />
      </div>
    </section>
  );
}
