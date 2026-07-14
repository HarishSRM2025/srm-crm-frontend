"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import CalendarView from "@/components/events/CalendarView";
import { useEvents } from "@/context/EventsContext";
import { useAuth } from "@/context/AuthContext";

const BOTH_TABS_ROLES = ["HOD"];
const APPROVALS_ONLY_ROLES = ["HOI", "Manager"];

export default function EventsCalendarPage() {
  const { myRequests, approvalRequests } = useEvents();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("own"); // "own" | "approvals"

  const canSeeBothTabs = user && BOTH_TABS_ROLES.includes(user.role);
  const isApprovalsOnly = user && APPROVALS_ONLY_ROLES.includes(user.role);

  // HOD: whatever tab is selected via the switcher
  // HOI / Manager: locked to approvals
  // Everyone else (User, Admin, SuperAdmin): locked to own requests
  const currentTab = canSeeBothTabs ? activeTab : isApprovalsOnly ? "approvals" : "own";

  const displayedRequests = currentTab === "own" ? myRequests : approvalRequests;

  return (
    <div className="min-h-screen bg-transparent">
      <Sidebar />

      <div className="lg:pl-72">
        <Topbar
          title="Event Form Tracking"
          subtitle="Hall booking requests and their approval status."
          actionLabel="New event form"
          actionHref="/events/new"
        />

        <main className="space-y-6 p-4 lg:p-8">
          <div className="flex items-center justify-between border-b border-slate-200 pb-px">
            {/* View Switcher Tabs */}
            <div className="flex gap-6">
              <Link
                href="/events"
                className="border-b-2 border-transparent pb-3 text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors"
              >
                List view
              </Link>
              <Link
                href="/events/calendar"
                className="border-b-2 border-slate-800 pb-3 text-xs font-bold text-slate-800"
              >
                Calendar view
              </Link>
            </div>

            {/* Scope / Category Switcher (Only for roles with access to both views) */}
            {canSeeBothTabs && (
              <div className="flex gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200/50 mb-2">
                <button
                  onClick={() => setActiveTab("own")}
                  className={`rounded-xl px-4 py-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                    currentTab === "own"
                      ? "bg-white text-slate-800 shadow-sm border border-slate-200/20"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Your Requests
                </button>
                <button
                  onClick={() => setActiveTab("approvals")}
                  className={`rounded-xl px-4 py-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                    currentTab === "approvals"
                      ? "bg-white text-slate-800 shadow-sm border border-slate-200/20"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Approvals
                </button>
              </div>
            )}
          </div>

          <CalendarView requests={displayedRequests} />
        </main>
      </div>
    </div>
  );
}