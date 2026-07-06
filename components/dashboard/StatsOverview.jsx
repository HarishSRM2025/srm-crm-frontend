"use client";

import { LuArrowUpRight as ArrowUpRight, LuArrowDownRight as ArrowDownRight } from "react-icons/lu";
import { statCards } from "@/lib/data";

export default function StatsOverview() {
  return (
    <section aria-label="Key metrics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statCards.map((stat) => {
        const isUp = stat.trend === "up";
        return (
          <div
            key={stat.label}
            className="rounded-xl border border-primary-100 bg-white p-5"
          >
            <p className="text-sm font-medium text-primary-500">{stat.label}</p>
            <div className="mt-2 flex items-end justify-between">
              <p className="text-2xl font-semibold text-primary-950">{stat.value}</p>
              <span
                className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
                  isUp
                    ? "bg-secondary-50 text-secondary-700"
                    : "bg-rose-50 text-rose-600"
                }`}
              >
                {isUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                {stat.delta}
              </span>
            </div>
            <p className="mt-1 text-xs text-primary-400">{stat.caption}</p>
          </div>
        );
      })}
    </section>
  );
}
