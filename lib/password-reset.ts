import { createHash, randomBytes } from "crypto";

const RESET_TOKEN_TTL_MS = 1000 * 60 * 60;

type SendPasswordResetEmailParams = {
  to: string;
  resetUrl: string;
};

function getOptionalEnvValue(value: string | undefined) {
  if (!value) return undefined;

  const normalized = value.trim();

  if (!normalized || normalized === "null" || normalized === "undefined") {
    return undefined;
  }

  return normalized;
}

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
  const mailer = getOptionalEnvValue(process.env.MAIL_MAILER);
  const smtpHost = getOptionalEnvValue(process.env.MAIL_HOST);
  const smtpPort = Number(getOptionalEnvValue(process.env.MAIL_PORT) || "0");
  const smtpUser = getOptionalEnvValue(process.env.MAIL_USERNAME);
  const smtpPassword = getOptionalEnvValue(process.env.MAIL_PASSWORD);
  const smtpEncryption = getOptionalEnvValue(process.env.MAIL_ENCRYPTION);
  const smtpFromEmail = getOptionalEnvValue(process.env.MAIL_FROM_ADDRESS);
  const smtpFromName =
    getOptionalEnvValue(process.env.MAIL_FROM_NAME) || "Auth Starter";
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const fromName = process.env.RESEND_FROM_NAME || "Auth Starter";

  const subject = "Reset your password";
  const html = `
    <div style="margin:0;padding:32px 16px;background:#f4f4f5;font-family:Arial,sans-serif;color:#18181b;">
      <div style="max-width:640px;margin:0 auto;">
        <div style="margin-bottom:16px;text-align:center;">
          <span style="display:inline-block;padding:8px 14px;border-radius:999px;background:#111827;color:#ffffff;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">
            Bali Techsolution
          </span>
        </div>
        <div style="overflow:hidden;border-radius:24px;background:#ffffff;box-shadow:0 18px 50px rgba(0,0,0,0.08);">
          <div style="padding:32px;background:linear-gradient(135deg,#18181b 0%,#27272a 100%);color:#ffffff;">
            <p style="margin:0 0 12px;font-size:13px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#a1a1aa;">
              Password Reset
            </p>
            <h1 style="margin:0;font-size:32px;line-height:1.2;font-weight:800;">
              Reset your password
            </h1>
            <p style="margin:16px 0 0;font-size:16px;line-height:1.7;color:#d4d4d8;">
              We received a request to reset the password for your account. Use the button below to continue securely.
            </p>
          </div>

          <div style="padding:32px;">
            <div style="margin-bottom:24px;border:1px solid #e4e4e7;border-radius:18px;background:#fafafa;padding:20px;">
              <p style="margin:0 0 10px;font-size:14px;font-weight:700;color:#18181b;">
                What happens next?
              </p>
              <p style="margin:0;font-size:15px;line-height:1.7;color:#52525b;">
                Click the button below to open the reset page and choose a new password. This link will expire in <strong>1 hour</strong>.
              </p>
            </div>

            <div style="text-align:center;margin:32px 0;">
              <a href="${resetUrl}" style="display:inline-block;padding:14px 24px;border-radius:14px;background:#111827;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;">
                Reset Password
              </a>
            </div>

            <p style="margin:0 0 12px;font-size:14px;line-height:1.7;color:#52525b;">
              If the button does not work, copy and paste this link into your browser:
            </p>
            <p style="margin:0 0 24px;word-break:break-all;font-size:13px;line-height:1.7;color:#2563eb;">
              <a href="${resetUrl}" style="color:#2563eb;text-decoration:none;">${resetUrl}</a>
            </p>

            <div style="border-top:1px solid #e4e4e7;padding-top:24px;">
              <p style="margin:0 0 10px;font-size:14px;line-height:1.7;color:#52525b;">
                If you did not request this, you can safely ignore this email. Your current password will remain unchanged.
              </p>
              <p style="margin:0;font-size:13px;line-height:1.7;color:#71717a;">
                Sent by Bali Techsolution
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  const text = `Reset your password using this link: ${resetUrl}\n\nThis link will expire in 1 hour.`;

  if (mailer === "smtp" && smtpHost && smtpPort && smtpFromEmail) {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpEncryption === "ssl" || smtpPort === 465,
      auth:
        smtpUser && smtpPassword
          ? {
              user: smtpUser,
              pass: smtpPassword,
            }
          : undefined,
    });

    await transporter.sendMail({
      from: `${smtpFromName} <${smtpFromEmail}>`,
      to,
      subject,
      html,
      text,
    });

    return { delivered: true as const, provider: "smtp" as const };
  }

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
      subject,
      html,
      text,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`RESEND_DELIVERY_FAILED: ${body}`);
  }

  return { delivered: true as const, provider: "resend" as const };
}
