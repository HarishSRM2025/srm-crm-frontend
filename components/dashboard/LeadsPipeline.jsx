"use client";

import { pipelineStages } from "@/lib/data";

const stageHeaderStyles = {
  New: "bg-primary-50 text-primary-700",
  Qualified: "bg-primary-100 text-primary-800",
  Proposal: "bg-secondary-50 text-secondary-700",
  Won: "bg-secondary-100 text-secondary-800",
};

export default function LeadsPipeline() {
  return (
    <section
      aria-label="Leads pipeline"
      className="rounded-xl border border-primary-100 bg-white p-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-primary-950">Pipeline</h2>
          <p className="text-xs text-primary-400">10 active deals across 4 stages</p>
        </div>
        <button className="text-xs font-medium text-primary-600 hover:text-primary-800">
          View board →
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {pipelineStages.map((stage) => (
          <div key={stage.name} className="min-w-0">
            <div
              className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-xs font-semibold ${stageHeaderStyles[stage.name]}`}
            >
              <span>{stage.name}</span>
              <span>{stage.deals.length}</span>
            </div>

            <div className="mt-2 space-y-2">
              {stage.deals.map((deal) => (
                <div
                  key={deal.company}
                  className="rounded-lg border border-primary-50 bg-primary-50/40 p-3 hover:border-primary-200 transition-colors"
                >
                  <p className="truncate text-sm font-medium text-primary-900">
                    {deal.company}
                  </p>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-xs font-semibold text-secondary-700">
                      {deal.value}
                    </span>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-semibold text-white">
                      {deal.owner}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
