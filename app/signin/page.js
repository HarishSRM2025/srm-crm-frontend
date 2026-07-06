import Link from "next/link";
import {
  LuGraduationCap as GraduationCap,
  LuLock as Lock,
  LuMail as Mail,
  LuArrowRight as ArrowRight,
} from "react-icons/lu";

export const dynamic = "force-dynamic";

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-transparent px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-2xl border border-slate-200 bg-white lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border-b border-slate-200 bg-slate-50/70 p-6 sm:p-8 lg:border-b-0 lg:border-r">
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

            <div className="mt-12 max-w-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary-600">
                Secure access
              </p>
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
                Sign in to manage college operations.
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Review doctor profiles, track event bookings, and continue administrative workflows from one place.
              </p>
            </div>

            <div className="mt-10 grid gap-3 text-xs font-semibold text-slate-600">
              <div className="rounded-xl border border-slate-200 bg-white p-3">Doctor profile approvals</div>
              <div className="rounded-xl border border-slate-200 bg-white p-3">Hall booking tracking</div>
              <div className="rounded-xl border border-slate-200 bg-white p-3">Department activity overview</div>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="mx-auto max-w-md">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Welcome back</h2>
                <p className="mt-1 text-xs font-medium text-slate-400">
                  Use your institutional credentials to continue.
                </p>
              </div>

              <form action="/" className="mt-8 space-y-5">
                <label className="block">
                  <span className="text-xs font-semibold text-slate-600">Email address</span>
                  <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 focus-within:border-primary-500 focus-within:bg-white">
                    <Mail size={15} className="text-slate-400" />
                    <input
                      type="email"
                      placeholder="admin@srm.edu"
                      className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="text-xs font-semibold text-slate-600">Password</span>
                  <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 focus-within:border-primary-500 focus-within:bg-white">
                    <Lock size={15} className="text-slate-400" />
                    <input
                      type="password"
                      placeholder="Enter password"
                      className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                </label>

                <div className="flex items-center justify-between gap-3">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-primary-600" />
                    Remember me
                  </label>
                  <Link href="#" className="text-xs font-bold text-primary-600 hover:text-primary-800">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary-700 bg-primary-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:border-primary-800 hover:bg-primary-700"
                >
                  Sign in
                  <ArrowRight size={15} />
                </button>
              </form>

              <p className="mt-6 text-center text-xs font-medium text-slate-500">
                New to the portal?{" "}
                <Link href="/signup" className="font-bold text-primary-600 hover:text-primary-800">
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
