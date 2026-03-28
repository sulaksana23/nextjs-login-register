"use client";

import { useActionState } from "react";
import Link from "next/link";
import SocialButtons from "../components/SocialButtons";
import { loginAction, type AuthActionState } from "../actions/auth";

type LoginFormProps = {
  isRegistered: boolean;
  isLoggedOut: boolean;
  providers: {
    google: boolean;
    github: boolean;
  };
};

const initialState: AuthActionState = {
  values: {
    email: "",
  },
  fieldErrors: {},
};

function getInputClass(hasError: boolean) {
  return `mt-1 block w-full rounded-lg border bg-white px-4 py-2 text-zinc-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-zinc-800 dark:text-zinc-100 sm:text-sm ${
    hasError
      ? "border-red-500 dark:border-red-500"
      : "border-zinc-300 dark:border-zinc-700"
  }`;
}

export default function LoginForm({
  isRegistered,
  isLoggedOut,
  providers,
}: LoginFormProps) {
  const [state, action, isPending] = useActionState<AuthActionState, FormData>(
    loginAction,
    initialState
  );
  const formState = state ?? initialState;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Log in to your account and continue where you left off
          </p>
        </div>

        <form className="mt-8 space-y-6" action={action} noValidate>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                defaultValue={formState.values?.email ?? ""}
                aria-invalid={Boolean(formState.fieldErrors?.email)}
                aria-describedby={
                  formState.fieldErrors?.email ? "login-email-error" : undefined
                }
                className={getInputClass(Boolean(formState.fieldErrors?.email))}
                placeholder="you@example.com"
              />
              {formState.fieldErrors?.email && (
                <p
                  id="login-email-error"
                  className="mt-2 text-sm text-red-600 dark:text-red-400"
                >
                  {formState.fieldErrors.email}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-sm font-medium text-zinc-950 hover:underline dark:text-zinc-50"
                >
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                aria-invalid={Boolean(formState.fieldErrors?.password)}
                aria-describedby={
                  formState.fieldErrors?.password ? "login-password-error" : undefined
                }
                className={getInputClass(Boolean(formState.fieldErrors?.password))}
                placeholder="••••••••"
              />
              {formState.fieldErrors?.password && (
                <p
                  id="login-password-error"
                  className="mt-2 text-sm text-red-600 dark:text-red-400"
                >
                  {formState.fieldErrors.password}
                </p>
              )}
            </div>
          </div>

          {isRegistered && (
            <div className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              Registration successful. Please log in.
            </div>
          )}

          {isLoggedOut && (
            <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
              You have been logged out successfully.
            </div>
          )}

          {formState.error && (
            <div
              role="alert"
              className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300"
            >
              {formState.error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="group relative flex w-full justify-center rounded-lg bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {isPending ? "Logging in..." : "Log in"}
            </button>
          </div>
        </form>

        <SocialButtons providers={providers} />

        <div className="text-center text-sm">
          <p className="text-zinc-600 dark:text-zinc-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-zinc-900 hover:underline dark:text-zinc-50"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
