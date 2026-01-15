"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Input from "@/app/components/UI/shared/elements/Input";
import Form from "@/app/components/UI/shared/components/Form";
import { useUpdateUsernameForm } from "@/hooks/forms/useUpdateUsernameForm";
import { useRouter } from "next/navigation";
import { updateUsernameAction } from "@/actions/user/user.actions";
import { useErrors } from "@/hooks/useErrors";
import { useAuth } from "@/hooks/useAuth";
import { useFormState } from "react-hook-form";
import { tryCatch } from "@/utils/errors.utils";

interface UserNameProps {
  username?: string;
}

export default function UserName({ username }: UserNameProps) {
  const t = useTranslations("PROFILE.USERNAME");
  const { errorT } = useErrors();
  const form = useUpdateUsernameForm(username);
  const [successText, setSuccessText] = useState<string | null>(null);
  const router = useRouter();
  const { shouldReconnect } = useAuth();

  const { handleSubmit, register, control, setError, clearErrors } = form;
  const { errors } = useFormState({ control });

  const onSubmit = async (data: { username: string }) => {
    clearErrors();
    setSuccessText(null);

    const [error] = await tryCatch(updateUsernameAction(data.username));

    if (error) {
      setError("root", { message: error.message });

      shouldReconnect(error);

      return;
    }

    setSuccessText(t("USERNAME_UPDATED"));
    router.push("/profile");
  };

  return (
    <div className="flex w-full grow justify-center items-center py-4">
      <Form
        form={form}
        handleSubmit={handleSubmit(onSubmit)}
        buttonLabel={t("UPDATE")}
        successText={successText}
      >
        <h3 className="text-lg font-bold">{t("TITLE")}</h3>
        <p className="text-sm text-gray-400">{t("DESCRIPTION")}</p>

        <Input
          id="username"
          label={t("NAME_LABEL")}
          type="text"
          {...register("username")}
          focusOnMount
          error={errors.username?.message && errorT(errors.username?.message)}
        />
      </Form>
    </div>
  );
}
