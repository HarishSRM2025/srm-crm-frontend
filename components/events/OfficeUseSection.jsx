"use client";

import { useState } from "react";
import { LuSave as Save } from "react-icons/lu";

const items = ["Mike sets", "Whiteboard", "Other items"];

export default function OfficeUseSection({ officeUse, onSave }) {
  const [local, setLocal] = useState({
    availability: officeUse.availability || "",
    allotment: officeUse.allotment || "",
    allotmentItems: officeUse.allotmentItems || [],
    alternateDate: officeUse.alternateDate || "",
  });

  const toggleItem = (item) => {
    setLocal((prev) => ({
      ...prev,
      allotmentItems: prev.allotmentItems.includes(item)
        ? prev.allotmentItems.filter((i) => i !== item)
        : [...prev.allotmentItems, item],
    }));
  };

  return (
    <section
      aria-label="For office use"
      className="rounded-xl border border-primary-100 bg-primary-50/30 p-5"
    >
      <h2 className="text-sm font-semibold text-primary-950">For office use</h2>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-medium text-primary-600">1. Availability / prior commitment</span>
          <select
            className="mt-1.5 w-full rounded-lg border border-primary-100 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            value={local.availability}
            onChange={(e) => setLocal((p) => ({ ...p, availability: e.target.value }))}
          >
            <option value="">Select…</option>
            <option value="Available">Available</option>
            <option value="Not available">Not available</option>
            <option value="Tentative">Tentative</option>
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-medium text-primary-600">2. Allotment for (hall / venue)</span>
          <input
            className="mt-1.5 w-full rounded-lg border border-primary-100 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            placeholder="e.g. Main Auditorium"
            value={local.allotment}
            onChange={(e) => setLocal((p) => ({ ...p, allotment: e.target.value }))}
          />
        </label>

        <div className="sm:col-span-2">
          <span className="text-xs font-medium text-primary-600">Items allotted</span>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {items.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => toggleItem(item)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  local.allotmentItems.includes(item)
                    ? "bg-secondary-600 text-white"
                    : "bg-white border border-primary-100 text-primary-500 hover:border-primary-300"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <label className="block sm:col-span-2">
          <span className="text-xs font-medium text-primary-600">
            3. Alternate date for the programme (if hall not available)
          </span>
          <input
            className="mt-1.5 w-full rounded-lg border border-primary-100 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            placeholder="e.g. 12 Jul 2026"
            value={local.alternateDate}
            onChange={(e) => setLocal((p) => ({ ...p, alternateDate: e.target.value }))}
          />
        </label>
      </div>

      <button
        onClick={() => onSave(local)}
        className="mt-4 flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-xs font-semibold text-white hover:bg-primary-700"
      >
        <Save size={14} />
        Save office notes
      </button>
    </section>
  );
}
