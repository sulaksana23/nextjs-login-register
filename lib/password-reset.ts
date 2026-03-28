import { createHash, randomBytes } from "crypto";

const RESET_TOKEN_TTL_MS = 1000 * 60 * 60;

type SendPasswordResetEmailParams = {
  to: string;
  resetUrl: string;
};

function hashResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createPasswordResetToken() {
  const rawToken = randomBytes(32).toString("hex");

  return {
    rawToken,
    hashedToken: hashResetToken(rawToken),
    expires: new Date(Date.now() + RESET_TOKEN_TTL_MS),
  };
}

export function verifyPasswordResetToken(token: string) {
  return hashResetToken(token);
}

export function getAppBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  if (process.env.AUTH_URL) {
    return process.env.AUTH_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/$/, "");
  }

  return "http://localhost:3000";
}

export async function sendPasswordResetEmail({
  to,
  resetUrl,
}: SendPasswordResetEmailParams) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const fromName = process.env.RESEND_FROM_NAME || "Auth Starter";

  if (!apiKey || !fromEmail) {
    return { delivered: false, reason: "missing_config" as const };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${fromName} <${fromEmail}>`,
      to,
      subject: "Reset your password",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #18181b;">
          <h2>Reset your password</h2>
          <p>We received a request to reset your password.</p>
          <p>
            <a href="${resetUrl}" style="display:inline-block;padding:12px 18px;background:#18181b;color:#ffffff;text-decoration:none;border-radius:10px;">
              Reset Password
            </a>
          </p>
          <p>If you did not request this, you can safely ignore this email.</p>
          <p>This link will expire in 1 hour.</p>
        </div>
      `,
      text: `Reset your password using this link: ${resetUrl}\n\nThis link will expire in 1 hour.`,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to send password reset email: ${body}`);
  }

  return { delivered: true as const };
}
