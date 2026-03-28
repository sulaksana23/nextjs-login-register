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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordChecks = [
    {
      label: "Minimal 8 karakter",
      valid: password.length >= 8,
    },
    {
      label: "Ada huruf",
      valid: /[A-Za-z]/.test(password),
    },
    {
      label: "Ada angka",
      valid: /\d/.test(password),
    },
  ];
  const isPasswordStarted = password.length > 0;
  const isConfirmStarted = confirmPassword.length > 0;
  const isPasswordStrong = passwordChecks.every((check) => check.valid);
  const isPasswordMatch = isConfirmStarted && password === confirmPassword;

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
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  aria-invalid={Boolean(formState.fieldErrors?.password)}
                  aria-describedby={
                    formState.fieldErrors?.password ? "reset-password-error" : undefined
                  }
                  className={`${getInputClass(
                    Boolean(formState.fieldErrors?.password)
                  )} pr-20`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute inset-y-0 right-3 my-auto h-fit text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {formState.fieldErrors?.password && (
                <p
                  id="reset-password-error"
                  className="mt-2 text-sm text-red-600 dark:text-red-400"
                >
                  {formState.fieldErrors.password}
                </p>
              )}
              <div className="mt-3 rounded-xl border border-zinc-200 bg-zinc-50/80 p-3 dark:border-zinc-800 dark:bg-zinc-950/60">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                  Password checklist
                </p>
                <div className="mt-2 space-y-2">
                  {passwordChecks.map((check) => (
                    <div
                      key={check.label}
                      className={`flex items-center gap-2 text-sm ${
                        check.valid
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-zinc-500 dark:text-zinc-400"
                      }`}
                    >
                      <span
                        className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                          check.valid
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : "bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                        }`}
                      >
                        {check.valid ? "✓" : "•"}
                      </span>
                      <span>{check.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Confirm new password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
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
                  className={`${getInputClass(
                    Boolean(formState.fieldErrors?.confirmPassword)
                  )} pr-20`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  className="absolute inset-y-0 right-3 my-auto h-fit text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
              {formState.fieldErrors?.confirmPassword && (
                <p
                  id="reset-confirm-password-error"
                  className="mt-2 text-sm text-red-600 dark:text-red-400"
                >
                  {formState.fieldErrors.confirmPassword}
                </p>
              )}
              <div className="mt-2 min-h-6 text-sm">
                {isConfirmStarted ? (
                  <p
                    className={
                      isPasswordMatch
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-amber-600 dark:text-amber-400"
                    }
                  >
                    {isPasswordMatch
                      ? "Password confirmation matches."
                      : "Password confirmation does not match yet."}
                  </p>
                ) : (
                  <p className="text-zinc-500 dark:text-zinc-400">
                    Re-enter your password to confirm it.
                  </p>
                )}
              </div>
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
            disabled={isPending || !isPasswordStrong || !isPasswordMatch}
            className="flex w-full justify-center rounded-lg bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {isPending ? "Resetting..." : "Reset password"}
          </button>
          {!isPending && isPasswordStarted && (!isPasswordStrong || !isPasswordMatch) && (
            <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
              Complete the password checklist and make sure both passwords match.
            </p>
          )}
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
