"use client";

/**
 * TemplatesContext
 * ---------------------------------------------------------------
 * Mirrors the shape/pattern used by DoctorsContext & EventsContext:
 *   - a STATUSES map you can import elsewhere
 *   - a Provider that persists to localStorage
 *   - a useTemplates() hook exposing { templates, ...CRUD, STATUSES }
 *
 * Wire it up in your root layout alongside your other providers, e.g.:
 *
 *   <DoctorsProvider>
 *     <EventsProvider>
 *       <TemplatesProvider>
 *         <UsersProvider>{children}</UsersProvider>
 *       </TemplatesProvider>
 *     </EventsProvider>
 *   </DoctorsProvider>
 *
 * Adjust SEED_TEMPLATES / fields (name, category, etc.) to match
 * whatever a "template" actually represents in your app.
 * ---------------------------------------------------------------
 */

import { createContext, useContext, useEffect, useState } from "react";

export const STATUSES = {
  LIVE: "Live",
  DRAFT: "Draft",
  ARCHIVED: "Archived",
};

const STORAGE_KEY = "srm_crm_templates";

const SEED_TEMPLATES = [
  {
    id: "tpl-1",
    name: "Hall Booking Request",
    category: "Events",
    status: STATUSES.LIVE,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tpl-2",
    name: "Doctor Profile Intake",
    category: "Doctors",
    status: STATUSES.LIVE,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tpl-3",
    name: "Event Feedback Form",
    category: "Events",
    status: STATUSES.DRAFT,
    updatedAt: new Date().toISOString(),
  },
];

function readStoredTemplates() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const TemplatesContext = createContext(undefined);

export function TemplatesProvider({ children }) {
  const [templates, setTemplates] = useState(SEED_TEMPLATES);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount (client only, avoids SSR mismatch).
  useEffect(() => {
    const stored = readStoredTemplates();
    if (stored) setTemplates(stored);
    setHydrated(true);
  }, []);

  // Persist on every change, once hydrated.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
    } catch {
      // ignore storage errors (e.g. private browsing / quota)
    }
  }, [templates, hydrated]);

  const addTemplate = (template) => {
    setTemplates((prev) => [
      {
        id: `tpl-${Date.now()}`,
        status: STATUSES.DRAFT,
        updatedAt: new Date().toISOString(),
        ...template,
      },
      ...prev,
    ]);
  };

  const updateTemplate = (id, updates) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t))
    );
  };

  const deleteTemplate = (id) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const setStatus = (id, status) => updateTemplate(id, { status });

  const value = {
    templates,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    setStatus,
    STATUSES,
  };

  return <TemplatesContext.Provider value={value}>{children}</TemplatesContext.Provider>;
}

export function useTemplates() {
  const ctx = useContext(TemplatesContext);
  if (ctx === undefined) {
    throw new Error("useTemplates must be used within a <TemplatesProvider>");
  }
  return ctx;
}
