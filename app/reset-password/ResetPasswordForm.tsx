"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { resetPasswordAction, type AuthActionState } from "../actions/auth";

type ResetPasswordFormProps = {
  email: string;
  token: string;
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

export default function ResetPasswordForm({
  email,
  token,
}: ResetPasswordFormProps) {
  const [state, action, isPending] = useActionState<AuthActionState, FormData>(
    resetPasswordAction,
    {
      ...initialState,
      values: { email },
    }
  );
  const formState = state ?? initialState;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Reset password
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Choose a new password for <span className="font-medium">{email}</span>.
          </p>
        </div>

        <form className="mt-8 space-y-6" action={action} noValidate>
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="token" value={token} />

          <div className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                New password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-invalid={Boolean(formState.fieldErrors?.password)}
                aria-describedby={
                  formState.fieldErrors?.password ? "reset-password-error" : undefined
                }
                className={getInputClass(Boolean(formState.fieldErrors?.password))}
                placeholder="••••••••"
              />
              {formState.fieldErrors?.password && (
                <p
                  id="reset-password-error"
                  className="mt-2 text-sm text-red-600 dark:text-red-400"
                >
                  {formState.fieldErrors.password}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Confirm new password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                aria-invalid={Boolean(formState.fieldErrors?.confirmPassword)}
                aria-describedby={
                  formState.fieldErrors?.confirmPassword
                    ? "reset-confirm-password-error"
                    : undefined
                }
                className={getInputClass(Boolean(formState.fieldErrors?.confirmPassword))}
                placeholder="••••••••"
              />
              {formState.fieldErrors?.confirmPassword && (
                <p
                  id="reset-confirm-password-error"
                  className="mt-2 text-sm text-red-600 dark:text-red-400"
                >
                  {formState.fieldErrors.confirmPassword}
                </p>
              )}
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Use at least 8 characters with at least one letter and one number.
              </p>
            </div>
          </div>

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
            {isPending ? "Resetting..." : "Reset password"}
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
