import Link from "next/link";
import {
  LuGraduationCap as GraduationCap,
  LuLock as Lock,
  LuMail as Mail,
  LuUser as User,
  LuBuilding2 as Building,
  LuArrowRight as ArrowRight,
} from "react-icons/lu";

export const dynamic = "force-dynamic";

const roles = ["Administrator", "Department HOD", "Event Coordinator"];

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-transparent px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-2xl border border-slate-200 bg-white lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="mx-auto max-w-2xl">
              <Link href="/" className="inline-flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary-700 bg-gradient-to-br from-primary-500 to-primary-700">
                  <GraduationCap size={20} className="text-white" />
                </span>
                <span>
                  <span className="block text-sm font-bold text-slate-900">SRM Medical</span>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Admin Portal
                  </span>
                </span>
              </Link>

              <div className="mt-10">
                <h1 className="text-2xl font-bold tracking-tight text-slate-950">Create your portal account</h1>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Register with your college details to request access to administrative workflows.
                </p>
              </div>

              <form className="mt-8 space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-semibold text-slate-600">Full name</span>
                    <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 focus-within:border-primary-500 focus-within:bg-white">
                      <User size={15} className="text-slate-400" />
                      <input
                        type="text"
                        placeholder="Dr. Arun Krishnan"
                        className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold text-slate-600">Email address</span>
                    <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 focus-within:border-primary-500 focus-within:bg-white">
                      <Mail size={15} className="text-slate-400" />
                      <input
                        type="email"
                        placeholder="name@srm.edu"
                        className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold text-slate-600">Department</span>
                    <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 focus-within:border-primary-500 focus-within:bg-white">
                      <Building size={15} className="text-slate-400" />
                      <input
                        type="text"
                        placeholder="General Medicine"
                        className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold text-slate-600">Role</span>
                    <select className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm font-medium text-slate-700 focus:border-primary-500 focus:bg-white focus:outline-none">
                      {roles.map((role) => (
                        <option key={role}>{role}</option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold text-slate-600">Password</span>
                    <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 focus-within:border-primary-500 focus-within:bg-white">
                      <Lock size={15} className="text-slate-400" />
                      <input
                        type="password"
                        placeholder="Create password"
                        className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold text-slate-600">Confirm password</span>
                    <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 focus-within:border-primary-500 focus-within:bg-white">
                      <Lock size={15} className="text-slate-400" />
                      <input
                        type="password"
                        placeholder="Repeat password"
                        className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                      />
                    </div>
                  </label>
                </div>

                <label className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-xs leading-5 text-slate-500">
                  <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary-600" />
                  <span>
                    I confirm this account is for official SRM Medical College administrative use.
                  </span>
                </label>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary-700 bg-primary-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:border-primary-800 hover:bg-primary-700"
                >
                  Create account
                  <ArrowRight size={15} />
                </button>
              </form>
            </div>
          </div>

          <aside className="border-t border-slate-200 bg-slate-50/70 p-6 sm:p-8 lg:border-l lg:border-t-0">
            <div className="flex h-full flex-col justify-between gap-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary-600">
                  Access request
                </p>
                <h2 className="mt-3 text-xl font-bold tracking-tight text-slate-950">
                  Keep college records accurate and review-ready.
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  New accounts can be routed to administration for role approval before sensitive records are updated.
                </p>
              </div>

              <div className="grid gap-3 text-xs font-semibold text-slate-600">
                <div className="rounded-xl border border-slate-200 bg-white p-3">Role-based portal access</div>
                <div className="rounded-xl border border-slate-200 bg-white p-3">Department-level accountability</div>
                <div className="rounded-xl border border-slate-200 bg-white p-3">Profile and event workflow controls</div>
              </div>

              <p className="text-xs font-medium text-slate-500">
                Already registered?{" "}
                <Link href="/signin" className="font-bold text-primary-600 hover:text-primary-800">
                  Sign in
                </Link>
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
