"use client";

import { LuClock as Clock, LuCircleCheck as CheckCircle2, LuCircleX as XCircle, LuFileText as FileText } from "react-icons/lu";
import { useEvents, overallStatus } from "@/context/EventsContext";
import { STATUS } from "@/lib/events-data";

export default function TrackingSummary() {
  const { requests } = useEvents();

  const counts = requests.reduce(
    (acc, r) => {
      const status = overallStatus(r.approvals);
      acc[status] += 1;
      acc.total += 1;
      return acc;
    },
    { [STATUS.PENDING]: 0, [STATUS.APPROVED]: 0, [STATUS.REJECTED]: 0, total: 0 }
  );

  const cards = [
    { label: "Total requests", value: counts.total, Icon: FileText, bg: "bg-[#e0ebff]/60 border-[#cbdfff]", text: "text-[#2e62c7]" },
    { label: "Pending approval", value: counts[STATUS.PENDING], Icon: Clock, bg: "bg-[#fff0e0]/60 border-[#ffe0c2]", text: "text-[#d97706]" },
    { label: "Fully approved", value: counts[STATUS.APPROVED], Icon: CheckCircle2, bg: "bg-[#e6f9f5]/60 border-[#ccf2ea]", text: "text-[#0d9488]" },
    { label: "Rejected", value: counts[STATUS.REJECTED], Icon: XCircle, bg: "bg-[#ffe8f0]/60 border-[#ffd1e3]", text: "text-[#db2777]" },
  ];

  return (
    <section aria-label="Tracking summary" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ label, value, Icon, bg, text }) => (
        <div key={label} className={`flex items-center gap-4 rounded-2xl border p-5 transition-all ${bg}`}>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-100/50 text-slate-700">
            <Icon size={20} />
          </div>
          <div>
            <p className={`text-2xl font-bold leading-none ${text}`}>{value}</p>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{label}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
