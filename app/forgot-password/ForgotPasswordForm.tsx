"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  requestPasswordResetAction,
  type AuthActionState,
} from "../actions/auth";

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

export default function ForgotPasswordForm() {
  const [state, action, isPending] = useActionState<AuthActionState, FormData>(
    requestPasswordResetAction,
    initialState
  );
  const formState = state ?? initialState;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Forgot your password?
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Enter your email address and we&apos;ll send you a reset link if your account
            exists.
          </p>
        </div>

        <form className="mt-8 space-y-6" action={action} noValidate>
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
                formState.fieldErrors?.email ? "forgot-email-error" : undefined
              }
              className={getInputClass(Boolean(formState.fieldErrors?.email))}
              placeholder="you@example.com"
            />
            {formState.fieldErrors?.email && (
              <p
                id="forgot-email-error"
                className="mt-2 text-sm text-red-600 dark:text-red-400"
              >
                {formState.fieldErrors.email}
              </p>
            )}
          </div>

          {formState.success && (
            <div className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              {formState.success}
            </div>
          )}

          {formState.info && (
            <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
              {formState.info}
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

          <button
            type="submit"
            disabled={isPending}
            className="flex w-full justify-center rounded-lg bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {isPending ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          <Link href="/login" className="font-medium text-zinc-900 hover:underline dark:text-zinc-50">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
