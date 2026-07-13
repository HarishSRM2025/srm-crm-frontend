"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LuGraduationCap as GraduationCap,
  LuLock as Lock,
  LuMail as Mail,
  LuBuilding2 as Building,
  LuArrowRight as ArrowRight,
  LuCheck as Check,
  LuShieldCheck as ShieldCheck,
  LuLoader as Loader,
  LuChevronDown as ChevronDown,
} from "react-icons/lu";
import { signupUser, fetchInstitutes } from "@/lib/events-api";

const ROLES = ["User", "HOI", "HOD", "Manager", "SuperAdmin", "Admin"];

const pipeline = [
  {
    label: "Submitted",
    detail: "Your details are recorded against your college email.",
  },
  {
    label: "Reviewed",
    detail: "Administration verifies department and role.",
  },
  { label: "Approved", detail: "Portal access is granted for your role." },
];

export default function SignUpPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Admin");
  const [institutionId, setInstitutionId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [institutes, setInstitutes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch institutes on mount
  useEffect(() => {
    fetchInstitutes()
      .then(setInstitutes)
      .catch(() => {});
  }, []);

  // When institution changes, filter departments
  useEffect(() => {
    if (institutionId) {
      const inst = institutes.find((i) => i.id === Number(institutionId));
      setDepartments(inst?.departments || []);
    } else {
      setDepartments([]);
    }
    setDepartmentId("");
  }, [institutionId, institutes]);

  // Reset institution/department when role changes
  useEffect(() => {
    setInstitutionId("");
    setDepartmentId("");
  }, [role]);

  const needsInstitution = role === "HOI" || role === "HOD";
  const needsDepartment = role === "HOD";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!agreed) {
      setError("You must confirm official use.");
      return;
    }
    if (needsInstitution && !institutionId) {
      setError("Please select an institution.");
      return;
    }
    if (needsDepartment && !departmentId) {
      setError("Please select a department.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        email_id: email,
        password,
        role,
      };
      if (needsInstitution) payload.institution_id = Number(institutionId);
      if (needsDepartment) payload.department_id = Number(departmentId);

      await signupUser(payload);
      setSuccess("Account created! Redirecting to sign in…");
      setTimeout(() => router.push("/signin"), 1500);
    } catch (err) {
      setError(err.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F1F4F9] px-4 py-10 font-[Inter,system-ui,sans-serif]">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-2xl border border-[#cbd5e1] bg-white shadow-[0_1px_2px_rgba(17,71,204,0.05),0_16px_40px_-24px_rgba(17,71,204,0.30)] lg:grid-cols-[1.15fr_0.85fr]">
          {/* ---------------- FORM SIDE ---------------- */}
          <div className="p-6 sm:p-10 lg:p-12">
            <div className="mx-auto max-w-2xl">
              <Link href="/" className="inline-flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#1147cc] bg-[#1147cc]">
                  <GraduationCap size={19} className="text-white" />
                </span>
                <span>
                  <span className="block font-['Source_Serif_4',Georgia,serif] text-[15px] font-semibold text-[#0B2C7A]">
                    SRM Medical College
                  </span>
                  <span className="block font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#64748B]">
                    Admin Portal
                  </span>
                </span>
              </Link>

              <div className="mt-11">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1147cc]">
                  Account details
                </p>
                <h1 className="mt-2 font-['Source_Serif_4',Georgia,serif] text-[28px] font-semibold leading-tight tracking-tight text-[#0B2C7A] sm:text-[32px]">
                  Register for portal access
                </h1>
                <p className="mt-2.5 max-w-md text-[14px] leading-6 text-[#64748B]">
                  Enter your college details below. Every request is routed to
                  administration for role verification before access is granted.
                </p>
              </div>

              {/* Error / Success banners */}
              {error && (
                <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700">
                  {error}
                </div>
              )}
              {success && (
                <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] font-medium text-emerald-700">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-9 space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Email */}
                  <Field label="Email address">
                    <Mail size={15} className="text-[#94A3B8]" />
                    <input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@srm.edu"
                      className="w-full bg-transparent text-[14px] text-[#0B2C7A] placeholder:text-[#94A3B8] focus:outline-none"
                    />
                  </Field>

                  {/* Role */}
                  <label className="block">
                    <span className="text-[12px] font-semibold text-[#0B2C7A]">
                      Role
                    </span>
                    <div className="relative mt-1.5">
                      <select
                        id="signup-role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full appearance-none rounded-lg border border-[#cbd5e1] bg-[#F8FAFC] px-3.5 py-2.5 pr-9 text-[14px] font-medium text-[#0B2C7A] transition-colors focus:border-[#1147cc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1147cc]/15"
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={14}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                      />
                    </div>
                  </label>

                  {/* Institution (HOI, HOD) */}
                  {needsInstitution && (
                    <label className="block">
                      <span className="text-[12px] font-semibold text-[#0B2C7A]">
                        Institution
                      </span>
                      <div className="relative mt-1.5">
                        <select
                          id="signup-institution"
                          value={institutionId}
                          onChange={(e) => setInstitutionId(e.target.value)}
                          className="w-full appearance-none rounded-lg border border-[#cbd5e1] bg-[#F8FAFC] px-3.5 py-2.5 pr-9 text-[14px] font-medium text-[#0B2C7A] transition-colors focus:border-[#1147cc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1147cc]/15"
                        >
                          <option value="">Select institution…</option>
                          {institutes.map((inst) => (
                            <option key={inst.id} value={inst.id}>
                              {inst.institute_name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={14}
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                        />
                      </div>
                    </label>
                  )}

                  {/* Department (HOD only) */}
                  {needsDepartment && (
                    <label className="block">
                      <span className="text-[12px] font-semibold text-[#0B2C7A]">
                        Department
                      </span>
                      <div className="relative mt-1.5">
                        <select
                          id="signup-department"
                          value={departmentId}
                          onChange={(e) => setDepartmentId(e.target.value)}
                          disabled={!institutionId}
                          className="w-full appearance-none rounded-lg border border-[#cbd5e1] bg-[#F8FAFC] px-3.5 py-2.5 pr-9 text-[14px] font-medium text-[#0B2C7A] transition-colors focus:border-[#1147cc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1147cc]/15 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">
                            {institutionId
                              ? "Select department…"
                              : "Select institution first"}
                          </option>
                          {departments.map((dept) => (
                            <option key={dept.id} value={dept.id}>
                              {dept.department_name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={14}
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                        />
                      </div>
                    </label>
                  )}

                  {/* Password */}
                  <Field label="Password">
                    <Lock size={15} className="text-[#94A3B8]" />
                    <input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create password"
                      className="w-full bg-transparent text-[14px] text-[#0B2C7A] placeholder:text-[#94A3B8] focus:outline-none"
                    />
                  </Field>

                  {/* Confirm Password */}
                  <Field label="Confirm password">
                    <Lock size={15} className="text-[#94A3B8]" />
                    <input
                      id="signup-confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full bg-transparent text-[14px] text-[#0B2C7A] placeholder:text-[#94A3B8] focus:outline-none"
                    />
                  </Field>
                </div>

                <label className="flex items-start gap-2.5 rounded-lg border border-[#cbd5e1] bg-[#F8FAFC] p-3.5 text-[12.5px] leading-5 text-[#64748B]">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-[#cbd5e1] text-[#1147cc] focus:ring-[#1147cc]/30"
                  />
                  <span>
                    I confirm this account is for official SRM Medical College
                    administrative use.
                  </span>
                </label>

                <button
                  id="signup-submit"
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-lg bg-[#1147cc] px-4 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#0B2C7A] focus:outline-none focus:ring-2 focus:ring-[#1147cc]/40 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader
                        size={15}
                        className="animate-spin"
                      />
                      Creating account…
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </>
                  )}
                </button>

                <p className="text-center text-[13px] text-[#64748B]">
                  Already registered?{" "}
                  <Link
                    href="/signin"
                    className="font-semibold text-[#1147cc] hover:text-[#0B2C7A]"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            </div>
          </div>

          {/* ---------------- INFO SIDE ---------------- */}
          <aside className="relative overflow-hidden border-t border-[#0D379E] bg-[#1147cc] p-6 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
            {/* seal motif */}
            <div className="pointer-events-none absolute -right-10 -top-10 flex h-40 w-40 -rotate-[10deg] items-center justify-center rounded-full border border-dashed border-[#5478D9]">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border border-[#5478D9]">
                <ShieldCheck size={26} className="text-[#cbd5e1]" />
              </div>
            </div>

            <div className="relative flex h-full flex-col justify-between gap-10">
              <div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#cbd5e1]">
                  Access request
                </p>
                <h2 className="mt-3 font-['Source_Serif_4',Georgia,serif] text-[22px] font-semibold leading-snug tracking-tight text-white">
                  Keep college records accurate and review&#8209;ready.
                </h2>
                <p className="mt-3 text-[13.5px] leading-6 text-[#cbd5e1]">
                  New accounts are held for administration approval before any
                  sensitive record can be updated.
                </p>
              </div>

              <ol className="space-y-0">
                {pipeline.map((step, i) => (
                  <li
                    key={step.label}
                    className="relative flex gap-4 pb-7 last:pb-0"
                  >
                    {i !== pipeline.length - 1 && (
                      <span className="absolute left-[13px] top-7 h-[calc(100%-1.75rem)] w-px bg-[#3A64D6]" />
                    )}
                    <span className="relative z-10 flex h-7 w-7 flex-none items-center justify-center rounded-full border border-[#5478D9] bg-[#1147cc] font-mono text-[11px] font-semibold text-[#cbd5e1]">
                      {i === 0 ? <Check size={12} /> : i + 1}
                    </span>
                    <div className="pt-0.5">
                      <p className="text-[13.5px] font-semibold text-white">
                        {step.label}
                      </p>
                      <p className="mt-0.5 text-[12.5px] leading-5 text-[#cbd5e1]">
                        {step.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="grid gap-2.5 border-t border-[#3A64D6] pt-6 text-[12.5px] font-medium text-[#cbd5e1]">
                <FeatureRow text="Role-based portal access" />
                <FeatureRow text="Department-level accountability" />
                <FeatureRow text="Profile and event workflow controls" />
              </div>
            </div>
          </aside>
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

function FeatureRow({ text }) {
  return (
    <div className="flex items-center gap-2">
      <Check size={13} className="flex-none text-white" />
      <span>{text}</span>
    </div>
  );
}