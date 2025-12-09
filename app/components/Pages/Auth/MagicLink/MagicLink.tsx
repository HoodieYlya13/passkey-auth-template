"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { verifyMagicLinkAction } from "@/actions/auth/magic-link/verify.magic.link.actions";
import { useErrors } from "@/hooks/useErrors";
import { useCommon } from "@/hooks/useCommon";

interface MagicLinkProps {
  token: string;
}

export default function MagicLink({ token }: MagicLinkProps) {
  const t = useTranslations("MAGIC_LINK");
  const errorT = useErrors();
  const commonT = useCommon();
  const router = useRouter();

  useEffect(() => {
    if (!token) return;

    const verifyMagicLink = async () => {
      try {
        const username = await verifyMagicLinkAction(token);
        if (!username) return router.push("/profile/user-name");
        toast.success(commonT.getCommon("HELLO", username));
        router.push("/profile");
      } catch (error) {
        toast.error(
          errorT.getError(error instanceof Error ? error.message : "")
        );
        router.push("/auth");
      }
    };

    verifyMagicLink();
  }, [token, router, commonT, errorT]);

  return (
    <p className="flex grow items-center justify-center">{t("VERIFYING")}</p>
  );
}
