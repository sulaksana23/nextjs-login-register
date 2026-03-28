import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ForgotPasswordForm from "./ForgotPasswordForm";

export default async function ForgotPasswordPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return <ForgotPasswordForm />;
}
