"use client";

import { useState } from "react";
import Input from "../../../UI/shared/elements/Input";
import { useTranslations } from "next-intl";
import Form from "../../../UI/shared/components/Form";
import { useUpdatePasskeyNameForm } from "@/hooks/forms/useUpdatePasskeyNameForm";
import { useAuth } from "@/hooks/useAuth";
import { useErrors } from "@/hooks/useErrors";
import { useFormState } from "react-hook-form";
import { ERROR_CODES } from "@/utils/errors.utils";

interface PasskeyRegistrationProps {
  addPasskey: (passkeyName: string) => Promise<{ error: Error | null }>;
}

export default function PasskeyRegistration({
  addPasskey,
}: PasskeyRegistrationProps) {
  const t = useTranslations("PROFILE.PASSKEY");
  const { errorT } = useErrors();
  const form = useUpdatePasskeyNameForm();
  const { reconnect } = useAuth();
  const [successText, setSuccessText] = useState<string | null>(null);

  const { handleSubmit, register, control, setError, clearErrors, reset } =
    form;
  const { errors } = useFormState({ control });

  const onSubmit = async (data: { passkeyName: string }) => {
    clearErrors();
    setSuccessText(null);

    const { error } = await addPasskey(data.passkeyName);

    if (error) {
      setError("root", { message: error.message });

      if (
        error.message !== ERROR_CODES.PASSKEY.ERROR_REGISTER &&
        error.message !== ERROR_CODES.PASSKEY.ALREADY_EXISTS
      )
        reconnect();

      return;
    }

    setSuccessText(t("PASSKEY_REGISTER_SUCCESS"));
    reset();
  };

  return (
    <div className="flex w-full grow justify-center items-center py-4">
      <Form
        form={form}
        handleSubmit={handleSubmit(onSubmit)}
        buttonLabel={t("BUTTON")}
        successText={successText}
      >
        <h3 className="text-lg font-bold">{t("TITLE")}</h3>
        <p className="text-sm text-gray-400">{t("DESCRIPTION")}</p>

        <Input
          id="passkey-name"
          label={t("NAME_LABEL")}
          type="text"
          {...register("passkeyName")}
          focusOnMount
          error={
            errors.passkeyName?.message && errorT(errors.passkeyName?.message)
          }
        />
      </Form>
    </div>
  );
}
