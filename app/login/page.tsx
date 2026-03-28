import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

type LoginPageProps = {
  searchParams: Promise<{
    registered?: string;
    loggedOut?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const isRegistered = params.registered === "1";
  const isLoggedOut = params.loggedOut === "1";
  const providers = {
    google: Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET),
    github: Boolean(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET),
  };

  return (
    <LoginForm
      isRegistered={isRegistered}
      isLoggedOut={isLoggedOut}
      providers={providers}
    />
  );
}
