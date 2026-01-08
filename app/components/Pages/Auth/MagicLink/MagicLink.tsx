"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { verifyMagicLinkAction } from "@/actions/auth/magic-link/verify.magic.link.actions";
import { useErrors } from "@/hooks/useErrors";
import { useCommon } from "@/hooks/useCommon";
import { tryCatch } from "@/utils/tryCatch";

interface MagicLinkProps {
  token: string;
}

export default function MagicLink({ token }: MagicLinkProps) {
  const t = useTranslations("MAGIC_LINK");
  const { errorT } = useErrors();
  const { commonT } = useCommon();
  const router = useRouter();

  useEffect(() => {
    if (!token) return;

    const verifyMagicLink = async () => {
      const [username, error] = await tryCatch(verifyMagicLinkAction(token));

      if (error)
        return toast.error(errorT(error.message)), router.push("/auth");

      if (!username) return router.push("/profile/user-name");

      toast.success(commonT("HELLO", username));
      router.push("/profile");
    };

    verifyMagicLink();
  }, [token, router, commonT, errorT]);

  return (
    <p className="flex grow items-center justify-center">{t("VERIFYING")}</p>
  );
}
