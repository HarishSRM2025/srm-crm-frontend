"use client";

import { useState } from "react";
import { LuCheck as Check, LuX as X, LuLock as Lock } from "react-icons/lu";
import StatusBadge from "@/components/events/StatusBadge";
import { STATUS } from "@/lib/events-data";

export default function ApprovalStageCard({ stageKey, stageLabel, stage, locked, onDecide, readOnly }) {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const decided = stage.status !== STATUS.PENDING;

  return (
    <div className="rounded-xl border border-primary-100 bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-primary-950">{stageLabel} approval</h3>
        <StatusBadge status={stage.status} />
      </div>

      {decided ? (
        <div className="mt-3 text-sm">
          <p className="text-primary-900">
            <span className="font-medium">{stage.by || "—"}</span>{" "}
            <span className="text-primary-400">on {stage.date}</span>
          </p>
          {stage.note && <p className="mt-1 text-xs text-primary-500">"{stage.note}"</p>}
        </div>
      ) : (locked || readOnly) ? (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-primary-50/60 px-3 py-2.5 text-xs text-primary-400">
          <Lock size={13} />
          {readOnly ? "View only stage." : "Waiting on an earlier approval stage."}
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          <input
            className="w-full rounded-lg border border-primary-100 bg-primary-50/40 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white"
            placeholder={`Your name (as ${stageLabel})`}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            className="w-full rounded-lg border border-primary-100 bg-primary-50/40 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white"
            placeholder="Optional note"
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={() => onDecide(stageKey, STATUS.APPROVED, { by: name, note })}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-secondary-600 px-3 py-2 text-xs font-semibold text-white hover:bg-secondary-700"
            >
              <Check size={14} />
              Approve
            </button>
            <button
              onClick={() => onDecide(stageKey, STATUS.REJECTED, { by: name, note })}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
            >
              <X size={14} />
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
