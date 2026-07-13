"use client";

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext(null);

const STORAGE_KEY = "srm_crm_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // corrupted storage
      localStorage.removeItem(STORAGE_KEY);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      const isAuthPage = pathname === "/signin" || pathname === "/signup";
      if (!user && !isAuthPage) {
        router.push("/signin");
      } else if (user && isAuthPage) {
        router.push("/");
      }
    }
  }, [user, loading, pathname, router]);


  const login = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    router.push("/signin");
  }, [router]);

  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
