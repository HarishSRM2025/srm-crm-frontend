"use client";

import { useState } from "react";
import Link from "next/link";
import { LuChevronRight as ChevronRight, LuSearch as Search, LuInbox as Inbox } from "react-icons/lu";
import { useEvents, overallStatus } from "@/context/EventsContext";
import StatusBadge from "@/components/events/StatusBadge";
import { useAuth } from "@/context/AuthContext";

const filters = [
  { key: "all", label: "All requests" },
  { key: "pending", label: "Pending action" },
  { key: "approved", label: "Fully approved" },
  { key: "rejected", label: "Rejected" },
];

export default function RequestsTable({ requests: propRequests, title = "Track Event Requests", subtitle = "Scoping is automatically applied based on your role context." }) {
  const { requests: contextRequests, loading, error } = useEvents();
  const requests = propRequests !== undefined ? propRequests : contextRequests;
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const { user: currentUser } = useAuth();

  const filtered = requests.filter((r) => {
    const matchesFilter = filter === "all" ? true : overallStatus(r.approvals) === filter;
    const matchesSearch =
      search.trim() === "" ||
      (r.id?.toLowerCase().includes(search.toLowerCase()) ||
        r.form?.purpose?.toLowerCase().includes(search.toLowerCase()) ||
        r.form?.applicantName?.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <section
      aria-label="Event form tracking"
      className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-slate-500/5 rounded-full blur-xl pointer-events-none" />
      
      {/* Header and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-sm font-extrabold text-slate-800">{title}</h2>
          <p className="text-[10px] text-slate-400 font-bold mt-0.5">{subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative rounded-full border border-slate-200 bg-slate-50/50 px-3 py-1.5 focus-within:ring-2 focus-within:ring-slate-400/20 focus-within:border-slate-400 focus-within:bg-white transition-all flex items-center gap-2">
            <Search size={13} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search ID, applicant or purpose..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-[11px] font-semibold text-slate-700 outline-none w-44 placeholder:text-slate-400"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex gap-1 rounded-full bg-slate-50 p-1 border border-slate-100/80">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`rounded-full px-3 py-1 text-[10px] font-bold transition-all ${
                  filter === f.key
                    ? "bg-white text-slate-800 shadow-sm border border-slate-100"
                    : "text-slate-400 hover:text-slate-700 border border-transparent"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="mt-5 overflow-x-auto">
        {error && (
          <p className="mb-4 rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3 text-[10px] font-extrabold text-amber-700">
            Showing local cached data because the backend API is unreachable.
          </p>
        )}

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold border-b border-slate-50">
              <th className="pb-3 pl-2 font-extrabold">ID</th>
              <th className="pb-3 font-extrabold">Purpose / Applicant</th>
              <th className="pb-3 font-extrabold">Institution / Dept</th>
              <th className="pb-3 font-extrabold">Date(s)</th>
              <th className="pb-3 text-center font-extrabold">HOD</th>
              <th className="pb-3 text-center font-extrabold">HOI</th>
              <th className="pb-3 text-center font-extrabold">Manager</th>
              <th className="pb-3 text-center font-extrabold">Overall</th>
              <th className="pb-3 text-right pr-2 font-extrabold">&nbsp;</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((r) => {
              const status = overallStatus(r.approvals);
              return (
                <tr key={r.id} className="hover:bg-slate-50/40 transition-colors group">
                  <td className="py-4 pl-2 font-extrabold text-slate-800">{r.id}</td>
                  <td className="py-4">
                    <p className="font-extrabold text-slate-800 group-hover:text-primary-700 transition-colors">
                      {r.form?.purpose || "—"}
                    </p>
                    <p className="text-[10px] font-extrabold text-slate-400 mt-0.5">
                      {r.form?.applicantName || "—"}
                    </p>
                  </td>
                  <td className="py-4">
                    <p className="font-bold text-slate-700">{r.form?.institution || "—"}</p>
                    <p className="text-[9px] font-bold text-slate-400 mt-0.5">{r.form?.department || "—"}</p>
                  </td>
                  <td className="py-4 font-bold text-slate-500">{r.form?.dates || "—"}</td>
                  {["hod", "hoi", "manager"].map((stage) => (
                    <td key={stage} className="py-4 text-center">
                      <StatusBadge status={r.approvals[stage].status} size="sm" />
                    </td>
                  ))}
                  <td className="py-4 text-center">
                    <StatusBadge status={status} size="sm" />
                  </td>
                  <td className="py-4 text-right pr-2">
                    <Link
                      href={`/events/${r.id}`}
                      className="inline-flex items-center gap-1 rounded-xl bg-slate-50 px-3 py-1.5 text-[10px] font-bold text-slate-600 border border-slate-100 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
                    >
                      Review
                      <ChevronRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </td>
                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="py-12 text-center text-xs font-bold text-slate-400">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-800" />
                      Retrieving live requests data...
                    </span>
                  ) : (
                    <div className="space-y-2">
                      <Inbox size={24} className="mx-auto text-slate-300" />
                      <p>No event requests found matching criteria.</p>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
