"use client";

/**
 * Role-based Admin Dashboard
 * ---------------------------------------------------------------
 * ASSUMPTIONS (adjust to match your real data shapes):
 *
 * 1. The logged-in user comes from your existing `useAuth()` (AuthContext,
 *    which owns "srm_crm_user" in localStorage) and has at least
 *    { id, name, email, role }, where role is one of:
 *    "Admin", "SuperAdmin", "User", "HOD", "HOI", "Manager"
 *    (edit the ROLES map below if your actual role strings differ).
 *
 * 2. Event ownership: an event request is considered "own" for a user
 *    if any of r.createdBy / r.requestedBy / r.userId / r.ownerId / r.form.email
 *    matches the current user's id / email / username. Adjust
 *    `isOwnEvent()` below to match your real events-data schema.
 *
 * 3. Approval-per-role: r.approvals is assumed to be an object keyed by
 *    lowercase role name, e.g. r.approvals.hod / r.approvals.hoi / r.approvals.manager,
 *    each either a status string or an object with a `.status` field.
 *    Adjust `isPendingForRole()` below if your schema differs.
 *
 * 4. Templates & Users come from `useTemplates()` (see TemplatesContext.jsx)
 *    and `useUsers()` (see UsersContext.jsx) — both created alongside this
 *    file. If you already have real templates/users data sources, swap
 *    those two context files' internals for your real fetch/API logic;
 *    the dashboard only relies on `{ templates }` and `{ users }` shapes.
 * ---------------------------------------------------------------
 */

import { useMemo } from "react";
import Link from "next/link";
import {
  LuStethoscope as Stethoscope,
  LuCalendarDays as CalendarDays,
  LuShieldCheck as ShieldCheck,
  LuClock as Clock,
  LuMapPin as MapPin,
  LuUsers as Users,
  LuPencil as Pencil,
  LuCircleCheck as CircleCheck,
  LuFileText as FileText,
  LuArrowRight as ArrowRight,
  LuHourglass as Hourglass,
} from "react-icons/lu";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { useDoctors, STATUSES as DOC_STATUSES } from "@/context/DoctorsContext";
import { useEvents, overallStatus } from "@/context/EventsContext";
import { STATUS as EVT_STATUS } from "@/lib/events-data";

import { useTemplates, STATUSES as TPL_STATUSES } from "@/context/TemplatesContext";
import { useUsers } from "@/context/UsersContext";
import { useAuth } from "@/context/AuthContext";

const ROLES = {
  ADMIN: "Admin",
  SUPER_ADMIN: "SuperAdmin",
  USER: "User",
  HOD: "HOD",
  HOI: "HOI",
  MANAGER: "Manager",
};

function isOwnEvent(request, user) {
  if (!user) return false;
  const candidates = [
    request.createdBy,
    request.requestedBy,
    request.userId,
    request.ownerId,
    request.form?.email,
    request.form?.createdBy,
  ];
  const identifiers = [user.id, user.email, user.username].filter(Boolean);
  return candidates.some((c) => c && identifiers.includes(c));
}

function isPendingForRole(request, roleKey) {
  const approvals = request.approvals || {};
  const approval = approvals[roleKey];
  if (!approval) return false;
  const status = typeof approval === "string" ? approval : approval.status;
  return status === EVT_STATUS.PENDING;
}

export default function DashboardPage() {
  const { doctors } = useDoctors();
  const { requests } = useEvents();

  const { templates } = useTemplates();
  const { users } = useUsers();

  const { user: currentUser, loading: authLoading } = useAuth();

  const role = currentUser?.role;
  const isAdminLike = role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN;
  const isHOD = role === ROLES.HOD;
  const isApproverOnly = role === ROLES.HOI || role === ROLES.MANAGER;
  const isPlainUser = role === ROLES.USER;

  const roleApprovalKey =
    role === ROLES.HOD ? "hod" : role === ROLES.HOI ? "hoi" : role === ROLES.MANAGER ? "manager" : null;

  // ---- Admin / SuperAdmin metrics ----
  const publishedCount = doctors.filter((d) => d.status === DOC_STATUSES.PUBLISHED).length;
  const draftCount = doctors.filter((d) => d.status === DOC_STATUSES.DRAFT).length;
  const reviewCount = doctors.filter((d) => d.status === DOC_STATUSES.REVIEW).length;
  const liveTemplateCount = templates.filter((t) => t.status === TPL_STATUSES.LIVE).length;
  const totalEventsCount = requests.length;

  const recentDoctors = doctors.slice(0, 4);
  const allUpcomingBookings = requests
    .filter((r) => overallStatus(r.approvals) !== EVT_STATUS.REJECTED)
    .slice(0, 3);

  // ---- Own events (User / HOD) ----
  const ownEvents = useMemo(() => requests.filter((r) => isOwnEvent(r, currentUser)), [requests, currentUser]);
  const ownPending = ownEvents.filter((r) => overallStatus(r.approvals) === EVT_STATUS.PENDING).length;
  const ownApproved = ownEvents.filter((r) => overallStatus(r.approvals) === EVT_STATUS.APPROVED).length;

  // ---- Pending-my-approval events (HOD / HOI / Manager) ----
  const pendingApprovalEvents = useMemo(() => {
    if (!roleApprovalKey) return [];
    return requests.filter((r) => isPendingForRole(r, roleApprovalKey));
  }, [requests, roleApprovalKey]);

  const subtitle = isAdminLike
    ? "Medical college overview and quick actions."
    : isHOD
    ? "Your events and approvals awaiting your action."
    : isApproverOnly
    ? "Event requests awaiting your approval."
    : isPlainUser
    ? "Your event bookings at a glance."
    : "Overview";

  if (authLoading) {
    return (
      <div className="min-h-screen bg-transparent">
        <Sidebar />
        <div className="lg:pl-72">
          <Topbar title="Admin Dashboard" subtitle="Loading…" />
          <main className="p-4 lg:p-8">
            <p className="text-xs font-semibold text-slate-400">Loading dashboard…</p>
          </main>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-transparent">
        <Sidebar />
        <div className="lg:pl-72">
          <Topbar title="Admin Dashboard" subtitle="Session not found." />
          <main className="p-4 lg:p-8">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <p className="text-xs font-bold text-amber-700">
                We couldn&apos;t find your session. Please log in again to see your personalized dashboard.
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <Sidebar />

      <div className="lg:pl-72">
        <Topbar
          title="Admin Dashboard"
          subtitle={subtitle}
          actionLabel={isAdminLike ? "Create profile" : undefined}
          actionHref={isAdminLike ? "/doctors/new" : undefined}
        />

        <main className="space-y-6 p-4 lg:p-8">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Quick Metrics</h2>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
              Key data pointers for your role ({role})
            </p>
          </div>

          {/* ---------------- ADMIN / SUPERADMIN ---------------- */}
          {isAdminLike && (
            <>
              <section aria-label="Key metrics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <StatCard label="Total Doctors" value={doctors.length} icon={Stethoscope} bg="bg-[#e0ebff]/60 border-[#cbdfff]" text="text-[#2e62c7]" />
                <StatCard label="Published Profiles" value={publishedCount} icon={CircleCheck} bg="bg-[#e6f9f5]/60 border-[#ccf2ea]" text="text-[#0d9488]" />
                <StatCard label="Total Events" value={totalEventsCount} icon={CalendarDays} bg="bg-[#fff0e0]/60 border-[#ffe0c2]" text="text-[#d97706]" />
                <StatCard label="Live Templates" value={liveTemplateCount} icon={FileText} bg="bg-[#f2e9ff]/60 border-[#e3d1ff]" text="text-[#7c3aed]" />
                <StatCard label="Total Users" value={users.length} icon={Users} bg="bg-[#ffe8f0]/60 border-[#ffd1e3]" text="text-[#db2777]" />
              </section>

              <section aria-label="Navigation cards" className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <NavCard href="/doctors" title="Doctor Directory" subtitle="Browse, search and modify profiles" bg="bg-[#e0ebff]" text="text-[#2e62c7]" hoverBorder="hover:border-primary-500" />
                <NavCard href="/events" title="Event Hall Bookings" subtitle="Track hall allotments & approvals" bg="bg-[#e6f9f5]" text="text-[#0d9488]" hoverBorder="hover:border-teal-500" />
                <NavCard href="/doctors" title="Review Board" subtitle={`${reviewCount + draftCount} profiles in pending states`} bg="bg-[#fff0e0]" text="text-[#d97706]" hoverBorder="hover:border-amber-500" />
              </section>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <section aria-label="Recent profiles list" className="rounded-2xl border border-slate-200 bg-white p-5 xl:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-bold text-slate-800">Doctor Profile Feeds</h2>
                    <Link href="/doctors" className="text-[10px] font-bold text-primary-600 hover:text-primary-800">
                      View full directory →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recentDoctors.map((doc) => {
                      const parts = doc.name.split(" ");
                      const initials = parts
                        .filter((_, i) => i === 0 || i === parts.length - 1)
                        .map((n) => n[0])
                        .join("");
                      return (
                        <div key={doc.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 hover:border-slate-300 transition-all">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-xs font-bold text-slate-800">{doc.name}</p>
                              <p className="truncate text-[10px] font-semibold text-slate-400 mt-0.5">{doc.designation}</p>
                            </div>
                          </div>
                          <Link href={`/doctors/${doc.id}`} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors" title="Edit profile">
                            <Pencil size={12} />
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <EventListCard title="All Upcoming Bookings" viewHref="/events" events={allUpcomingBookings} emptyText="No bookings registered." />
              </div>
            </>
          )}

          {/* ---------------- PLAIN USER ---------------- */}
          {isPlainUser && (
            <>
              <section aria-label="Key metrics" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="My Events" value={ownEvents.length} icon={CalendarDays} bg="bg-[#e0ebff]/60 border-[#cbdfff]" text="text-[#2e62c7]" />
                <StatCard label="Pending" value={ownPending} icon={Clock} bg="bg-[#fff0e0]/60 border-[#ffe0c2]" text="text-[#d97706]" />
                <StatCard label="Approved" value={ownApproved} icon={CircleCheck} bg="bg-[#e6f9f5]/60 border-[#ccf2ea]" text="text-[#0d9488]" />
              </section>

              <EventListCard title="My Event Bookings" viewHref="/events" events={ownEvents} emptyText="You haven't submitted any bookings yet." fullWidth />
            </>
          )}

          {/* ---------------- HOD ---------------- */}
          {isHOD && (
            <>
              <section aria-label="Key metrics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="My Events" value={ownEvents.length} icon={CalendarDays} bg="bg-[#e0ebff]/60 border-[#cbdfff]" text="text-[#2e62c7]" />
                <StatCard label="My Pending" value={ownPending} icon={Clock} bg="bg-[#fff0e0]/60 border-[#ffe0c2]" text="text-[#d97706]" />
                <StatCard label="My Approved" value={ownApproved} icon={CircleCheck} bg="bg-[#e6f9f5]/60 border-[#ccf2ea]" text="text-[#0d9488]" />
                <StatCard label="Awaiting My Approval" value={pendingApprovalEvents.length} icon={Hourglass} bg="bg-[#ffe8f0]/60 border-[#ffd1e3]" text="text-[#db2777]" />
              </section>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <EventListCard title="My Event Bookings" viewHref="/events" events={ownEvents} emptyText="You haven't submitted any bookings yet." />
                <EventListCard title="Pending My Approval" viewHref="/events" events={pendingApprovalEvents} emptyText="Nothing awaiting your approval." />
              </div>
            </>
          )}

          {/* ---------------- HOI / MANAGER ---------------- */}
          {isApproverOnly && (
            <>
              <section aria-label="Key metrics" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <StatCard label="Awaiting My Approval" value={pendingApprovalEvents.length} icon={Hourglass} bg="bg-[#ffe8f0]/60 border-[#ffd1e3]" text="text-[#db2777]" />
                <StatCard label="Total Events" value={requests.length} icon={CalendarDays} bg="bg-[#e0ebff]/60 border-[#cbdfff]" text="text-[#2e62c7]" />
              </section>

              <EventListCard title="Pending My Approval" viewHref="/events" events={pendingApprovalEvents} emptyText="Nothing awaiting your approval." fullWidth />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, bg, text }) {
  return (
    <div className={`flex items-center gap-4 rounded-2xl border p-5 transition-all ${bg}`}>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-100/50 text-slate-700">
        <Icon size={20} />
      </div>
      <div>
        <p className={`text-2xl font-bold leading-none ${text}`}>{value}</p>
        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );
}

function NavCard({ href, title, subtitle, bg, text, hoverBorder }) {
  return (
    <Link href={href} className={`group rounded-2xl border border-slate-200 bg-white p-5 ${hoverBorder} transition-all flex justify-between items-center`}>
      <div>
        <p className="text-xs font-bold text-slate-800">{title}</p>
        <p className="text-[10px] font-semibold text-slate-400 mt-1">{subtitle}</p>
      </div>
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg} ${text} group-hover:opacity-90 transition-all`}>
        <ArrowRight size={14} />
      </div>
    </Link>
  );
}

function EventListCard({ title, viewHref, events, emptyText, fullWidth }) {
  return (
    <section
      aria-label={title}
      className={`rounded-2xl border border-slate-200 bg-white p-5 space-y-4 ${fullWidth ? "" : ""}`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-800">{title}</h2>
        <Link href={viewHref} className="text-[10px] font-bold text-primary-600 hover:text-primary-800">
          View schedule →
        </Link>
      </div>

      <div className="space-y-3.5">
        {events.slice(0, 5).map((r) => (
          <div key={r.id} className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50/30 p-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary-50 text-secondary-600">
              <CalendarDays size={13} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 truncate">{r.form?.purpose || "Event"}</p>
              <div className="space-y-1 mt-1.5 text-[10px] font-semibold text-slate-400">
                <p className="flex items-center gap-1">
                  <Clock size={9} /> {r.form?.dates}
                </p>
                {r.officeUse?.allotment && (
                  <p className="flex items-center gap-1 text-slate-500 font-bold">
                    <MapPin size={9} /> {r.officeUse.allotment}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <p className="text-[10px] text-slate-400 text-center py-4 font-semibold">{emptyText}</p>
        )}
      </div>
    </section>
  );
}