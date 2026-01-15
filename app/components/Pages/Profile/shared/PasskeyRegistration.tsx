"use client";

import { useState } from "react";
import Input from "../../../UI/shared/elements/Input";
import { useTranslations } from "next-intl";
import Form from "../../../UI/shared/components/Form";
import { useUpdatePasskeyNameForm } from "@/hooks/forms/useUpdatePasskeyNameForm";
import { useAuth } from "@/hooks/useAuth";
import { useErrors } from "@/hooks/useErrors";
import { Controller, useFormState } from "react-hook-form";

interface PasskeyRegistrationProps {
  addPasskey: (passkeyName: string) => Promise<{ error: Error | null }>;
  existingNames: string[];
}

export default function PasskeyRegistration({
  addPasskey,
  existingNames,
}: PasskeyRegistrationProps) {
  const t = useTranslations("PROFILE.PASSKEY");
  const { errorT } = useErrors();
  const form = useUpdatePasskeyNameForm(undefined, existingNames);
  const { verifySession } = useAuth();
  const [successText, setSuccessText] = useState<string | null>(null);

  const { handleSubmit, control, setError, clearErrors, reset } = form;
  const { errors } = useFormState({ control });

  const onSubmit = async (data: { passkeyName: string }) => {
    clearErrors();
    setSuccessText(null);

    const { error } = await addPasskey(data.passkeyName);

    if (error) {
      setError("root", { message: error.message });

      verifySession(error);

      return;
    }

    setSuccessText(t("PASSKEY_REGISTER_SUCCESS"));
    reset({ passkeyName: "" });
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

        <Controller
          name="passkeyName"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              id="passkey-name"
              label={t("NAME_LABEL")}
              type="text"
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              ref={ref}
              focusOnMount
              error={
                errors.passkeyName?.message &&
                errorT(errors.passkeyName?.message)
              }
            />
          )}
        />
      </Form>
    </div>
  );
}
