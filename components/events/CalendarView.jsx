"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  LuChevronLeft as ChevronLeft,
  LuChevronRight as ChevronRight,
  LuFilter as Filter,
  LuMapPin as MapPin,
  LuUser as User,
  LuClock as Clock,
  LuArrowRight as ArrowRight,
  LuCircleCheck as CheckCircle2,
  LuCircleX as XCircle,
  LuFileText as FileText,
} from "react-icons/lu";
import { useEvents, overallStatus } from "@/context/EventsContext";
import { STATUS } from "@/lib/events-data";
import StatusBadge from "@/components/events/StatusBadge";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function parseEventDates(dateStr) {
  if (!dateStr) return [];
  const cleanStr = dateStr.replace(/\s+/g, " ").trim();

  const rangeParts = cleanStr.split(/–|-/);
  if (rangeParts.length === 2) {
    const start = parseSingleDate(rangeParts[0].trim());
    const end = parseSingleDate(rangeParts[1].trim());
    if (start && end) {
      const dates = [];
      let current = new Date(start);
      const last = new Date(end);
      while (current <= last) {
        dates.push(current.toISOString().slice(0, 10));
        current.setDate(current.getDate() + 1);
      }
      return dates;
    }
  }

  const single = parseSingleDate(cleanStr);
  return single ? [single] : [];
}

function parseSingleDate(str) {
  const timestamp = Date.parse(str);
  if (!isNaN(timestamp)) {
    return new Date(timestamp).toISOString().slice(0, 10);
  }

  const monthsMap = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
    january: 0, february: 1, march: 2, april: 3, june: 5, july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
  };

  const parts = str.toLowerCase().split(" ");
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const monthName = parts[1];
    const year = parseInt(parts[2], 10);
    const month = monthsMap[monthName];
    if (!isNaN(day) && month !== undefined && !isNaN(year)) {
      return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }
  }

  return null;
}

export default function CalendarView({ requests: propRequests }) {
  const { requests: contextRequests } = useEvents();
  const requests = propRequests !== undefined ? propRequests : contextRequests;

  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(6); // Default: July 2026
  const [selectedHall, setSelectedHall] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedEventId, setSelectedEventId] = useState(null);

  const allHalls = useMemo(() => {
    const halls = new Set();
    requests.forEach((r) => {
      const h = r.officeUse?.allotment;
      if (h) {
        if (h.includes(" + ")) {
          h.split(" + ").forEach((sub) => halls.add(sub.trim()));
        } else {
          halls.add(h.trim());
        }
      }
    });
    return Array.from(halls);
  }, [requests]);

  const eventDays = useMemo(() => {
    const daysMap = {};

    requests.forEach((r) => {
      const dates = parseEventDates(r.form.dates);
      const status = overallStatus(r.approvals);

      if (selectedStatus !== "all" && status !== selectedStatus) return;
      if (selectedHall !== "all") {
        const allotment = r.officeUse?.allotment?.toLowerCase() || "";
        if (!allotment.includes(selectedHall.toLowerCase())) return;
      }

      dates.forEach((dateStr) => {
        if (!daysMap[dateStr]) {
          daysMap[dateStr] = [];
        }
        daysMap[dateStr].push({ ...r, status });
      });
    });

    return daysMap;
  }, [requests, selectedHall, selectedStatus]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const grid = [];

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      grid.push({ day, isCurrentMonth: false, dateStr });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      grid.push({ day, isCurrentMonth: true, dateStr });
    }

    const totalSlots = 42;
    const nextDaysNeeded = totalSlots - grid.length;
    for (let day = 1; day <= nextDaysNeeded; day++) {
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      grid.push({ day, isCurrentMonth: false, dateStr });
    }

    return grid;
  }, [currentYear, currentMonth]);

  const selectedEvent = useMemo(() => {
    return requests.find((r) => r.id === selectedEventId);
  }, [requests, selectedEventId]);

  const eventStyles = {
    [STATUS.APPROVED]: {
      badge: "bg-[#e6f9f5] text-[#0d9488] border-[#ccf2ea] hover:bg-[#ccf2ea]/50",
      dot: "bg-[#0d9488]",
    },
    [STATUS.PENDING]: {
      badge: "bg-[#e0ebff] text-[#2e62c7] border-[#cbdfff] hover:bg-[#cbdfff]/50",
      dot: "bg-[#2e62c7]",
    },
    [STATUS.REJECTED]: {
      badge: "bg-[#ffe8f0] text-[#db2777] border-[#ffd1e3] hover:bg-[#ffd1e3]/50",
      dot: "bg-[#db2777]",
    },
  };

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
      {/* Calendar Grid */}
      <div className="space-y-4 xl:col-span-3">
        {/* Navigation & Filters bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevMonth}
              className="rounded-xl border border-slate-100 p-2 text-slate-600 hover:bg-slate-50 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft size={14} />
            </button>
            <h2 className="min-w-[120px] text-center text-xs font-bold text-slate-800">
              {MONTHS[currentMonth]} {currentYear}
            </h2>
            <button
              onClick={handleNextMonth}
              className="rounded-xl border border-slate-100 p-2 text-slate-600 hover:bg-slate-50 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Allotment Hall Filter */}
            <div className="flex items-center gap-1.5 rounded-full border border-slate-100 px-3 py-1.5 bg-white">
              <Filter size={12} className="text-slate-400" />
              <select
                value={selectedHall}
                onChange={(e) => setSelectedHall(e.target.value)}
                className="text-[10px] font-bold text-slate-600 bg-transparent outline-none cursor-pointer"
              >
                <option value="all">All Venue Bookings</option>
                {allHalls.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            {/* Approval Status Filter */}
            <div className="flex items-center gap-1.5 rounded-full border border-slate-100 px-3 py-1.5 bg-white">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="text-[10px] font-bold text-slate-600 bg-transparent outline-none cursor-pointer"
              >
                <option value="all">All Approval States</option>
                <option value={STATUS.APPROVED}>Approved</option>
                <option value={STATUS.PENDING}>Pending</option>
                <option value={STATUS.REJECTED}>Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid Container */}
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
          <div className="grid grid-cols-7 border-b border-slate-50 bg-slate-50/50 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day} className="py-3">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 grid-rows-6 divide-x divide-y divide-slate-100 border-t border-slate-100 bg-slate-50/10">
            {calendarDays.map(({ day, isCurrentMonth, dateStr }) => {
              const dayEvents = eventDays[dateStr] || [];
              return (
                <div
                  key={dateStr}
                  className={`min-h-[110px] p-2 flex flex-col justify-between transition-colors ${
                    isCurrentMonth ? "bg-white" : "bg-slate-50/20 text-slate-300"
                  }`}
                >
                  <div className="text-right">
                    <span
                      className={`text-[10px] font-bold ${
                        isCurrentMonth ? "text-slate-700" : "text-slate-300"
                      }`}
                    >
                      {day}
                    </span>
                  </div>

                  <div className="mt-1 flex-1 flex flex-col gap-1 overflow-y-auto max-h-[80px] scrollbar-none">
                    {dayEvents.map((evt) => (
                      <button
                        key={evt.id}
                        onClick={() => setSelectedEventId(evt.id)}
                        className={`w-full text-left rounded-lg px-2 py-1.5 border text-[9px] font-bold transition-all truncate block ${
                          selectedEventId === evt.id ? "ring-2 ring-primary-500" : ""
                        } ${eventStyles[evt.status].badge}`}
                        title={`${evt.form.purpose} (${evt.officeUse?.allotment || "Unassigned"})`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span className={`h-2 w-2 shrink-0 rounded-full ${eventStyles[evt.status].dot}`} />
                          <span className="truncate">{evt.form.purpose || "Event Request"}</span>
                        </span>
                        {evt.officeUse?.allotment && (
                          <span className="block mt-0.5 text-[8px] opacity-75 font-semibold truncate ml-3.5">
                            📍 {evt.officeUse.allotment}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Details Side-Drawer Card */}
      <div className="xl:col-span-1">
        {selectedEvent ? (
          <div className="sticky top-20 rounded-2xl border border-slate-100 bg-white p-5 space-y-4">
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 uppercase tracking-wide">
                  {selectedEvent.id}
                </span>
                <h3 className="text-xs font-bold text-slate-800 mt-2 leading-snug">
                  {selectedEvent.form.purpose || "Event Request"}
                </h3>
              </div>
              <StatusBadge status={overallStatus(selectedEvent.approvals)} />
            </div>

            <div className="space-y-3.5 text-[10px] font-semibold text-slate-600">
              <div className="flex items-start gap-2.5">
                <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-slate-400 uppercase text-[9px] tracking-wide">Allotted Location</p>
                  <p className="text-slate-700 font-bold mt-1">
                    {selectedEvent.officeUse?.allotment || "Pending Allotment"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <User size={14} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-slate-400 uppercase text-[9px] tracking-wide">Applicant</p>
                  <p className="text-slate-700 font-bold mt-1">{selectedEvent.form.applicantName}</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">{selectedEvent.form.institution}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock size={14} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-slate-400 uppercase text-[9px] tracking-wide">Date & Session</p>
                  <p className="text-slate-700 font-bold mt-1">{selectedEvent.form.dates}</p>
                  <p className="text-[9px] text-slate-400 capitalize mt-0.5">
                    Session: {selectedEvent.form.session?.replace("-", " ")}
                  </p>
                </div>
              </div>
            </div>

            {/* Approval Progress Widget */}
            <div className="rounded-xl bg-slate-50/50 border border-slate-100 p-3.5 space-y-2.5">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                Approval Flow
              </p>
              <div className="space-y-2">
                {Object.entries(selectedEvent.approvals).map(([stage, detail]) => (
                  <div key={stage} className="flex items-center justify-between text-[10px] font-semibold text-slate-600">
                    <span className="capitalize font-bold text-slate-500">
                      {stage === "hoi" ? "HOI" : stage === "hod" ? "HOD" : stage}
                    </span>
                    <span className="flex items-center gap-1.5 font-bold">
                      {detail.status === STATUS.APPROVED ? (
                        <CheckCircle2 size={12} className="text-[#0d9488]" />
                      ) : detail.status === STATUS.REJECTED ? (
                        <XCircle size={12} className="text-[#db2777]" />
                      ) : (
                        <Clock size={12} className="text-slate-400" />
                      )}
                      <span
                        className={
                          detail.status === STATUS.APPROVED
                            ? "text-[#0d9488]"
                            : detail.status === STATUS.REJECTED
                            ? "text-[#db2777]"
                            : "text-slate-400"
                        }
                      >
                        {detail.status}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href={`/events/${selectedEvent.id}`}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
            >
              Review / Action
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-400">
            <FileText size={20} className="mx-auto text-slate-300 mb-2" />
            <p className="text-[10px] font-bold">Select a booking cell to inspect details.</p>
          </div>
        )}
      </div>
    </div>
  );
}
