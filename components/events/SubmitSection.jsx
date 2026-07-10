"use client";

import { LuShieldCheck as ShieldCheck } from "react-icons/lu";

export default function SubmitSection({ form, onChange, onSubmit, submitting }) {
  const canSubmit =
    form.event_applicant_name &&
    form.event_applicant_institution &&
    form.event_purpose &&
    form.event_date;

  return (
    <section
      aria-label="Sign-off and submission"
      className="rounded-2xl border border-slate-200 bg-white p-5 "
    >
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
          4
        </span>
        <h2 className="text-sm font-semibold text-slate-800">Sign-off &amp; submit</h2>
      </div>

      <div className="mt-4">
        <div className="w-full rounded-lg border border-dashed border-blue-300 bg-blue-50/60 px-3 py-3 text-xs text-blue-600/80">
          By submitting, you confirm this request is sign-off ready. It will be routed to{" "}
          <span className="font-semibold text-blue-700">HOD → HOI → Manager</span> for approval.
        </div>
      </div>

      <button
        type="button"
        disabled={!canSubmit || submitting}
        onClick={onSubmit}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 shadow-lg shadow-blue-600/25 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none"
      >
        <ShieldCheck size={16} />
        {submitting ? "Submitting…" : "Request approval"}
      </button>
      {!canSubmit && (
        <p className="mt-2 text-xs text-slate-400">
          Fill in applicant name, institution, purpose, and date to submit.
        </p>
      )}
    </section>
  );
}
