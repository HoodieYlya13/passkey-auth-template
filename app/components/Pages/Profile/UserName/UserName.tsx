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
    <div className="flex-1 flex w-full justify-center items-center p-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,119,198,0.06),transparent_55%)] pointer-events-none" />

      <Form
        form={form}
        handleSubmit={handleSubmit(onSubmit)}
        buttonLabel={t("UPDATE")}
        successText={successText}
      >
        <h3 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight mb-1">{t("TITLE")}</h3>
        <p className="text-xs sm:text-sm text-foreground/70 font-medium mb-4">{t("DESCRIPTION")}</p>

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
