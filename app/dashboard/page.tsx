import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { logoutAction } from "../actions/auth";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.value },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <nav className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-8 py-4">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Dashboard</h1>
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 dark:bg-zinc-100 px-4 py-2 text-sm font-medium text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
          >
            Logout
          </button>
        </form>
      </nav>
      <main className="flex-1 p-8">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
            Hello, {user.name || "User"}!
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            You are successfully logged in using your PostgreSQL database.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 p-6">
              <h3 className="font-medium text-zinc-900 dark:text-white">Profile Info</h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Email: {user.email}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
