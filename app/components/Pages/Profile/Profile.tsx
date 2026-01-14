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
    <div className="flex flex-col items-center justify-center gap-8 py-4">
      <h1 className="text-3xl font-bold">{t("TITLE")}</h1>

      <h2 className="text-xl font-bold mb-4">{t("SECURITY")}</h2>

      <PasskeyManager initialPasskeys={passkeys} />

      <Link href="/profile/user-name" className="font-bold">
        {t.rich("CHANGE_USER_NAME", {
          username,
          important: (chunks) => (
            <span className="font-black">{chunks}</span>
          ),
        })}
      </Link>
    </div>
  );
}
