"use client";

import { useState } from "react";
import Input from "../../../UI/shared/elements/Input";
import { useTranslations } from "next-intl";
import Form from "../../../UI/shared/components/Form";
import { useUpdatePasskeyNameForm } from "@/hooks/forms/useUpdatePasskeyNameForm";
import { useErrors } from "@/hooks/useErrors";
import { useFormState } from "react-hook-form";
import Button from "@/app/components/UI/shared/elements/Button";
import { useAuth } from "@/hooks/useAuth";
import { ERROR_CODES } from "@/utils/errors.utils";

interface RenamePasskeyFormProps {
  id: string;
  currentName: string;
  renamePasskey: (
    id: string,
    newName: string
  ) => Promise<{ error: Error | null }>;
  onCancel: () => void;
}

export default function RenamePasskeyForm({
  id,
  currentName,
  renamePasskey,
  onCancel,
}: RenamePasskeyFormProps) {
  const t = useTranslations("PROFILE.PASSKEY");
  const { errorT } = useErrors();
  const form = useUpdatePasskeyNameForm(currentName);
  const [successText, setSuccessText] = useState<string | null>(null);
  const { reconnect } = useAuth();

  const { handleSubmit, register, control, setError, clearErrors } = form;
  const { errors } = useFormState({ control });

  const onSubmit = async (data: { passkeyName: string }) => {
    clearErrors();
    const { error } = await renamePasskey(id, data.passkeyName);

    if (error) {
      setError("root", { message: error.message });

      const authErrors: string[] = Object.values(ERROR_CODES.AUTH);

      if (authErrors.includes(error.message)) reconnect();

      return;
    }

    setSuccessText(t("RENAME_SUCCESS"));
    // onCancel();
  };

  return (
    <Form
      form={form}
      handleSubmit={handleSubmit(onSubmit)}
      buttonLabel={t("SAVE")}
      successText={successText}
    >
      <Input
        id={`rename-${id}`}
        label={t("RENAME_PLACEHOLDER")}
        type="text"
        {...register("passkeyName")}
        focusOnMount
        error={
          errors.passkeyName?.message && errorT(errors.passkeyName?.message)
        }
      />

      <Button type="button" onClick={onCancel} child={t("CANCEL")} />
    </Form>
  );
}
