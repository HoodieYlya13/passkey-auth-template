"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import Input from "../../UI/shared/elements/Input";
import Button from "../../UI/shared/elements/Button";
import Form from "../../UI/shared/components/Form";
import { useAuthMagicLinkForm } from "@/hooks/forms/useAuthMagicLinkForm";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { loginMagicLinkAction } from "@/actions/auth/magic-link/login.magic.link.actions";
import { loginPasskeyAction } from "@/actions/auth/passkey/client.paskey.actions";
import { useErrors } from "@/hooks/useErrors";
import { useCommon } from "@/hooks/useCommon";

function getEmailProvider(email: string) {
  if (!email) return null;

  const domainParts = email.split("@")[1]?.toLowerCase().split(".");
  if (!domainParts || domainParts.length < 2) return null;

  const tld = domainParts.slice(1).join(".");
  const providerName = domainParts[0];

  const map: Record<
    string,
    { name: string; url?: string; getUrl?: (tld: string) => string }
  > = {
    gmail: { name: "Gmail", url: "https://mail.google.com" },
    yahoo: {
      name: "Yahoo Mail",
      getUrl: (tld) => `https://mail.yahoo.${tld}`,
    },
    hotmail: { name: "Outlook", url: "https://outlook.live.com" },
    outlook: { name: "Outlook", url: "https://outlook.live.com" },
    live: { name: "Outlook", url: "https://outlook.live.com" },
    icloud: { name: "iCloud Mail", url: "https://www.icloud.com/mail" },
    orange: {
      name: "Orange Mail",
      getUrl: (tld) => `https://messagerie.orange.${tld}`,
    },
    sfr: { name: "SFR Mail", getUrl: (tld) => `https://webmail.sfr.${tld}` },
    laposte: {
      name: "La Poste Mail",
      url: "https://www.laposte.net/accueil",
    },
    free: {
      name: "Free Mail",
      getUrl: (tld) => `https://webmail.free.${tld}`,
    },
    proton: {
      name: "Proton Mail",
      url: "https://account.proton.me/",
    },
  };

  const provider = map[providerName];
  if (!provider) return null;

  return {
    name: provider.name,
    url: provider.getUrl ? provider.getUrl(tld) : provider.url!,
  };
}

export default function Auth() {
  const t = useTranslations("AUTH");
  const errorT = useErrors();
  const commonT = useCommon();
  const form = useAuthMagicLinkForm();
  const router = useRouter();

  const [isPasskeyLogin, setIsPasskeyLogin] = useState(false);
  const [emailProviderLink, setEmailProviderLink] = useState<{
    name: string;
    url: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [successText, setSuccessText] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  const emailProviderLinkMemo = useMemo(
    () => getEmailProvider(form.watch("email")),
    [form]
  );

  const onPasskeySubmit = useCallback(async () => {
    try {
      const username = await loginPasskeyAction();
      router.push("/profile");
      toast.success(commonT.getCommon("HELLO", username));
    } catch (error) {
      const errorFinal = error instanceof Error ? error.message : "";
      setErrorText(errorFinal);
      toast.error(errorT.getError(errorFinal));
    } finally {
      setLoading(false);
    }
  }, [router, errorT, commonT, setErrorText, setLoading]);

  const onPasskeyLogin = () => {
    setIsPasskeyLogin(true);
    setEmailProviderLink(null);
    setErrorText(null);
    form.clearErrors();
    setSuccessText(null);
    setLoading(true);
    onPasskeySubmit();
  };

  const onMagicLinkSubmit = useCallback(
    async (data: { email: string }) => {
      try {
        await loginMagicLinkAction(data.email);
        setSuccessText("MAGIC_LINK_SENT");
        toast.success(t("MAGIC_LINK_SENT"));
      } catch (error) {
        form.setError("root", {
          message: error instanceof Error ? error.message : "",
        });
      }
    },
    [form, t, setSuccessText]
  );

  const onMagicLinkLogin = (e: React.FormEvent<HTMLFormElement>) => {
    setIsPasskeyLogin(false);
    setEmailProviderLink(emailProviderLinkMemo);
    form.clearErrors();
    setErrorText(null);
    setSuccessText(null);
    form.handleSubmit(onMagicLinkSubmit)(e);
  };

  return (
    <div className="flex w-full grow justify-center items-center py-4">
      <Form
        form={form}
        handleSubmit={onMagicLinkLogin}
        buttonLabel={t("SEND_MAGIC_LINK")}
        successText={successText ? t(successText) : undefined}
      >
        <h2 className="text-2xl font-bold text-center">{t("LOGIN_TITLE")}</h2>
        <div className="flex flex-col gap-4">
          <Button
            onClick={onPasskeyLogin}
            type="button"
            disabled={loading}
            child={loading ? commonT.getCommon("") : t("SIGN_IN_PASSKEY")}
          />
          {errorText && (
            <p className="ml-1 sm:ml-2 mt-1 text-xs sm:text-sm md:text-base text-red-500">
              {errorT.getError(errorText)}
            </p>
          )}

          <div className="inline-flex items-center justify-center my-4">
            <div className="w-full border-t border-gray-700" />
            <div className="w-full px-4 text-sm text-gray-500 text-center">
              {t("OR")}
            </div>
            <div className="w-full border-t border-gray-700" />
          </div>

          <div className="flex flex-col gap-2">
            <Input
              id="email"
              type="email"
              label={t("EMAIL_LABEL")}
              {...form.register("email")}
              focusOnMount
              error={
                form.formState.errors.email?.message &&
                t(form.formState.errors.email?.message)
              }
            />

            {/* TODO: Maybe use <Activity /> component ? */}
            {!isPasskeyLogin && successText && emailProviderLink && (
              <p className="text-sm text-dark mt-2">
                {t("CHECK_YOUR_EMAIL")}{" "}
                <Link
                  href={emailProviderLink.url}
                  target="_blank"
                  className="underline"
                >
                  {emailProviderLink.name}
                </Link>
              </p>
            )}
          </div>
        </div>
      </Form>
    </div>
  );
}
