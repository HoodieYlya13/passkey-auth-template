"use client";

import { useState } from "react";
import Input from "../../../UI/shared/elements/Input";
import { useTranslations } from "next-intl";
import Form from "../../../UI/shared/components/Form";
import { useUpdatePasskeyNameForm } from "@/hooks/forms/useUpdatePasskeyNameForm";
import { useAuth } from "@/hooks/useAuth";
import { registerPasskeyAction } from "@/actions/auth/passkey/client.paskey.actions";
import { useErrors } from "@/hooks/useErrors";
import { useFormState } from "react-hook-form";
import { ERROR_CODES } from "@/utils/errors";
import { tryCatch } from "@/utils/tryCatch";

interface PasskeyRegistrationProps {
  email: string;
}

export default function PasskeyRegistration({
  email,
}: PasskeyRegistrationProps) {
  const t = useTranslations("PROFILE.PASSKEY");
  const { errorT } = useErrors();
  const form = useUpdatePasskeyNameForm();
  const { reconnect } = useAuth();
  const [successText, setSuccessText] = useState<string | undefined>(undefined);

  const { handleSubmit, register, control, setError, clearErrors, reset } =
    form;
  const { errors } = useFormState({ control });

  const onSubmit = async (data: { name: string }) => {
    clearErrors();
    setSuccessText(undefined);

    const [, error] = await tryCatch(registerPasskeyAction(email, data.name));

    if (error) {
      setError("root", { message: error.message });

      if (
        error.message !== ERROR_CODES.PASSKEY.ERROR_REGISTER &&
        error.message !== ERROR_CODES.PASSKEY.ALREADY_EXISTS
      ) reconnect();

      return;
    }

    reset();
    setSuccessText(t("PASSKEY_REGISTER_SUCCESS"));
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
          {...register("name")}
          focusOnMount
          error={errors.name?.message && errorT(errors.name?.message)}
        />
      </Form>
    </div>
  );
}
