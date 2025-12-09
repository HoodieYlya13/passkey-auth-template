"use client";

import { useTranslations } from "next-intl";
import SignInTestingMode from "./shared/SignInTestingMode";
import Form from "../../UI/shared/components/Form";
import { useAuthTestingModeForm } from "@/hooks/forms/useAuthTestingModeForm";
import { useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { loginTestingModeAction } from "@/actions/auth/testing-mode/auth.testing.mode.actions";

export default function AuthTestingMode() {
  const t = useTranslations("AUTH");
  const router = useRouter();
  const form = useAuthTestingModeForm();

  const onSubmit = useCallback(
    async (data: { password: string }) => {
      form.clearErrors();
      try {
        await loginTestingModeAction(data.password);
        router.push("/");
        toast.success(t("ACCESS_GRANTED"));
      } catch (error) {
        if (error instanceof Error) {
          form.setError(
            error.message === "PASSWORD_INCORRECT" ? "password" : "root",
            {
              message: error.message,
            }
          );
        } else {
          form.setError("root", { message: "" });
        }
      }
    },
    [form, router, t]
  );

  return (
    <section className="flex flex-1 w-full items-center justify-center p-4">
      <Form
        form={form}
        handleSubmit={form.handleSubmit(onSubmit)}
        buttonLabel={t("LOGIN")}
      >
        <SignInTestingMode
          register={form.register}
          errors={form.formState.isSubmitted ? form.formState.errors : {}}
        />
      </Form>
    </section>
  );
}
