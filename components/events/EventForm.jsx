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
  const { addRequest } = useEvents();
  const router = useRouter();

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      const id = addRequest(form);
      setSubmitting(false);
      setSubmittedId(id);
    }, 500);
  };

  if (submittedId) {
    return (
      <div className="rounded-xl border border-secondary-100 bg-secondary-50/60 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary-600 text-white">
          <CheckCircle2 size={24} />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-primary-950">Request sent for approval</h2>
        <p className="mt-1 text-sm text-primary-500">
          <span className="font-semibold text-primary-800">{submittedId}</span> is now waiting on
          HOD approval, followed by HOI and Manager.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => router.push(`/events/${submittedId}`)}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            View request
          </button>
          <button
            onClick={() => router.push("/events")}
            className="rounded-lg border border-primary-200 px-4 py-2 text-sm font-medium text-primary-700 hover:bg-white"
          >
            Go to tracking
          </button>
          <button
            onClick={() => {
              setForm(blankForm());
              setSubmittedId(null);
            }}
            className="rounded-lg border border-primary-200 px-4 py-2 text-sm font-medium text-primary-700 hover:bg-white"
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
    </div>
  );
}
