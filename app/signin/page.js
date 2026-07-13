"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LuGraduationCap as GraduationCap,
  LuLock as Lock,
  LuMail as Mail,
  LuArrowRight as ArrowRight,
  LuCheck as Check,
  LuLoader as Loader,
} from "react-icons/lu";
import { signinUser } from "@/lib/events-api";
import { useAuth } from "@/context/AuthContext";

const highlights = [
  "Doctor profile approvals",
  "Hall booking tracking",
  "Department activity overview",
];

export default function SignInPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      const userData = await signinUser(email, password);
      login(userData);
      router.push("/");
    } catch (err) {
      setError(err.message || "Invalid credentials. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F1F4F9] px-4 py-10 font-[Inter,system-ui,sans-serif]">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-2xl border border-[#cbd5e1] bg-white shadow-[0_1px_2px_rgba(17,71,204,0.05),0_16px_40px_-24px_rgba(17,71,204,0.30)] lg:grid-cols-[0.95fr_1.05fr]">
          {/* ---------------- INFO SIDE ---------------- */}
          <div className="relative overflow-hidden border-b border-[#0D379E] bg-[#1147cc] p-6 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
            <div className="pointer-events-none absolute -bottom-14 -left-14 h-44 w-44 rotate-[8deg] rounded-full border border-dashed border-[#5478D9]" />

            <div className="relative flex h-full flex-col justify-between gap-12">
              <div>
                <Link href="/" className="inline-flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-white bg-white">
                    <GraduationCap size={19} className="text-[#1147cc]" />
                  </span>
                  <span>
                    <span className="block font-['Source_Serif_4',Georgia,serif] text-[15px] font-semibold text-white">
                      SRM Medical College
                    </span>
                    <span className="block font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#cbd5e1]">
                      Admin Portal
                    </span>
                  </span>
                </Link>

                <div className="mt-12 max-w-sm">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#cbd5e1]">
                    Secure access
                  </p>
                  <h1 className="mt-3 font-['Source_Serif_4',Georgia,serif] text-[26px] font-semibold leading-tight tracking-tight text-white sm:text-[28px]">
                    Sign in to manage college operations.
                  </h1>
                  <p className="mt-3 text-[13.5px] leading-6 text-[#cbd5e1]">
                    Review doctor profiles, track event bookings, and continue
                    administrative workflows from one place.
                  </p>
                </div>
              </div>

              <div className="grid gap-2.5 border-t border-[#3A64D6] pt-6 text-[12.5px] font-medium text-[#cbd5e1]">
                {highlights.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <Check size={13} className="flex-none text-white" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ---------------- FORM SIDE ---------------- */}
          <div className="bg-white p-6 sm:p-10 lg:p-12">
            <div className="mx-auto max-w-md">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1147cc]">
                Welcome back
              </p>
              <h2 className="mt-2 font-['Source_Serif_4',Georgia,serif] text-[24px] font-semibold tracking-tight text-[#0B2C7A]">
                Sign in to your account
              </h2>
              <p className="mt-1.5 text-[13px] text-[#64748B]">
                Use your institutional credentials to continue.
              </p>

              {/* Error banner */}
              {error && (
                <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <Field label="Email address">
                  <Mail size={15} className="text-[#94A3B8]" />
                  <input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@srm.edu"
                    className="w-full bg-transparent text-[14px] text-[#0B2C7A] placeholder:text-[#94A3B8] focus:outline-none"
                  />
                </Field>

                <Field label="Password">
                  <Lock size={15} className="text-[#94A3B8]" />
                  <input
                    id="signin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-transparent text-[14px] text-[#0B2C7A] placeholder:text-[#94A3B8] focus:outline-none"
                  />
                </Field>

                <button
                  id="signin-submit"
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-lg bg-[#1147cc] px-4 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#0B2C7A] focus:outline-none focus:ring-2 focus:ring-[#1147cc]/40 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader size={15} className="animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-[13px] text-[#64748B]">
                New to the portal?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-[#1147cc] hover:text-[#0B2C7A]"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-[12px] font-semibold text-[#0B2C7A]">{label}</span>
      <div className="mt-1.5 flex items-center gap-2.5 rounded-lg border border-[#cbd5e1] bg-[#F8FAFC] px-3.5 py-2.5 transition-colors focus-within:border-[#1147cc] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1147cc]/15">
        {children}
      </div>
    </label>
  );
}