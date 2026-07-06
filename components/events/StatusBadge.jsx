"use client";

import { LuClock as Clock, LuCircleCheck as CheckCircle2, LuCircleX as XCircle } from "react-icons/lu";
import { STATUS } from "@/lib/events-data";

const styles = {
  [STATUS.PENDING]: {
    cls: "bg-[#fff0e0] text-[#d97706] border border-[#ffe0c2]",
    Icon: Clock,
    label: "Pending",
  },
  [STATUS.APPROVED]: {
    cls: "bg-[#e6f9f5] text-[#0d9488] border border-[#ccf2ea]",
    Icon: CheckCircle2,
    label: "Approved",
  },
  [STATUS.REJECTED]: {
    cls: "bg-[#ffe8f0] text-[#db2777] border border-[#ffd1e3]",
    Icon: XCircle,
    label: "Rejected",
  },
};

export default function StatusBadge({ status, size = "sm" }) {
  const s = styles[status] || styles[STATUS.PENDING];
  const { Icon } = s;
  const textSize = size === "sm" ? "text-[9px]" : "text-[10px]";
  const iconSize = size === "sm" ? 10 : 12;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-bold ${textSize} ${s.cls}`}
    >
      <Icon size={iconSize} />
      {s.label}
    </span>
  );
}
