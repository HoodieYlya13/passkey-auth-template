"use client";

import { useTranslations } from "next-intl";
import Input from "../../UI/shared/elements/Input";
import Form from "../../UI/shared/components/Form";
import { useAuthTestingModeForm } from "@/hooks/forms/useAuthTestingModeForm";
import { useRouter } from "next/navigation";
import { loginTestingModeAction } from "@/actions/auth/testing-mode/auth.testing.mode.actions";
import { useErrors } from "@/hooks/useErrors";
import { useFormState } from "react-hook-form";
import { useState } from "react";
import { ERROR_CODES, tryCatch } from "@/utils/errors.utils";

export default function AuthTestingMode() {
  const t = useTranslations("AUTH");
  const { errorT } = useErrors();
  const router = useRouter();
  const form = useAuthTestingModeForm();

  const [successText, setSuccessText] = useState<string | null>(null);

  const { handleSubmit, register, control, setError, clearErrors } = form;
  const { errors } = useFormState({
    control,
  });

  const onSubmit = async (data: { password: string }) => {
    clearErrors();
    setSuccessText(null);

    const [error] = await tryCatch(loginTestingModeAction(data.password));

    if (error)
      return setError(
        error.message === ERROR_CODES.PASSWORD.INCORRECT ? "password" : "root",
        {
          message: error.message,
        }
      );

    setSuccessText(t("ACCESS_GRANTED"));
    router.push("/");
  };

  return (
    <section className="flex flex-1 w-full items-center justify-center p-4">
      <Form
        form={form}
        handleSubmit={handleSubmit(onSubmit)}
        buttonLabel={t("LOGIN")}
        successText={successText}
      >
        <Input
          id="password"
          type="password"
          label={t("PASSWORD")}
          {...register("password")}
          error={errors.password?.message && errorT(errors.password.message)}
          autoComplete="current-password"
          focusOnMount
        />
      </Form>
    </section>
  );
}
