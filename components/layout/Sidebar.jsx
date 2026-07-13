"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LuLayoutDashboard as LayoutDashboard,
  LuStethoscope as Stethoscope,
  LuCalendarDays as CalendarDays,
  LuSettings as Settings,
  LuGraduationCap as GraduationCap,
  LuChevronRight as ChevronRight,
  LuLogOut as LogOut,
  LuBell as Bell,
  LuFolderOpen as FolderOpen,
} from "react-icons/lu";
import { navItems } from "@/lib/data";
import { useAuth } from "@/context/AuthContext";

const icons = {
  LayoutDashboard,
  Stethoscope,
  CalendarDays,
  FolderOpen,
  Settings,
  GraduationCap,
};

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const initials = user?.email_id ? user.email_id.split("@")[0].slice(0, 2).toUpperCase() : "U";

  return (
    <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 border-r border-slate-200 bg-white text-slate-900 z-30">
      {/* Brand header */}
      <div className="flex items-center gap-3 px-6 h-[72px] border-b border-slate-200">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary-700 bg-gradient-to-br from-primary-500 to-primary-700 ring-1 ring-white/10">
          <GraduationCap size={20} strokeWidth={2.2} className="text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-[14px] font-bold tracking-tight text-slate-900">
            SRM Medical
          </span>
          <span className="text-[10px] font-medium text-slate-500 tracking-wide">
            Admin Portal
          </span>
        </div>
      </div>

      {/* Navigation section */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
          Main Menu
        </p>

        {navItems.map((item) => {
          const Icon = icons[item.icon];
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : item.href !== "#" && pathname.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-all duration-200 ${
                isActive
                  ? "border border-primary-200 bg-gradient-to-r from-primary-600/15 to-primary-600/5 text-primary-700"
                  : "border border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-primary-500" />
              )}
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200 ${
                  isActive
                    ? "border border-primary-200 bg-primary-500/10 text-primary-600"
                    : "border border-slate-200 bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-primary-600"
                }`}
              >
                <Icon size={16} />
              </div>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-4 pb-4 space-y-3">
        {/* Quick actions row */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-1">
            <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors">
              <Bell size={15} />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-secondary-500 ring-1 ring-white" />
            </button>
          </div>
          <button onClick={logout} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-red-500 transition-colors" title="Sign out">
            <LogOut size={15} />
          </button>
        </div>

        {/* Separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        {/* User profile card */}
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-200 p-3 hover:bg-white hover:border-slate-300 transition-all duration-200 cursor-pointer group">
          <div className="relative">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary-700 bg-gradient-to-br from-primary-500 to-primary-700 text-[13px] font-bold text-white">
              {initials}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-secondary-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-slate-800 group-hover:text-slate-950 transition-colors">
              {user?.email_id || "Guest"}
            </p>
            <p className="truncate text-[10px] font-medium text-slate-500 mt-0.5">
              {user?.role || "Viewer"}
            </p>
          </div>
          <ChevronRight
            size={14}
            className="text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all duration-200"
          />
        </div>
      </div>
    </aside>
  );
}
