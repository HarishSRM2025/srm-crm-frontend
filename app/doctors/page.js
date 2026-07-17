"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  LuSearch as Search,
  LuFilter as Filter,
  LuPlus as Plus,
  LuPencil as Pencil,
  LuTrash2 as Trash,
  LuBookOpen as BookOpen,
  LuStethoscope as Stethoscope,
  LuClock as Clock,
  LuMail as Mail,
  LuPhone as Phone,
  LuCircleCheck as CircleCheck,
  LuCircleAlert as CircleAlert,
  LuFileText as FileText,
  LuEllipsis as MoreHorizontal,
} from "react-icons/lu";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { useDoctors, DEPARTMENTS, STATUSES } from "@/context/DoctorsContext";

export const dynamic = "force-dynamic";

const PASTEL_PALETTES = [
  {
    bg: "bg-[#e0ebff]/65",
    border: "border-[#cbdfff]",
    text: "text-[#2e62c7]",
    pill: "bg-[#cbdfff]/50 text-[#2e62c7]",
    dotActive: "bg-[#2e62c7]",
    dotInactive: "bg-[#cbdfff]/60",
    nameColor: "text-[#1b3e85]",
  },
  {
    bg: "bg-[#f3e8ff]/65",
    border: "border-[#e5cfff]",
    text: "text-[#6d28d9]",
    pill: "bg-[#e5cfff]/50 text-[#6d28d9]",
    dotActive: "bg-[#6d28d9]",
    dotInactive: "bg-[#e5cfff]/60",
    nameColor: "text-[#4710a3]",
  },
  {
    bg: "bg-[#ffe8f0]/65",
    border: "border-[#ffd1e3]",
    text: "text-[#db2777]",
    pill: "bg-[#ffd1e3]/50 text-[#db2777]",
    dotActive: "bg-[#db2777]",
    dotInactive: "bg-[#ffd1e3]/60",
    nameColor: "text-[#831447]",
  },
  {
    bg: "bg-[#fff0e0]/65",
    border: "border-[#ffe0c2]",
    text: "text-[#d97706]",
    pill: "bg-[#ffe0c2]/50 text-[#d97706]",
    dotActive: "bg-[#d97706]",
    dotInactive: "bg-[#ffe0c2]/60",
    nameColor: "text-[#78350f]",
  },
  {
    bg: "bg-[#e6f9f5]/65",
    border: "border-[#ccf2ea]",
    text: "text-[#0d9488]",
    pill: "bg-[#ccf2ea]/50 text-[#0d9488]",
    dotActive: "bg-[#0d9488]",
    dotInactive: "bg-[#ccf2ea]/60",
    nameColor: "text-[#115e59]",
  },
];

const statusLabels = {
  [STATUSES.PUBLISHED]: "Published",
  [STATUSES.DRAFT]: "Draft",
  [STATUSES.REVIEW]: "Review Required",
};

export default function DoctorsDirectoryPage() {
  const { doctors, deleteDoctor } = useDoctors();
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const filtered = useMemo(() => {
    let list = doctors;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.department.toLowerCase().includes(q) ||
          d.designation.toLowerCase().includes(q) ||
          d.id.toLowerCase().includes(q)
      );
    }

    if (filterDept !== "all") {
      list = list.filter((d) => d.department === filterDept);
    }

    if (filterStatus !== "all") {
      list = list.filter((d) => d.status === filterStatus);
    }

    list = [...list].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "department") return a.department.localeCompare(b.department);
      if (sortBy === "experience") return b.yearsOfExperience - a.yearsOfExperience;
      if (sortBy === "publications") return b.publications.length - a.publications.length;
      return 0;
    });

    return list;
  }, [doctors, search, filterDept, filterStatus, sortBy]);

  const deptCounts = useMemo(() => {
    const counts = {};
    doctors.forEach((d) => {
      counts[d.department] = (counts[d.department] || 0) + 1;
    });
    return counts;
  }, [doctors]);

  return (
    <div className="min-h-screen bg-transparent">
      <Sidebar />

      <div className="lg:pl-72">
        <Topbar
          title="Doctor Profiles"
          subtitle={`${doctors.length} doctors across ${Object.keys(deptCounts).length} departments`}
          actionLabel="Create profile"
          actionHref="/doctors/new"
          allowedActionRoles={["Admin", "SuperAdmin"]}
        />

        <main className="space-y-6 p-4 lg:p-8">
          {/* Board control subheader */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Faculty Board</h2>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Today is Saturday, Jul 9th, 2026</p>
            </div>

            {/* Filter toolbar */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search input */}
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by name…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="rounded-full border border-slate-100 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>

              {/* Department filter */}
              <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 hover:border-slate-300 transition-colors">
                <Filter size={12} className="text-slate-400" />
                <select
                  value={filterDept}
                  onChange={(e) => setFilterDept(e.target.value)}
                  className="text-[10px] font-bold text-slate-600 bg-transparent outline-none cursor-pointer"
                >
                  <option value="all">All Departments</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status filter */}
              <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 hover:border-slate-300 transition-colors">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="text-[10px] font-bold text-slate-600 bg-transparent outline-none cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value={STATUSES.PUBLISHED}>Published</option>
                  <option value={STATUSES.DRAFT}>Draft</option>
                  <option value={STATUSES.REVIEW}>Review Required</option>
                </select>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 hover:border-slate-300 transition-colors">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-[10px] font-bold text-slate-600 bg-transparent outline-none cursor-pointer"
                >
                  <option value="name">Sort: Name</option>
                  <option value="department">Sort: Department</option>
                  <option value="experience">Sort: Experience</option>
                  <option value="publications">Sort: Publications</option>
                </select>
              </div>
            </div>
          </div>

          {/* Doctor Cards Grid matching Pastel Board style */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filtered.map((doc, idx) => {
              const palette = PASTEL_PALETTES[idx % PASTEL_PALETTES.length];

              const initials = doc.name
                .split(" ")
                .filter((_, i, arr) => i === 0 || i === arr.length - 1)
                .map((n) => n[0])
                .join("");

              return (
                <div
                  key={doc.id}
                  className={`rounded-2xl border p-4.5 flex flex-col justify-between transition-all hover:border-slate-400 ${palette.bg} ${palette.border}`}
                >
                  <div>
                    {/* Tags block */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1">
                        <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold tracking-wide uppercase ${palette.pill}`}>
                          #{doc.department}
                        </span>
                        <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold tracking-wide uppercase ${palette.pill}`}>
                          #{doc.id.split("-")[1]}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-bold text-slate-400 capitalize bg-white/70 px-2 py-0.5 rounded-full border border-slate-200">
                          {statusLabels[doc.status]}
                        </span>
                        <button className="text-slate-400 hover:text-slate-700">
                          <MoreHorizontal size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Header info */}
                    <div className="mt-3 flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-xs font-bold border border-slate-200 text-slate-700">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <h3 className={`text-xs font-bold leading-snug truncate ${palette.nameColor}`}>
                          {doc.name}
                        </h3>
                        <p className="text-[10px] font-semibold text-slate-400 mt-0.5 truncate">
                          {doc.designation}
                        </p>
                      </div>
                    </div>
                    {/* Bio */}
                    <p className="mt-3 text-[10px] font-semibold leading-relaxed text-slate-500 line-clamp-3">
                      {doc.bio || "No profile bio updated yet. Open the modification portal to supply full details."}
                    </p>
                  </div>

                  {/* Footer & Actions */}
                  <div className="mt-4 flex items-center justify-between border-t border-slate-300/60 pt-3">
                    <div className="flex items-center gap-3 text-[9px] text-slate-400 font-bold">
                      <span className="flex items-center gap-0.5"><Clock size={10} /> {doc.yearsOfExperience}y</span>
                      <span className="flex items-center gap-0.5"><BookOpen size={10} /> {doc.publications.length} pub</span>
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => {
                          if (confirm(`Delete ${doc.name}?`)) deleteDoctor(doc.id);
                        }}
                        className="rounded-lg border border-rose-200 bg-white/70 p-1.5 text-xs text-rose-500 hover:bg-rose-50 transition-colors"
                        title="Delete profile"
                      >
                        <Trash size={11} />
                      </button>
                      <Link
                        href={`/doctors/${doc.id}`}
                        className="flex items-center gap-1 rounded-lg border border-slate-900 bg-slate-900 px-3 py-1.5 text-[10px] font-bold text-white hover:border-slate-700 hover:bg-slate-800 transition-colors"
                      >
                        <Pencil size={10} />
                        Modify
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <Stethoscope size={28} className="mx-auto text-slate-300 mb-3" />
              <p className="text-xs font-bold text-slate-800 font-sans">No matching profiles found</p>
              <p className="mt-1 text-[10px] text-slate-400 font-medium">Try broadening your search inputs.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
