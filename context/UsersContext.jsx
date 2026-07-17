"use client";

/**
 * UsersContext
 * ---------------------------------------------------------------
 * Mirrors the shape/pattern used by DoctorsContext, EventsContext &
 * TemplatesContext:
 *   - a ROLES map you can import elsewhere (kept in sync with the
 *     ROLES map in the dashboard — Admin / SuperAdmin / User / HOD / HOI / Manager)
 *   - a Provider that persists to localStorage
 *   - a useUsers() hook exposing { users, ...CRUD, ROLES }
 *
 * NOTE: this is a local/mock user directory (separate from the
 * logged-in session stored in "srm_crm_user"). If you already have a
 * real users API/table, swap the body of this file to fetch from it
 * and keep the same useUsers() return shape so the dashboard doesn't
 * need to change.
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
 * ---------------------------------------------------------------
 */

import { createContext, useContext, useEffect, useState } from "react";

export const ROLES = {
  ADMIN: "Admin",
  SUPER_ADMIN: "SuperAdmin",
  USER: "User",
  HOD: "HOD",
  HOI: "HOI",
  MANAGER: "Manager",
};

const STORAGE_KEY = "srm_crm_users";

const SEED_USERS = [
  { id: "usr-1", name: "System Admin", email: "admin@srm.edu.in", role: ROLES.ADMIN },
  { id: "usr-2", name: "Super Admin", email: "superadmin@srm.edu.in", role: ROLES.SUPER_ADMIN },
  { id: "usr-3", name: "Dept HOD", email: "hod@srm.edu.in", role: ROLES.HOD },
  { id: "usr-4", name: "Institution Head", email: "hoi@srm.edu.in", role: ROLES.HOI },
  { id: "usr-5", name: "Facilities Manager", email: "manager@srm.edu.in", role: ROLES.MANAGER },
  { id: "usr-6", name: "Staff User", email: "user@srm.edu.in", role: ROLES.USER },
];

function readStoredUsers() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const UsersContext = createContext(undefined);

export function UsersProvider({ children }) {
  const [users, setUsers] = useState(SEED_USERS);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount (client only, avoids SSR mismatch).
  useEffect(() => {
    const stored = readStoredUsers();
    if (stored) setUsers(stored);
    setHydrated(true);
  }, []);

  // Persist on every change, once hydrated.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    } catch {
      // ignore storage errors (e.g. private browsing / quota)
    }
  }, [users, hydrated]);

  const addUser = (user) => {
    setUsers((prev) => [{ id: `usr-${Date.now()}`, role: ROLES.USER, ...user }, ...prev]);
  };

  const updateUser = (id, updates) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
  };

  const deleteUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const value = { users, addUser, updateUser, deleteUser, ROLES };

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>;
}

export function useUsers() {
  const ctx = useContext(UsersContext);
  if (ctx === undefined) {
    throw new Error("useUsers must be used within a <UsersProvider>");
  }
  return ctx;
}
