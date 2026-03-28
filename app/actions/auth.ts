"use server";

import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { Prisma } from "@/prisma/generated/client";

export type AuthActionState = {
  error?: string;
};

function getFormValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function registerAction(
  _state: AuthActionState | null | undefined,
  formData: FormData
) {
  const email = getFormValue(formData, "email").toLowerCase();
  const password = getFormValue(formData, "password");
  const confirmPassword = getFormValue(formData, "confirmPassword");
  const name = getFormValue(formData, "name");

  if (!name || !email || !password || !confirmPassword) {
    return { error: "Name, email, password, and confirm password are required" };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  if (password !== confirmPassword) {
    return { error: "Password confirmation does not match" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "Email already exists" };
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
      return { error: "Database connection failed" };
    }

    console.error("Register failed", error);

    return { error: "Something went wrong" };
  }

  redirect("/login?registered=1");
}

export async function loginAction(
  _state: AuthActionState | null | undefined,
  formData: FormData
) {
  const email = getFormValue(formData, "email").toLowerCase();
  const password = getFormValue(formData, "password");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      console.error("Login failed", error.type, error.cause);

      switch (error.type) {
        case "CredentialsSignin":
        case "CallbackRouteError":
          return { error: "Invalid credentials" };
        case "AdapterError":
        case "SessionTokenError":
          return { error: "Database connection failed" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
