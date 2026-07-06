"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { revenueSeries } from "@/lib/data";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-primary-100 bg-white px-3 py-2 text-xs">
      <p className="font-semibold text-primary-900 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="flex items-center gap-1.5 text-primary-600">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: p.color }}
          />
          {p.name}: <span className="font-medium text-primary-900">${p.value}k</span>
        </p>
      ))}
    </div>
  );
}

export default function RevenueChart() {
  return (
    <section
      aria-label="Revenue over time"
      className="rounded-xl border border-primary-100 bg-white p-5 xl:col-span-2"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-primary-950">Revenue vs target</h2>
          <p className="text-xs text-primary-400">Closed-won revenue by month, in thousands</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-primary-500">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary-600" /> Revenue
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-secondary-500" /> Target
          </span>
        </div>
      </div>

      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueSeries} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#137fc1" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#137fc1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="targetFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#53a766" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#53a766" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#eef2f6" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#0b4d7a" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#0b4d7a" }}
              tickFormatter={(v) => `$${v}k`}
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="target"
              name="Target"
              stroke="#53a766"
              strokeWidth={2}
              fill="url(#targetFill)"
            />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#137fc1"
              strokeWidth={2.5}
              fill="url(#revenueFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
