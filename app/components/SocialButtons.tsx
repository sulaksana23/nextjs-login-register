"use client";

import type { ReactNode } from "react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

type SocialButtonsProps = {
  providers: {
    google: boolean;
    github: boolean;
  };
};

type AvailableProvider = {
  id: string;
  label: string;
  icon: ReactNode;
};

export default function SocialButtons({ providers }: SocialButtonsProps) {
  const availableProviders: AvailableProvider[] = [];

  if (providers.google) {
    availableProviders.push({
      id: "google",
      label: "Google",
      icon: <FcGoogle className="h-5 w-5" />,
    });
  }

  if (providers.github) {
    availableProviders.push({
      id: "github",
      label: "GitHub",
      icon: <FaGithub className="h-5 w-5" />,
    });
  }

  if (availableProviders.length === 0) {
    return (
      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        Google and GitHub sign-in are hidden until their environment variables are configured.
      </p>
    );
  }

  const handleSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: "/dashboard" });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-zinc-900 px-2 text-zinc-500">
            Or continue with
          </span>
        </div>
      </div>

      <div className={`grid gap-4 ${availableProviders.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
        {availableProviders.map((provider) => (
          <button
            key={provider.id}
            onClick={() => handleSignIn(provider.id)}
            className="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 outline-none transition-all hover:bg-zinc-50 focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
          >
            {provider.icon}
            {provider.label}
          </button>
        ))}
      </div>
    </div>
  );
}
