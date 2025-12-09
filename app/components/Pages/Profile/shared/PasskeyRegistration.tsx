"use client";

import { useCallback, useState } from "react";
import Input from "../../../UI/shared/elements/Input";
import { useTranslations } from "next-intl";
import Form from "../../../UI/shared/components/Form";
import { useUpdatePasskeyNameForm } from "@/hooks/forms/useUpdatePasskeyNameForm";
import { useAuth } from "@/hooks/useAuth";
import { registerPasskeyAction } from "@/actions/auth/passkey/client.paskey.actions";
import { useErrors } from "@/hooks/useErrors";

interface PasskeyRegistrationProps {
  email: string;
}

export default function PasskeyRegistration({
  email,
}: PasskeyRegistrationProps) {
  const t = useTranslations("PROFILE.PASSKEY");
  const errorT = useErrors();
  const form = useUpdatePasskeyNameForm();
  const { reconnect } = useAuth();
  const [successText, setSuccessText] = useState<string | null>(null);

  const onSubmit = useCallback(
    async (data: { name: string }) => {
      form.clearErrors();
      setSuccessText(null);
      try {
        await registerPasskeyAction(email, data.name);
        form.reset();
        setSuccessText("PASSKEY_REGISTER_SUCCESS");
      } catch (error) {
        if (error instanceof Error) {
          form.setError("root", { message: error.message });
          if (
            error.message !== "PASSKEY_ERROR" &&
            error.message !== "PASSKEY_ALREADY_EXISTS"
          )
            reconnect();
        } else form.setError("root", { message: "" });
      }
    },
    [email, form, setSuccessText, reconnect]
  );

  return (
    <div className="flex w-full grow justify-center items-center py-4">
      <Form
        form={form}
        handleSubmit={form.handleSubmit(onSubmit)}
        buttonLabel={t("BUTTON")}
        successText={successText ? t(successText) : undefined}
      >
        <h3 className="text-lg font-bold">{t("TITLE")}</h3>
        <p className="text-sm text-gray-400">{t("DESCRIPTION")}</p>

        <Input
          id="passkey-name"
          label={t("NAME_LABEL")}
          type="text"
          {...form.register("name")}
          focusOnMount
          error={
            form.formState.errors.name?.message &&
            errorT.getError(form.formState.errors.name?.message)
          }
        />
      </Form>
    </div>
  );
}
