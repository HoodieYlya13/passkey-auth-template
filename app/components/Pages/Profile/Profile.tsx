"use client";

import { useTranslations } from "next-intl";
import PasskeyRegistration from "./shared/PasskeyRegistration";
import Link from "next/link";
import AllPasskeys from "./shared/AllPasskeys";
import { Passkey } from "@/models/passkey.models";

interface ProfileProps {
  email: string;
  passkeys?: Passkey[];
}

export default function Profile({ email, passkeys }: ProfileProps) {
  const t = useTranslations("PROFILE");

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-4">
      <h1 className="text-3xl font-bold">{t("TITLE")}</h1>

      <h2 className="text-xl font-bold mb-4">{t("SECURITY")}</h2>

      <PasskeyRegistration email={email} />

      <AllPasskeys passkeys={passkeys} />

      <Link href="/profile/user-name">{t("CHANGE_USER_NAME")}</Link>
    </div>
  );
}
