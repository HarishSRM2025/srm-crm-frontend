"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { STATUS } from "@/lib/events-data";
import { createEvent, fetchEvents, updateEvent } from "@/lib/events-api";
import { useAuth } from "@/context/AuthContext";

const EventsContext = createContext(null);

export function EventsProvider({ children }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setRequests([]);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    fetchEvents()
      .then((events) => {
        if (!active) return;
        setRequests(events);
        setError("");
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || "Unable to load events");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user]);

  const myRequests = useMemo(
    () => requests.filter((r) => r.category === "own" || r.userId === user?.id),
    [requests, user]
  );

  const approvalRequests = useMemo(
    () => requests.filter((r) => r.category === "approval_pending" || r.category === "approval_acted"),
    [requests]
  );

  const addRequest = async (form) => {
    const newRequest = await createEvent(form);
    setRequests((prev) => [newRequest, ...prev.filter((request) => request.id !== newRequest.id)]);
    return newRequest.id;
  };

  const decideApproval = async (id, stage, status, { by, note }) => {
    const r = requests.find((req) => req.id === id);
    if (!r) return;

    const updatedApprovals = {
      ...r.approvals,
      [stage]: {
        status,
        by: by || "You",
        date: new Date().toISOString().slice(0, 10),
        note: note || "",
      },
    };

    try {
      const response = await updateEvent(id, { approvals: updatedApprovals });
      setRequests((prev) =>
        prev.map((req) => (req.id === id ? response : req))
      );
    } catch (err) {
      console.error("Failed to update approval", err);
      throw err;
    }
  };

  const updateOfficeUse = async (id, officeUse) => {
    const r = requests.find((req) => req.id === id);
    if (!r) return;

    const updatedOfficeUse = {
      ...r.officeUse,
      ...officeUse,
    };

    try {
      const response = await updateEvent(id, { officeUse: updatedOfficeUse });
      setRequests((prev) =>
        prev.map((req) => (req.id === id ? response : req))
      );
    } catch (err) {
      console.error("Failed to update office use", err);
      throw err;
    }
  };

  const getRequest = (id) => requests.find((r) => r.id === id);

  const value = useMemo(
    () => ({
      requests,
      myRequests,
      approvalRequests,
      loading,
      error,
      addRequest,
      decideApproval,
      updateOfficeUse,
      getRequest,
    }),
    [requests, myRequests, approvalRequests, loading, error]
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
