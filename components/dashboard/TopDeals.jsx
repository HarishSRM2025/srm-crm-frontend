"use client";

import { topDeals } from "@/lib/data";

const stageStyles = {
  Won: "bg-secondary-50 text-secondary-700",
  Proposal: "bg-primary-50 text-primary-700",
  Qualified: "bg-primary-50 text-primary-600",
};

export default function TopDeals() {
  return (
    <section
      aria-label="Top deals"
      className="rounded-xl border border-primary-100 bg-white p-5 xl:col-span-2"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-primary-950">Top deals</h2>
        <button className="text-xs font-medium text-primary-600 hover:text-primary-800">
          View all →
        </button>
      </div>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs text-primary-400">
              <th className="pb-2 font-medium">Company</th>
              <th className="pb-2 font-medium">Contact</th>
              <th className="pb-2 font-medium">Stage</th>
              <th className="pb-2 font-medium">Value</th>
              <th className="pb-2 font-medium">Probability</th>
              <th className="pb-2 font-medium text-right">Owner</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-50">
            {topDeals.map((deal) => (
              <tr key={deal.company} className="hover:bg-primary-50/40">
                <td className="py-2.5 font-medium text-primary-900">{deal.company}</td>
                <td className="py-2.5 text-primary-500">{deal.contact}</td>
                <td className="py-2.5">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${stageStyles[deal.stage]}`}
                  >
                    {deal.stage}
                  </span>
                </td>
                <td className="py-2.5 font-semibold text-primary-900">{deal.value}</td>
                <td className="py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 rounded-full bg-primary-50">
                      <div
                        className="h-1.5 rounded-full bg-secondary-500"
                        style={{ width: `${deal.probability}%` }}
                      />
                    </div>
                    <span className="text-xs text-primary-500">{deal.probability}%</span>
                  </div>
                </td>
                <td className="py-2.5 text-right">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-[10px] font-semibold text-white">
                    {deal.owner}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
