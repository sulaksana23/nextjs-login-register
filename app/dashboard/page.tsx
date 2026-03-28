import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logoutAction } from "../actions/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
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
          <div className="flex items-center gap-4">
            {session.user.image && (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="h-16 w-16 rounded-full border border-zinc-200 dark:border-zinc-800"
              />
            )}
            <div>
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                Hello, {session.user.name || "User"}!
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                You are logged in via{" "}
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  Auth.js (v5)
                </span>
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 p-6">
              <h3 className="font-medium text-zinc-900 dark:text-white">Profile Info</h3>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  <span className="font-semibold">Email:</span> {session.user.email}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  <span className="font-semibold">User ID:</span> {session.user.id}
                </p>
              </div>
            </div>
            {/* Add more cards here */}
          </div>
        </div>
      </main>
    </div>
  );
}
