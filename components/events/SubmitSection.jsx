"use client";

import { LuShieldCheck as ShieldCheck } from "react-icons/lu";

export default function SubmitSection({ form, onChange, onSubmit, submitting }) {
  const canSubmit =
    form.college && form.applicantName && form.purpose && form.dates && form.organizerSignatureDate;

  return (
    <section
      aria-label="Sign-off and submission"
      className="rounded-xl border border-primary-100 bg-white p-5"
    >
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-xs font-semibold text-white">
          4
        </span>
        <h2 className="text-sm font-semibold text-primary-950">Sign-off &amp; submit</h2>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="text-xs font-medium text-primary-600">Date</span>
          <input
            type="date"
            className="mt-1.5 w-full rounded-lg border border-primary-100 bg-primary-50/40 px-3 py-2 text-sm text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white"
            value={form.organizerSignatureDate}
            onChange={(e) => onChange("organizerSignatureDate", e.target.value)}
          />
        </label>

        <div className="sm:col-span-2 flex items-end">
          <div className="w-full rounded-lg border border-dashed border-primary-200 bg-primary-50/40 px-3 py-2.5 text-xs text-primary-500">
            By submitting, you confirm this is signed by the organizer. It will be routed to{" "}
            <span className="font-semibold text-primary-700">HOD → HOI → Manager</span> for approval.
          </div>
        </div>
      </div>

      <button
        type="button"
        disabled={!canSubmit || submitting}
        onClick={onSubmit}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-secondary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary-700 disabled:cursor-not-allowed disabled:bg-primary-100 disabled:text-primary-400"
      >
        <ShieldCheck size={16} />
        {submitting ? "Submitting…" : "Request approval"}
      </button>
      {!canSubmit && (
        <p className="mt-2 text-xs text-primary-400">
          Fill in college, applicant, purpose, date(s) and sign-off date to submit.
        </p>
      )}
    </section>
  );
}
