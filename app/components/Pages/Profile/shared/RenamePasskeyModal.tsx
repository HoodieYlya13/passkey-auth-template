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

interface RenamePasskeyModalProps {
  id: string;
  currentName: string;
  renamePasskey: (
    id: string,
    newName: string
  ) => Promise<{ error: Error | null }>;
  onClose: () => void;
  existingNames: string[];
}

export default function RenamePasskeyModal({
  id,
  currentName,
  renamePasskey,
  onClose,
  existingNames,
}: RenamePasskeyModalProps) {
  const t = useTranslations("PROFILE.PASSKEY");
  const { errorT } = useErrors();
  const form = useUpdatePasskeyNameForm(currentName, existingNames);
  const [successText, setSuccessText] = useState<string | null>(null);
  const { verifySession } = useAuth();

  const { handleSubmit, register, control, setError, clearErrors } = form;
  const { errors } = useFormState({ control });

  const onSubmit = async (data: { passkeyName: string }) => {
    clearErrors();
    const { error } = await renamePasskey(id, data.passkeyName);

    if (error) {
      setError("root", { message: error.message });

      verifySession(error);

      return;
    }

    setSuccessText(t("RENAME_SUCCESS"));
  };

  return (
    <Form
      form={form}
      handleSubmit={handleSubmit(onSubmit)}
      buttonLabel={t("SAVE")}
      successText={successText}
      modal={{
        isOpen: !!id,
        onClose,
        ariaLabel: t("RENAME_PASSKEY_ARIA_LABEL"),
      }}
    >
      <h3 className="text-2xl font-bold text-center mb-4">{t("RENAME")}</h3>

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

      <Button type="button" onClick={onClose} child={t("CANCEL")} />
    </Form>
  );
}
