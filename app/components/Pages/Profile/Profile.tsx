"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Passkey } from "@/models/passkey.models";
import PasskeyManager from "./shared/PasskeysManager";

interface ProfileProps {
  username: string;
  passkeys?: Passkey[];
}

export default function Profile({ username, passkeys }: ProfileProps) {
  const t = useTranslations("PROFILE");

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 py-12 md:p-12">
      <div className="text-center flex flex-col gap-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">{t("TITLE")}</h1>
        <Link
          href="/profile/user-name"
          className="text-sm text-foreground/60 hover:text-foreground transition-colors duration-200 font-medium"
        >
          {t.rich("CHANGE_USER_NAME", {
            username,
            important: (chunks) => (
              <span className="font-semibold text-foreground underline decoration-foreground/20 hover:decoration-foreground transition-colors">{chunks}</span>
            ),
          })}
        </Link>
      </div>

      <div className="w-full max-w-md border-t border-foreground/10 my-2" />

      <h2 className="text-xl font-bold text-foreground tracking-tight mt-2">{t("SECURITY")}</h2>

      <PasskeyManager initialPasskeys={passkeys} />
    </div>
  );
}
