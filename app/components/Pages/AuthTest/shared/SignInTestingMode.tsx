import { useTranslations } from "next-intl";
import { useErrors } from "@/hooks/useErrors";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { LoginTestingModeValues } from "@/schemas/authTestingModeSchema";
import Input from "@/app/components/UI/shared/elements/Input";

interface SignInTestingModeProps {
  register: UseFormRegister<LoginTestingModeValues>;
  errors: FieldErrors<LoginTestingModeValues>;
}

export default function SignInTestingMode({
  register,
  errors,
}: SignInTestingModeProps) {
  const t = useTranslations("AUTH");
  const errorT = useErrors();

  return (
    <Input
      type="password"
      label={t("PASSWORD")}
      {...register("password")}
      error={
        errors.password?.message && errorT.getError(errors.password.message)
      }
      autoComplete="current-password"
      id="password"
      focusOnMount
    />
  );
}
