"use client";

import { useState } from "react";
import Link from "next/link";
import { LuChevronRight as ChevronRight } from "react-icons/lu";
import { useEvents, overallStatus } from "@/context/EventsContext";
import StatusBadge from "@/components/events/StatusBadge";

const filters = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

export default function RequestsTable() {
  const { requests, loading, error } = useEvents();
  const [filter, setFilter] = useState("all");

  const filtered = requests.filter((r) =>
    filter === "all" ? true : overallStatus(r.approvals) === filter
  );

  return (
    <section
      aria-label="Event form tracking"
      className="rounded-2xl border border-slate-100 bg-white p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xs font-bold text-slate-800">All requests</h2>
        <div className="flex gap-1 rounded-full bg-slate-50 p-1 border border-slate-100">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-3 py-1.5 text-[10px] font-bold transition-all ${
                filter === f.key
                  ? "bg-white text-slate-800 border border-slate-200"
                  : "text-slate-400 hover:text-slate-700 border border-transparent"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        {error && (
          <p className="mb-3 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-[10px] font-bold text-amber-700">
            Showing local sample data because the API could not be reached.
          </p>
        )}
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
              <th className="pb-3 font-bold">ID</th>
              <th className="pb-3 font-bold">Purpose / applicant</th>
              <th className="pb-3 font-bold">Date(s)</th>
              <th className="pb-3 font-bold">HOD</th>
              <th className="pb-3 font-bold">HOI</th>
              <th className="pb-3 font-bold">Manager</th>
              <th className="pb-3 font-bold">Status</th>
              <th className="pb-3 font-bold text-right">&nbsp;</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3 font-bold text-slate-700">{r.id}</td>
                <td className="py-3">
                  <p className="font-bold text-slate-800">{r.form.purpose || "—"}</p>
                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{r.form.applicantName}</p>
                </td>
                <td className="py-3 font-semibold text-slate-500">{r.form.dates || "—"}</td>
                {["hod", "hoi", "manager"].map((stage) => (
                  <td key={stage} className="py-3">
                    <StatusBadge status={r.approvals[stage].status} />
                  </td>
                ))}
                <td className="py-3">
                  <StatusBadge status={overallStatus(r.approvals)} size="md" />
                </td>
                <td className="py-3 text-right">
                  <Link
                    href={`/events/${r.id}`}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-primary-600 hover:text-primary-800"
                  >
                    Review
                    <ChevronRight size={12} />
                  </Link>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="py-8 text-center text-xs font-semibold text-slate-400">
                  {loading ? "Loading events..." : "No requests in this filter."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
