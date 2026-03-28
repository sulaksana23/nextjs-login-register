export const PASSWORD_MIN_LENGTH = 8;

export const authMessages = {
  nameRequired: "Please enter your full name.",
  nameTooShort: "Your name must be at least 2 characters long.",
  emailRequired: "Please enter your email address.",
  emailInvalid: "Please enter a valid email address.",
  passwordRequired: "Please enter your password.",
  passwordTooShort: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`,
  passwordNeedsLetter: "Password must include at least one letter.",
  passwordNeedsNumber: "Password must include at least one number.",
  confirmPasswordRequired: "Please confirm your password.",
  confirmPasswordMismatch: "Password confirmation does not match.",
  invalidCredentials: "Email or password is incorrect.",
  emailExists: "An account with this email already exists.",
  databaseUnavailable:
    "Unable to reach the database right now. Please check your configuration and try again.",
  unexpectedRegister:
    "We could not create your account right now. Please try again in a moment.",
  unexpectedLogin: "We could not sign you in right now. Please try again in a moment.",
  resetRequestSuccess:
    "If an account exists for that email, a password reset link has been sent.",
  resetRequestInfo:
    "Email delivery is optional in development. If email is not configured, check your server logs locally.",
  resetLinkInvalid:
    "This password reset link is invalid or has expired. Please request a new one.",
  resetEmailDeliveryFailed:
    "Password reset email could not be delivered. Please verify your Resend sender email and domain configuration.",
  unexpectedResetRequest:
    "We could not start the password reset process right now. Please try again in a moment.",
  unexpectedPasswordReset:
    "We could not reset your password right now. Please try again in a moment.",
} as const;

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password: string) {
  if (!password) return authMessages.passwordRequired;
  if (password.length < PASSWORD_MIN_LENGTH) return authMessages.passwordTooShort;
  if (!/[A-Za-z]/.test(password)) return authMessages.passwordNeedsLetter;
  if (!/\d/.test(password)) return authMessages.passwordNeedsNumber;

  return null;
}
