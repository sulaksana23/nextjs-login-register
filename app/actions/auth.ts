"use server";

import { signIn, signOut } from "@/auth";
import {
  authMessages,
  isValidEmail,
  validatePassword,
} from "@/lib/auth-validation";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { Prisma } from "@/prisma/generated/client";

type AuthFieldName = "name" | "email" | "password" | "confirmPassword";

export type AuthActionState = {
  error?: string;
  fieldErrors?: Partial<Record<AuthFieldName, string>>;
  values?: {
    name?: string;
    email?: string;
  };
};

function getFormValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function registerAction(
  _state: AuthActionState | null | undefined,
  formData: FormData
): Promise<AuthActionState> {
  const email = getFormValue(formData, "email").toLowerCase();
  const password = getFormValue(formData, "password");
  const confirmPassword = getFormValue(formData, "confirmPassword");
  const name = getFormValue(formData, "name");
  const values = { name, email };
  const fieldErrors: AuthActionState["fieldErrors"] = {};

  if (!name) {
    fieldErrors.name = authMessages.nameRequired;
  }

  if (name && name.length < 2) {
    fieldErrors.name = authMessages.nameTooShort;
  }

  if (!email) {
    fieldErrors.email = authMessages.emailRequired;
  } else if (!isValidEmail(email)) {
    fieldErrors.email = authMessages.emailInvalid;
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    fieldErrors.password = passwordError;
  }

  if (!confirmPassword) {
    fieldErrors.confirmPassword = authMessages.confirmPasswordRequired;
  } else if (password !== confirmPassword) {
    fieldErrors.confirmPassword = authMessages.confirmPasswordMismatch;
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      error: "Please fix the highlighted fields and try again.",
      fieldErrors,
      values,
    };
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
      return {
        error: authMessages.emailExists,
        fieldErrors: {
          email: authMessages.emailExists,
        },
        values,
      };
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
      return { error: authMessages.databaseUnavailable, values };
    }

    console.error("Register failed", error);

    return { error: authMessages.unexpectedRegister, values };
  }

  redirect("/login?registered=1");
}

export async function loginAction(
  _state: AuthActionState | null | undefined,
  formData: FormData
): Promise<AuthActionState> {
  const email = getFormValue(formData, "email").toLowerCase();
  const password = getFormValue(formData, "password");
  const values = { email };
  const fieldErrors: AuthActionState["fieldErrors"] = {};

  if (!email) {
    fieldErrors.email = authMessages.emailRequired;
  } else if (!isValidEmail(email)) {
    fieldErrors.email = authMessages.emailInvalid;
  }

  if (!password) {
    fieldErrors.password = authMessages.passwordRequired;
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      error: "Please enter your email and password to continue.",
      fieldErrors,
      values,
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });

    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      console.error("Login failed", error.type, error.cause);

      switch (error.type) {
        case "CredentialsSignin":
        case "CallbackRouteError":
          return {
            error: authMessages.invalidCredentials,
            fieldErrors: {
              email: authMessages.invalidCredentials,
              password: authMessages.invalidCredentials,
            },
            values,
          };
        case "AdapterError":
        case "SessionTokenError":
          return { error: authMessages.databaseUnavailable, values };
        default:
          return { error: authMessages.unexpectedLogin, values };
      }
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login?loggedOut=1" });
}
