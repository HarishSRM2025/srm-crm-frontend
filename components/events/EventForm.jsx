"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LuCircleCheck as CheckCircle2, LuTriangleAlert as AlertTriangle, LuCalendarClock as CalendarClock, LuUser as User, LuMapPin as MapPin, LuX as X } from "react-icons/lu";
import { blankForm } from "@/lib/events-data";
import { useEvents } from "@/context/EventsContext";
import InstitutionSection from "@/components/events/InstitutionSection";
import MeetingDetailsSection from "@/components/events/MeetingDetailsSection";
import RequirementsSection from "@/components/events/RequirementsSection";
import SubmitSection from "@/components/events/SubmitSection";

// ---- Date parsing helpers (mirrors the logic used in CalendarView) ----
function parseSingleDate(str) {
  const timestamp = Date.parse(str);
  if (!isNaN(timestamp)) {
    return new Date(timestamp).toISOString().slice(0, 10);
  }

  const monthsMap = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
    january: 0, february: 1, march: 2, april: 3, june: 5, july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
  };

  const parts = str.toLowerCase().split(" ");
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const monthName = parts[1];
    const year = parseInt(parts[2], 10);
    const month = monthsMap[monthName];
    if (!isNaN(day) && month !== undefined && !isNaN(year)) {
      return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }
  }
  return null;
}

function parseEventDates(dateStr) {
  if (!dateStr) return [];
  const cleanStr = dateStr.replace(/\s+/g, " ").trim();

  const rangeParts = cleanStr.split(/–|-/);
  if (rangeParts.length === 2) {
    const start = parseSingleDate(rangeParts[0].trim());
    const end = parseSingleDate(rangeParts[1].trim());
    if (start && end) {
      const dates = [];
      let current = new Date(start);
      const last = new Date(end);
      while (current <= last) {
        dates.push(current.toISOString().slice(0, 10));
        current.setDate(current.getDate() + 1);
      }
      return dates;
    }
  }

  const single = parseSingleDate(cleanStr);
  return single ? [single] : [];
}

// A "full-day" (or similar) session is treated as overlapping any other session on the same date.
function sessionsOverlap(sessionA, sessionB) {
  if (!sessionA || !sessionB) return true; // if either is unspecified, be conservative and flag it
  if (sessionA === sessionB) return true;
  const fullDayValues = ["full-day", "fullday", "full day", "all-day", "allday"];
  if (fullDayValues.includes(sessionA.toLowerCase()) || fullDayValues.includes(sessionB.toLowerCase())) {
    return true;
  }
  return false;
}

/**
 * Checks the new form against existing (non-rejected) requests for a date+session clash.
 * Returns the first conflicting request, or null if the slot is free.
 * NOTE: this checks against ALL existing requests, since venue/hall isn't assigned
 * until office approval — adjust to filter by venue if your form later adds a
 * venue-preference field and you only want to flag same-venue clashes.
 */
function findTimeSlotConflict(newForm, existingRequests, excludeId) {
  const newDates = parseEventDates(newForm.dates);
  if (newDates.length === 0) return null;

  for (const req of existingRequests) {
    if (excludeId && req.id === excludeId) continue;

    // Skip requests that were rejected — they don't hold the slot
    const anyApprovalRejected = Object.values(req.approvals || {}).some(
      (d) => d.status === "Rejected"
    );
    if (anyApprovalRejected) continue;

    const existingDates = parseEventDates(req.form.dates);
    const hasDateOverlap = newDates.some((d) => existingDates.includes(d));
    if (!hasDateOverlap) continue;

    if (sessionsOverlap(newForm.session, req.form.session)) {
      return req;
    }
  }

  return null;
}

export default function EventForm() {
  const [form, setForm] = useState(blankForm());
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [conflict, setConflict] = useState(null); // holds the clashing request, if any
  const { addRequest, requests } = useEvents();
  const router = useRouter();

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setSubmitError("");

    const clash = findTimeSlotConflict(form, requests || []);
    if (clash) {
      setConflict(clash);
      return;
    }

    setSubmitting(true);
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

      {/* Time-slot conflict popup */}
      {conflict && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Time slot already booked</h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Another request overlaps with this date &amp; session.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setConflict(null)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 space-y-3 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
              <p className="text-[9px] font-bold uppercase tracking-wide text-amber-700">
                Conflicting request — {conflict.id}
              </p>

              <div className="flex items-start gap-2.5">
                <CalendarClock size={14} className="mt-0.5 shrink-0 text-amber-600" />
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">Date &amp; Session</p>
                  <p className="text-xs font-bold text-slate-800">{conflict.form.dates}</p>
                  <p className="text-[10px] capitalize text-slate-500">
                    Session: {conflict.form.session?.replace("-", " ")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <User size={14} className="mt-0.5 shrink-0 text-amber-600" />
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">Booked by</p>
                  <p className="text-xs font-bold text-slate-800">{conflict.form.applicantName}</p>
                  <p className="text-[10px] text-slate-500">{conflict.form.institution}</p>
                </div>
              </div>

              {conflict.officeUse?.allotment && (
                <div className="flex items-start gap-2.5">
                  <MapPin size={14} className="mt-0.5 shrink-0 text-amber-600" />
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">Venue</p>
                    <p className="text-xs font-bold text-slate-800">{conflict.officeUse.allotment}</p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">Purpose</p>
                <p className="text-xs text-slate-700">{conflict.form.purpose || "—"}</p>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Please choose a different date or session for your request.
            </p>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setConflict(null)}
                className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
              >
                Choose another slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}