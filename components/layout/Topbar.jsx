"use client";

import Link from "next/link";
import {
  LuSearch as Search,
  LuBell as Bell,
  LuPlus as Plus,
  LuMenu as Menu,
  LuCircleHelp as HelpCircle,
} from "react-icons/lu";

export default function Topbar({
  title = "Dashboard",
  subtitle = "",
  actionLabel = "",
  actionHref = "#",
}) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-xl lg:px-8">
      <button className="lg:hidden text-slate-600 hover:text-slate-900">
        <Menu size={22} />
      </button>

      <div>
        <h1 className="text-sm font-bold text-slate-800">{title}</h1>
        {subtitle && <p className="text-[10px] font-semibold text-slate-400 hidden sm:block mt-0.5">{subtitle}</p>}
      </div>

      {/* Floating Center Search Bar */}
      <div className="hidden md:flex flex-1 justify-center max-w-xl mx-auto">
        <div className="relative w-full max-w-md">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search doctors, events, logs…"
            className="w-full rounded-full border border-slate-200/80 bg-slate-50/80 py-1.5 pl-9 pr-12 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
            ⌘ K
          </span>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors">
          <HelpCircle size={18} />
        </button>

        <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors">
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-secondary-600 ring-2 ring-white" />
        </button>

        {actionLabel && (
          <Link
            href={actionHref}
            className="hidden sm:flex items-center gap-1.5 rounded-full border border-slate-900 bg-slate-900 px-4 py-1.5 text-xs font-bold text-white hover:border-slate-700 hover:bg-slate-800 transition-all"
          >
            <Plus size={14} />
            {actionLabel}
          </Link>
        )}

        <button className="flex h-8 w-8 items-center justify-center rounded-xl border border-primary-700 bg-primary-600 text-xs font-bold text-white lg:hidden">
          AK
        </button>
      </div>
    </header>
  );
}
