"use server";

import { signIn, signOut } from "@/auth";
import {
  authMessages,
  isValidEmail,
  validatePassword,
} from "@/lib/auth-validation";
import {
  createPasswordResetToken,
  getAppBaseUrl,
  sendPasswordResetEmail,
  verifyPasswordResetToken,
} from "@/lib/password-reset";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { Prisma } from "@/prisma/generated/client";

type AuthFieldName = "name" | "email" | "password" | "confirmPassword";

export type AuthActionState = {
  error?: string;
  success?: string;
  info?: string;
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

export async function requestPasswordResetAction(
  _state: AuthActionState | null | undefined,
  formData: FormData
): Promise<AuthActionState> {
  const email = getFormValue(formData, "email").toLowerCase();
  const values = { email };

  if (!email) {
    return {
      error: authMessages.emailRequired,
      fieldErrors: { email: authMessages.emailRequired },
      values,
    };
  }

  if (!isValidEmail(email)) {
    return {
      error: authMessages.emailInvalid,
      fieldErrors: { email: authMessages.emailInvalid },
      values,
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { email: true },
    });

    if (user?.email) {
      await prisma.verificationToken.deleteMany({
        where: { identifier: email },
      });

      const { rawToken, hashedToken, expires } = createPasswordResetToken();

      await prisma.verificationToken.create({
        data: {
          identifier: email,
          token: hashedToken,
          expires,
        },
      });

      const resetUrl = `${getAppBaseUrl()}/reset-password?token=${rawToken}&email=${encodeURIComponent(
        email
      )}`;

      const emailResult = await sendPasswordResetEmail({
        to: email,
        resetUrl,
      });

      if (!emailResult.delivered) {
        console.info(`Password reset link for ${email}: ${resetUrl}`);
      }
    }

    return {
      success: authMessages.resetRequestSuccess,
      info:
        process.env.NODE_ENV !== "production" ? authMessages.resetRequestInfo : undefined,
      values,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return { error: authMessages.databaseUnavailable, values };
    }

    console.error("Password reset request failed", error);

    return { error: authMessages.unexpectedResetRequest, values };
  }
}

export async function resetPasswordAction(
  _state: AuthActionState | null | undefined,
  formData: FormData
): Promise<AuthActionState> {
  const email = getFormValue(formData, "email").toLowerCase();
  const token = getFormValue(formData, "token");
  const password = getFormValue(formData, "password");
  const confirmPassword = getFormValue(formData, "confirmPassword");
  const values = { email };
  const fieldErrors: AuthActionState["fieldErrors"] = {};

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

  if (!token) {
    return {
      error: authMessages.resetLinkInvalid,
      values,
      fieldErrors,
    };
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      error: "Please fix the highlighted fields and try again.",
      fieldErrors,
      values,
    };
  }

  try {
    const hashedToken = verifyPasswordResetToken(token);
    const resetToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token: hashedToken,
        expires: {
          gt: new Date(),
        },
      },
    });

    if (!resetToken) {
      return {
        error: authMessages.resetLinkInvalid,
        values,
      };
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      await prisma.verificationToken.deleteMany({
        where: { identifier: email },
      });

      return {
        error: authMessages.resetLinkInvalid,
        values,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return { error: authMessages.databaseUnavailable, values };
    }

    console.error("Password reset failed", error);

    return { error: authMessages.unexpectedPasswordReset, values };
  }

  redirect("/login?reset=1");
}
