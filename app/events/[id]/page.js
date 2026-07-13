"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LuArrowLeft as ArrowLeft,
  LuCalendar as Calendar,
  LuClock as Clock,
  LuUser as User,
  LuBuilding2 as Building,
  LuMapPin as MapPin,
  LuUsers as Users,
  LuSparkles as Sparkles,
  LuCircleCheck as CheckCircle2,
  LuCircleX as XCircle,
  LuInfo as Info,
  LuLock as Lock,
  LuFileText as FileText,
  LuUserCheck as UserCheck,
  LuArrowRight as ArrowRight,
  LuPhone as Phone,
  LuBadgeHelp as BadgeHelp,
  LuCpu as Cpu,
} from "react-icons/lu";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import StatusBadge from "@/components/events/StatusBadge";
import { useEvents, overallStatus } from "@/context/EventsContext";
import { APPROVAL_STAGES, STATUS } from "@/lib/events-data";
import { useAuth } from "@/context/AuthContext";

const stageLabels = { hod: "HOD", hoi: "HOI", manager: "Manager" };

export default function EventDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getRequest, decideApproval } = useEvents();
  const { user } = useAuth();
  const request = getRequest(id);

  const [approverName, setApproverName] = useState("");
  const [approvalNote, setApprovalNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  const overall = overallStatus(request.approvals);

  const isLocked = (stageKey) => {
    const idx = APPROVAL_STAGES.indexOf(stageKey);
    const priorStages = APPROVAL_STAGES.slice(0, idx);
    return priorStages.some((s) => request.approvals[s].status !== STATUS.APPROVED);
  };

  const isActiveStage = (stageKey) => {
    const stage = request.approvals[stageKey];
    return stage.status === STATUS.PENDING && !isLocked(stageKey);
  };

  const visibleStages = APPROVAL_STAGES.filter((stageKey) => {
    if (user?.role === "HOD") return stageKey === "hod";
    if (user?.role === "HOI") return stageKey === "hoi";
    if (user?.role === "Manager") return stageKey === "manager";
    return true;
  });

  const handleAction = async (stageKey, status) => {
    if (!approverName.trim()) {
      alert("Please enter your name to complete this action.");
      return;
    }
    setSubmitting(true);
    try {
      await decideApproval(request.id, stageKey, status, {
        by: approverName,
        note: approvalNote,
      });
      setApproverName("");
      setApprovalNote("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusStyles = () => {
    if (overall === STATUS.APPROVED) {
      return {
        bg: "bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border-emerald-500/20 text-emerald-950",
        ring: "ring-emerald-500/10",
        accent: "border-l-4 border-l-emerald-500",
      };
    }
    if (overall === STATUS.REJECTED) {
      return {
        bg: "bg-gradient-to-r from-rose-500/10 via-pink-500/5 to-transparent border-rose-500/20 text-rose-950",
        ring: "ring-rose-500/10",
        accent: "border-l-4 border-l-rose-500",
      };
    }
    return {
      bg: "bg-gradient-to-r from-sky-500/10 via-indigo-500/5 to-transparent border-sky-500/20 text-sky-950",
      ring: "ring-sky-500/10",
      accent: "border-l-4 border-l-sky-500",
    };
  };

  const statusStyles = getStatusStyles();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50">
      <Sidebar />

      <div className="lg:pl-72">
        <Topbar
          title={request.id}
          subtitle={`Submitted ${request.submittedOn} by ${request.form.applicantName || "—"}`}
          actionLabel="New event form"
          actionHref="/events/new"
        />

        <main className="space-y-6 p-4 lg:p-8 max-w-7xl mx-auto">
          {/* Header Action Row */}
          <div className="flex items-center">
            <button
              onClick={() => router.push("/events")}
              className="group inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 shadow-sm hover:shadow transition-all"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              Back to tracking list
            </button>
          </div>

          {/* Premium Glowing Status Banner */}
          <div
            className={`flex flex-wrap items-center justify-between gap-4 rounded-3xl border p-6 shadow-sm transition-all duration-300 ${statusStyles.bg} ${statusStyles.ring} ${statusStyles.accent} ring-4 backdrop-blur-md`}
          >
            <div className="space-y-1">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">
                Overall Request Status
              </span>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 leading-snug">
                {request.form.purpose || "Event Request"}
              </h2>
            </div>
            <StatusBadge status={overall} size="md" />
          </div>

          {/* Balanced Two-Column Details & Stepper Layout */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            
            {/* Left Column: Form Details Card (7/12 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2.5 border-b border-slate-100 pb-4">
                  <span className="p-2 rounded-lg bg-blue-50 text-blue-500">
                    <FileText size={16} />
                  </span>
                  Submitted Request Details
                </h3>

                <div className="mt-6 space-y-8">
                  {/* Category 1 */}
                  <div>
                    <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-3.5 flex items-center gap-1.5">
                      <Building size={12} />
                      Applicant &amp; Institution
                    </h4>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 rounded-2xl bg-slate-50/60 p-5 border border-slate-100/50">
                      <div>
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Institution</span>
                        <p className="text-xs font-bold text-slate-800 mt-1">
                          {request.form.event_applicant_institution || "—"}
                        </p>
                      </div>
                      <div>
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Applicant Name</span>
                        <p className="text-xs font-bold text-slate-800 mt-1">
                          {request.form.event_applicant_name || "—"}
                        </p>
                      </div>
                      <div>
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Department</span>
                        <p className="text-xs font-bold text-slate-800 mt-1">
                          {request.form.event_department || "—"}
                        </p>
                      </div>
                      <div>
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Designation</span>
                        <p className="text-xs font-bold text-slate-800 mt-1">
                          {request.form.event_designation || "—"}
                        </p>
                      </div>
                      <div>
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Organizer</span>
                        <p className="text-xs font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                          <User size={13} className="text-slate-400" />
                          {request.form.event_organizer_name || "—"}
                        </p>
                      </div>
                      <div>
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Phone</span>
                        <p className="text-xs font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                          <Phone size={13} className="text-slate-400" />
                          {request.form.event_organizer_phone || "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Category 2 */}
                  <div>
                    <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-3.5 flex items-center gap-1.5">
                      <Clock size={12} />
                      Event Timing &amp; Scope
                    </h4>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 rounded-2xl bg-slate-50/60 p-5 border border-slate-100/50">
                      <div className="sm:col-span-2">
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Event details</span>
                        <p className="text-xs font-bold text-slate-800 mt-1">
                          {request.form.event_details || "—"}
                        </p>
                      </div>
                      <div>
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Date</span>
                        <p className="text-xs font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                          <Calendar size={13} className="text-slate-400" />
                          {request.form.dates || "—"}
                        </p>
                      </div>
                      <div>
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Timings</span>
                        <p className="text-xs font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                          <Clock size={13} className="text-slate-400" />
                          {request.form.event_start_time} – {request.form.event_end_time}
                        </p>
                      </div>
                      <div>
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Participant Count</span>
                        <p className="text-xs font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                          <Users size={13} className="text-slate-400" />
                          {request.form.event_participant_count || "0"}
                        </p>
                      </div>
                      <div>
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">VIP / Guest Name</span>
                        <p className="text-xs font-bold text-slate-800 mt-1">
                          {request.form.event_guest_name || "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Category 3 */}
                  <div>
                    <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-3.5 flex items-center gap-1.5">
                      <Cpu size={12} />
                      Equipment Requirements
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      <div className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-bold shadow-sm transition-all duration-300 ${
                        request.form.event_micset 
                          ? "bg-sky-50/50 border-sky-200 text-sky-700" 
                          : "bg-slate-50 border-slate-100 text-slate-400"
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${request.form.event_micset ? "bg-sky-600 animate-pulse" : "bg-slate-300"}`} />
                        Mike Sets {request.form.event_micset ? "(Required)" : "(Not Required)"}
                      </div>
                      <div className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-bold shadow-sm transition-all duration-300 ${
                        request.form.event_white_board 
                          ? "bg-sky-50/50 border-sky-200 text-sky-700" 
                          : "bg-slate-50 border-slate-100 text-slate-400"
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${request.form.event_white_board ? "bg-sky-600 animate-pulse" : "bg-slate-300"}`} />
                        White Board {request.form.event_white_board ? "(Required)" : "(Not Required)"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Premium Stepper & Action Box (5/12 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Stepper Card */}
              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2.5 border-b border-slate-100 pb-4">
                  <span className="p-2 rounded-lg bg-indigo-50 text-indigo-500">
                    <UserCheck size={16} />
                  </span>
                  Approval Flow Tracker
                </h3>

                {/* Timeline Stepper */}
                <div className="mt-6 relative pl-6 border-l border-slate-100 space-y-8">
                  {visibleStages.map((stageKey) => {
                    const stage = request.approvals[stageKey];
                    const label = stageLabels[stageKey];
                    const isCompleted = stage.status === STATUS.APPROVED;
                    const isRejected = stage.status === STATUS.REJECTED;
                    const isPending = stage.status === STATUS.PENDING;
                    const locked = isLocked(stageKey);
                    const activeAction = isActiveStage(stageKey) && user?.role === label;

                    // Bullet styling logic
                    let bulletColor = "bg-slate-50 border-slate-200 text-slate-400";
                    let BulletIcon = Clock;
                    if (isCompleted) {
                      bulletColor = "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20";
                      BulletIcon = CheckCircle2;
                    } else if (isRejected) {
                      bulletColor = "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/20";
                      BulletIcon = XCircle;
                    } else if (!locked) {
                      bulletColor = "bg-sky-500 border-sky-500 text-white shadow-lg shadow-sky-500/20 animate-pulse";
                      BulletIcon = Sparkles;
                    } else {
                      BulletIcon = Lock;
                    }

                    return (
                      <div key={stageKey} className="relative">
                        {/* Timeline Bullet */}
                        <span className={`absolute -left-[38px] top-0 flex h-6 w-6 items-center justify-center rounded-full border text-[12px] transition-all duration-300 z-10 ${bulletColor}`}>
                          <BulletIcon size={12} />
                        </span>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-extrabold text-slate-800">{label} Approval</h4>
                            <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-widest ${
                              isCompleted 
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                                : isRejected 
                                ? "bg-rose-50 text-rose-700 border-rose-100" 
                                : locked 
                                ? "bg-slate-50 text-slate-400 border-slate-100" 
                                : "bg-sky-50 text-sky-700 border-sky-100"
                            }`}>
                              {stage.status}
                            </span>
                          </div>

                          {/* Completed/Rejected Notes */}
                          {(isCompleted || isRejected) && (
                            <div className="mt-2.5 rounded-2xl bg-slate-50/50 p-4 border border-slate-100/50 space-y-1 text-[11px] font-semibold text-slate-500">
                              <p className="text-slate-800 font-bold">Decided by {stage.by}</p>
                              {stage.date && <p className="text-[10px] text-slate-400 font-medium">{stage.date}</p>}
                              {stage.note && <p className="mt-1.5 text-slate-600 italic font-medium">"{stage.note}"</p>}
                            </div>
                          )}

                          {/* Locked Message */}
                          {locked && isPending && (
                            <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 mt-1 bg-slate-50/30 px-2 py-1 rounded-md border border-slate-100/40 w-fit">
                              <Lock size={10} />
                              Awaiting prior decisions.
                            </p>
                          )}

                          {/* Active Stage & Has Authority to Sign */}
                          {activeAction && (
                            <div className="mt-3.5 p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100/60 space-y-3.5 relative overflow-hidden shadow-sm">
                              <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl" />
                              <div className="flex items-center gap-1.5 text-indigo-700 font-bold text-[11px]">
                                <Sparkles size={13} className="animate-pulse" />
                                Action required for your role
                              </div>

                              <div className="space-y-2.5">
                                <input
                                  type="text"
                                  placeholder={`Your name (as ${label})`}
                                  className="w-full rounded-xl border border-indigo-100 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all shadow-inner"
                                  value={approverName}
                                  onChange={(e) => setApproverName(e.target.value)}
                                />
                                <textarea
                                  placeholder="Provide feedback, queries or decisions note (optional)"
                                  rows={2}
                                  className="w-full rounded-xl border border-indigo-100 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all shadow-inner"
                                  value={approvalNote}
                                  onChange={(e) => setApprovalNote(e.target.value)}
                                />

                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleAction(stageKey, STATUS.APPROVED)}
                                    disabled={submitting}
                                    className="flex-1 rounded-xl bg-secondary-600 hover:bg-secondary-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleAction(stageKey, STATUS.REJECTED)}
                                    disabled={submitting}
                                    className="flex-1 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 px-4 py-2.5 text-xs font-bold transition-all active:scale-[0.98]"
                                  >
                                    Reject
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Active Stage but No Authority */}
                          {isPending && !locked && !activeAction && (
                            <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 mt-1.5 bg-slate-50/50 px-3 py-2 rounded-xl border border-slate-100/50 w-fit">
                              <Info size={11} className="text-slate-400" />
                              Under review by {label}.
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
