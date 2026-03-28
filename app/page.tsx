import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.14),_transparent_32%),linear-gradient(180deg,_#fafafa_0%,_#f4f4f5_100%)] dark:bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.16),_transparent_24%),linear-gradient(180deg,_#09090b_0%,_#0f0f14_100%)]">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-10 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] border border-zinc-200/80 bg-white/90 shadow-[0_30px_80px_rgba(0,0,0,0.08)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/85">
          <div className="grid gap-10 px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-12 lg:py-14">
            <div className="flex flex-col justify-center">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                Auth Starter
              </div>
              <h1 className="mt-6 max-w-2xl text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl dark:text-zinc-50">
                Modern login and registration starter for your next production app.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-600 sm:text-lg dark:text-zinc-400">
                Built with Next.js 16, Auth.js v5, Prisma 7, PostgreSQL, and Tailwind
                CSS v4. This starter ships with protected routes, server-side validation,
                clear auth errors, and a dashboard flow that is ready to showcase in your
                portfolio.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-zinc-950 px-6 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
                  href="/login"
                >
                  Open Login
                </Link>
                <Link
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-300 px-6 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
                  href="/register"
                >
                  Create Account
                </Link>
                <a
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-emerald-300 bg-emerald-50 px-6 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-950/60"
                  href="https://trakteer.id/bali_techsolution"
                  target="_blank"
                  rel="noreferrer"
                >
                  Support on Trakteer
                </a>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Protected Dashboard
                  </p>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    Access control with route protection and authenticated session checks.
                  </p>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Stable Auth Flow
                  </p>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    Register, login, logout, and session persistence wired for production.
                  </p>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Clear Validation
                  </p>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    Friendly field-level error messages for email, password, and forms.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-full rounded-[1.75rem] border border-zinc-200 bg-zinc-950 p-4 shadow-2xl dark:border-zinc-800">
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
                <div className="space-y-4 rounded-[1.25rem] border border-zinc-800 bg-zinc-900 p-5">
                  <div>
                    <p className="text-sm font-medium text-zinc-400">Demo Flow</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">
                      Login, register, then land in a protected dashboard.
                    </h2>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                      <p className="text-sm font-semibold text-white">Login</p>
                      <p className="mt-2 text-sm text-zinc-400">
                        Credentials form, clear validation, OAuth-ready buttons.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                      <p className="text-sm font-semibold text-white">Register</p>
                      <p className="mt-2 text-sm text-zinc-400">
                        Password checklist, confirm password, duplicate email handling.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                      <p className="text-sm font-semibold text-white">Session</p>
                      <p className="mt-2 text-sm text-zinc-400">
                        Auth.js JWT sessions with route guard and logout flow.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                      <p className="text-sm font-semibold text-white">Deploy</p>
                      <p className="mt-2 text-sm text-zinc-400">
                        Production build verified with `lint`, `tsc`, and `next build`.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Stack</p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Next.js 16, Auth.js v5, Prisma 7, PostgreSQL, Tailwind CSS v4.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">UX</p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Optimized for small screens with compact spacing, stacked actions, and readable cards.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Portfolio Ready</p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Includes documentation, preview assets, deploy notes, and a live demo.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
