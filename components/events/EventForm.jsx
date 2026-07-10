"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LuCircleCheck as CheckCircle2 } from "react-icons/lu";
import { blankForm } from "@/lib/events-data";
import { useEvents } from "@/context/EventsContext";
import InstitutionSection from "@/components/events/InstitutionSection";
import MeetingDetailsSection from "@/components/events/MeetingDetailsSection";
import RequirementsSection from "@/components/events/RequirementsSection";
import SubmitSection from "@/components/events/SubmitSection";

export default function EventForm() {
  const [form, setForm] = useState(blankForm());
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const { addRequest } = useEvents();
  const router = useRouter();

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");

    try {
      const id = await addRequest(form);
      setSubmittedId(id);
    } catch (err) {
      setSubmitError(err.message || "Unable to submit event request");
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedId) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30">
          <CheckCircle2 size={24} />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-slate-800">Request sent for approval</h2>
        <p className="mt-1 text-sm text-slate-500">
          <span className="font-semibold text-blue-600">{submittedId}</span> is now waiting on
          HOD approval, followed by HOI and Manager.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => router.push(`/events/${submittedId}`)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 shadow-md shadow-blue-600/25"
          >
            View request
          </button>
          <button
            onClick={() => router.push("/events")}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-blue-300"
          >
            Go to tracking
          </button>
          <button
            onClick={() => {
              setForm(blankForm());
              setSubmittedId(null);
            }}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-blue-300"
          >
            Submit another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <InstitutionSection form={form} onChange={handleChange} />
      <MeetingDetailsSection form={form} onChange={handleChange} />
      <RequirementsSection form={form} onChange={handleChange} />
      <SubmitSection
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
      {submitError && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
          {submitError}
        </p>
      )}
    </div>
  );
}
