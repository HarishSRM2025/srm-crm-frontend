"use client";

import { LuPhone as Phone, LuMail as Mail, LuTrophy as Trophy, LuStickyNote as StickyNote, LuCalendarClock as CalendarClock } from "react-icons/lu";
import { recentActivity } from "@/lib/data";

const icons = {
  call: { Icon: Phone, cls: "bg-primary-50 text-primary-600" },
  email: { Icon: Mail, cls: "bg-primary-50 text-primary-600" },
  deal: { Icon: Trophy, cls: "bg-secondary-50 text-secondary-700" },
  note: { Icon: StickyNote, cls: "bg-primary-50 text-primary-600" },
  meeting: { Icon: CalendarClock, cls: "bg-secondary-50 text-secondary-700" },
};

export default function RecentActivity() {
  return (
    <section
      aria-label="Recent activity"
      className="rounded-xl border border-primary-100 bg-white p-5"
    >
      <h2 className="text-sm font-semibold text-primary-950">Recent activity</h2>

      <ol className="mt-4 space-y-4">
        {recentActivity.map((item, idx) => {
          const { Icon, cls } = icons[item.type];
          return (
            <li key={idx} className="flex gap-3">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${cls}`}>
                <Icon size={15} />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-primary-900">
                  <span className="font-medium">{item.who}</span>{" "}
                  <span className="text-primary-500">{item.detail}</span>
                </p>
                <p className="mt-0.5 text-xs text-primary-400">{item.time}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
