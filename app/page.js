"use client";

import Link from "next/link";
import {
  LuStethoscope as Stethoscope,
  LuCalendarDays as CalendarDays,
  LuShieldCheck as ShieldCheck,
  LuClock as Clock,
  LuMapPin as MapPin,
  LuUser as User,
  LuPencil as Pencil,
  LuCircleCheck as CircleCheck,
  LuCircleAlert as CircleAlert,
  LuArrowRight as ArrowRight,
} from "react-icons/lu";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { useDoctors, STATUSES as DOC_STATUSES } from "@/context/DoctorsContext";
import { useEvents, overallStatus } from "@/context/EventsContext";
import { STATUS as EVT_STATUS } from "@/lib/events-data";

export default function DashboardPage() {
  const { doctors } = useDoctors();
  const { requests } = useEvents();

  const publishedCount = doctors.filter((d) => d.status === DOC_STATUSES.PUBLISHED).length;
  const draftCount = doctors.filter((d) => d.status === DOC_STATUSES.DRAFT).length;
  const reviewCount = doctors.filter((d) => d.status === DOC_STATUSES.REVIEW).length;
  const pendingBookings = requests.filter((r) => overallStatus(r.approvals) === EVT_STATUS.PENDING).length;
  const approvedBookings = requests.filter((r) => overallStatus(r.approvals) === EVT_STATUS.APPROVED).length;

  const statCards = [
    {
      label: "Total Doctors",
      value: doctors.length,
      icon: Stethoscope,
      bg: "bg-[#e0ebff]/60 border-[#cbdfff]",
      text: "text-[#2e62c7]",
    },
    {
      label: "Published Profiles",
      value: publishedCount,
      icon: CircleCheck,
      bg: "bg-[#e6f9f5]/60 border-[#ccf2ea]",
      text: "text-[#0d9488]",
    },
    {
      label: "Pending Bookings",
      value: pendingBookings,
      icon: Clock,
      bg: "bg-[#fff0e0]/60 border-[#ffe0c2]",
      text: "text-[#d97706]",
    },
    {
      label: "Approved Bookings",
      value: approvedBookings,
      icon: ShieldCheck,
      bg: "bg-[#ffe8f0]/60 border-[#ffd1e3]",
      text: "text-[#db2777]",
    },
  ];

  // Recent doctor profiles (last 4)
  const recentDoctors = doctors.slice(0, 4);

  // Upcoming hall bookings (approved or pending, up to 3)
  const upcomingBookings = requests
    .filter((r) => overallStatus(r.approvals) !== EVT_STATUS.REJECTED)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-transparent">
      <Sidebar />

      <div className="lg:pl-72">
        <Topbar
          title="Admin Dashboard"
          subtitle="Medical college overview and quick actions."
          actionLabel="Create profile"
          actionHref="/doctors/new"
        />

        <main className="space-y-6 p-4 lg:p-8">
          {/* Board control subheader style */}
          <div>
            <h2 className="text-sm font-bold text-slate-800">Quick Metrics</h2>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Key data pointers from directory and events workflow</p>
          </div>

          {/* Stat Cards in reference style */}
          <section aria-label="Key metrics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className={`flex items-center gap-4 rounded-2xl border p-5 transition-all ${stat.bg}`}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-100/50 text-slate-700">
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className={`text-2xl font-bold leading-none ${stat.text}`}>{stat.value}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Quick Action Navigation Grid */}
          <section aria-label="Navigation cards" className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Link
              href="/doctors"
              className="group rounded-2xl border border-slate-200 bg-white p-5 hover:border-primary-500 transition-all flex justify-between items-center"
            >
              <div>
                <p className="text-xs font-bold text-slate-800">Doctor Directory</p>
                <p className="text-[10px] font-semibold text-slate-400 mt-1">Browse, search and modify profiles</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e0ebff] text-[#2e62c7] group-hover:bg-[#2e62c7] group-hover:text-white transition-all">
                <ArrowRight size={14} />
              </div>
            </Link>

            <Link
              href="/events"
              className="group rounded-2xl border border-slate-200 bg-white p-5 hover:border-teal-500 transition-all flex justify-between items-center"
            >
              <div>
                <p className="text-xs font-bold text-slate-800">Event Hall Bookings</p>
                <p className="text-[10px] font-semibold text-slate-400 mt-1">Track hall allotments & approvals</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e6f9f5] text-[#0d9488] group-hover:bg-[#0d9488] group-hover:text-white transition-all">
                <ArrowRight size={14} />
              </div>
            </Link>

            <Link
              href="/doctors"
              className="group rounded-2xl border border-slate-200 bg-white p-5 hover:border-amber-500 transition-all flex justify-between items-center"
            >
              <div>
                <p className="text-xs font-bold text-slate-800">Review Board</p>
                <p className="text-[10px] font-semibold text-slate-400 mt-1">{reviewCount + draftCount} profiles in pending states</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#fff0e0] text-[#d97706] group-hover:bg-[#d97706] group-hover:text-white transition-all">
                <ArrowRight size={14} />
              </div>
            </Link>
          </section>

          {/* Details Row */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* Recent Doctor Profiles */}
            <section
              aria-label="Recent profiles list"
              className="rounded-2xl border border-slate-200 bg-white p-5 xl:col-span-2 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-slate-800">Doctor Profile Feeds</h2>
                <Link href="/doctors" className="text-[10px] font-bold text-primary-600 hover:text-primary-800">
                  View full directory →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recentDoctors.map((doc) => {
                  const initials = doc.name
                    .split(" ")
                    .filter((_, i) => i === 0 || i === doc.name.split(" ").length - 1)
                    .map((n) => n[0])
                    .join("");
                  return (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 hover:border-slate-300 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-slate-800">{doc.name}</p>
                          <p className="truncate text-[10px] font-semibold text-slate-400 mt-0.5">
                            {doc.designation}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/doctors/${doc.id}`}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                        title="Edit profile"
                      >
                        <Pencil size={12} />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Upcoming Hall Bookings */}
            <section
              aria-label="Upcoming schedule list"
              className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-slate-800">Upcoming Hall Bookings</h2>
                <Link href="/events" className="text-[10px] font-bold text-primary-600 hover:text-primary-800">
                  View schedule →
                </Link>
              </div>

              <div className="space-y-3.5">
                {upcomingBookings.map((r) => (
                  <div
                    key={r.id}
                    className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50/30 p-3"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary-50 text-secondary-600">
                      <CalendarDays size={13} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800 truncate">{r.form.purpose || "Event"}</p>
                      <div className="space-y-1 mt-1.5 text-[10px] font-semibold text-slate-400">
                        <p className="flex items-center gap-1"><Clock size={9} /> {r.form.dates}</p>
                        {r.officeUse?.allotment && (
                          <p className="flex items-center gap-1 text-slate-500 font-bold"><MapPin size={9} /> {r.officeUse.allotment}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {upcomingBookings.length === 0 && (
                  <p className="text-[10px] text-slate-400 text-center py-4 font-semibold">No bookings registered.</p>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
