"use client";

import { useTranslations } from "next-intl";
import PasskeyRegistration from "./shared/PasskeyRegistration";
import Link from "next/link";
import { useErrors } from "@/hooks/useErrors";
import { ERROR_CODES } from "@/utils/errors";

interface ProfileProps {
  email?: string;
}

export default function Profile({ email }: ProfileProps) {
  const t = useTranslations("PROFILE");
  const { errorT } = useErrors();

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-4">
      <h1 className="text-3xl font-bold">{t("TITLE")}</h1>

      <h2 className="text-xl font-bold mb-4">{t("SECURITY")}</h2>
      {email ? (
        <PasskeyRegistration email={email} />
      ) : (
        <p className="text-red-500">
          {errorT(ERROR_CODES.PASSKEY.EMAIL_NOT_FOUND)}
        </p>
      )}

      <Link href="/profile/user-name">{t("CHANGE_USER_NAME")}</Link>
    </div>
  );
}
