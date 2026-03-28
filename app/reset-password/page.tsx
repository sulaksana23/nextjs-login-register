import Link from "next/link";
import ResetPasswordForm from "./ResetPasswordForm";

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string;
    email?: string;
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;
  const token = params.token ?? "";
  const email = params.email ?? "";

  if (!token || !email) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
        <div className="w-full max-w-md space-y-6 rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Invalid reset link
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              This password reset link is missing information or may have expired.
            </p>
          </div>
          <Link
            href="/forgot-password"
            className="flex w-full justify-center rounded-lg bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return <ResetPasswordForm email={email} token={token} />;
}
