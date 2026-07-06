"use client";

import { useParams, useRouter } from "next/navigation";
import { LuArrowLeft as ArrowLeft } from "react-icons/lu";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import RequestDetailsCard from "@/components/events/RequestDetailsCard";
import ApprovalStageCard from "@/components/events/ApprovalStageCard";
import OfficeUseSection from "@/components/events/OfficeUseSection";
import StatusBadge from "@/components/events/StatusBadge";
import { useEvents, overallStatus } from "@/context/EventsContext";
import { APPROVAL_STAGES, STATUS } from "@/lib/events-data";

const stageLabels = { hod: "HOD", hoi: "HOI", manager: "Manager" };

export default function EventDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getRequest, decideApproval, updateOfficeUse } = useEvents();
  const request = getRequest(id);

  if (!request) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Sidebar />
        <div className="lg:pl-72">
          <Topbar title="Request not found" actionLabel="Tracking" actionHref="/events" />
          <main className="p-8">
            <p className="text-sm text-slate-500">
              We couldn't find that request. It may have been removed.
            </p>
            <button
              onClick={() => router.push("/events")}
              className="mt-3 text-sm font-medium text-primary-600 hover:text-primary-800"
            >
              ← Back to tracking
            </button>
          </main>
        </div>
      </div>
    );
  }

  // A stage is actionable only once all prior stages are approved, and only
  // while nothing upstream has been rejected.
  const isLocked = (stageKey) => {
    const idx = APPROVAL_STAGES.indexOf(stageKey);
    const priorStages = APPROVAL_STAGES.slice(0, idx);
    return priorStages.some((s) => request.approvals[s].status !== STATUS.APPROVED);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="lg:pl-72">
        <Topbar
          title={request.id}
          subtitle={`Submitted ${request.submittedOn} by ${request.form.applicantName || "—"}`}
          actionLabel="New event form"
          actionHref="/events/new"
        />

        <main className="space-y-6 p-4 lg:p-8">
          <button
            onClick={() => router.push("/events")}
            className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-800"
          >
            <ArrowLeft size={15} />
            Back to tracking
          </button>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-5">
            <div>
              <p className="text-xs text-primary-400">Overall approval status</p>
              <p className="mt-1 text-lg font-semibold text-primary-950">{request.form.purpose || "—"}</p>
            </div>
            <StatusBadge status={overallStatus(request.approvals)} size="md" />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <RequestDetailsCard request={request} />

            <div className="space-y-4 xl:col-span-2">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {APPROVAL_STAGES.map((stageKey) => (
                  <ApprovalStageCard
                    key={stageKey}
                    stageKey={stageKey}
                    stageLabel={stageLabels[stageKey]}
                    stage={request.approvals[stageKey]}
                    locked={isLocked(stageKey)}
                    onDecide={(stage, status, details) =>
                      decideApproval(request.id, stage, status, details)
                    }
                  />
                ))}
              </div>

              <OfficeUseSection
                officeUse={request.officeUse}
                onSave={(officeUse) => updateOfficeUse(request.id, officeUse)}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
