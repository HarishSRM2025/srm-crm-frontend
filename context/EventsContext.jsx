"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { seedRequests, STATUS } from "@/lib/events-data";

const EventsContext = createContext(null);

let idCounter = 1043;

export function EventsProvider({ children }) {
  const [requests, setRequests] = useState(seedRequests());

  const addRequest = (form) => {
    const id = `EVT-${idCounter++}`;
    const newRequest = {
      id,
      submittedOn: new Date().toISOString().slice(0, 10),
      form,
      approvals: {
        hod: { status: STATUS.PENDING, by: "", date: "", note: "" },
        hoi: { status: STATUS.PENDING, by: "", date: "", note: "" },
        manager: { status: STATUS.PENDING, by: "", date: "", note: "" },
      },
      officeUse: {
        availability: "",
        allotment: "",
        allotmentItems: [],
        alternateDate: "",
      },
    };
    setRequests((prev) => [newRequest, ...prev]);
    return id;
  };

  const decideApproval = (id, stage, status, { by, note }) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              approvals: {
                ...r.approvals,
                [stage]: {
                  status,
                  by: by || "You",
                  date: new Date().toISOString().slice(0, 10),
                  note: note || "",
                },
              },
            }
          : r
      )
    );
  };

  const updateOfficeUse = (id, officeUse) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, officeUse: { ...r.officeUse, ...officeUse } } : r))
    );
  };

  const getRequest = (id) => requests.find((r) => r.id === id);

  const value = useMemo(
    () => ({ requests, addRequest, decideApproval, updateOfficeUse, getRequest }),
    [requests]
  );

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error("useEvents must be used within EventsProvider");
  return ctx;
}

// Derives an overall status label for a request from its 3 approval stages.
export function overallStatus(approvals) {
  const stages = Object.values(approvals);
  if (stages.some((s) => s.status === STATUS.REJECTED)) return STATUS.REJECTED;
  if (stages.every((s) => s.status === STATUS.APPROVED)) return STATUS.APPROVED;
  return STATUS.PENDING;
}
