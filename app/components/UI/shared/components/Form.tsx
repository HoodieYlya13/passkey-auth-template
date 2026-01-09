import React, { useEffect } from "react";
import { useState } from "react";
import SubmitButton from "../elements/SubmitButton";
import {
  UseFormReturn,
  FieldValues,
  useWatch,
  useFormState,
} from "react-hook-form";
import { toast } from "sonner";
import { useErrors } from "@/hooks/useErrors";
import { useCommon } from "@/hooks/useCommon";
import { ERROR_CODES } from "@/utils/errors";

interface FormProps<T extends FieldValues> {
  children: React.ReactNode;
  form: UseFormReturn<T>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  buttonLabel: string;
  successText: string | null;
}

export default function Form<T extends FieldValues>({
  children,
  form,
  handleSubmit,
  buttonLabel,
  successText,
}: FormProps<T>) {
  const { errorT } = useErrors();
  const { commonT } = useCommon();
  const [isCoolingDown, setIsCoolingDown] = useState(false);

  const { control } = form;
  const { isSubmitting, isSubmitted, errors, isValid } = useFormState({
    control,
  });
  const values = useWatch({ control });

  const rootErrors = errors.root?.message;

  const buttonError =
    isSubmitted && !isValid && !rootErrors && !successText
      ? errorT(ERROR_CODES.CORRECT_FIELDS_BEFORE_SUBMIT)
      : undefined;

  const isFormEmpty = Object.values(values || {}).every((value) => !value);

  const buttonDisabled =
    isSubmitting || isFormEmpty || (isSubmitted && !isValid) || isCoolingDown;

  useEffect(() => {
    if (rootErrors) toast.error(errorT(rootErrors));
    if (successText) toast.success(successText);
  }, [rootErrors, successText, errorT]);

  const handleSubmitWithCooldown = (e: React.FormEvent<HTMLFormElement>) => {
    if (isCoolingDown) return e.preventDefault();
    setIsCoolingDown(true);
    setTimeout(() => {
      setIsCoolingDown(false);
    }, 1000);
    handleSubmit(e);
  };

  return (
    <form
      onSubmit={handleSubmitWithCooldown}
      className="flex flex-col liquid-glass p-8 sm:p-10 md:p-12 rounded-4xl sm:rounded-[3rem] md:rounded-[3.5rem] shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl gap-6 z-10 custom-shadow"
    >
      {children}

      <SubmitButton
        label={isSubmitting ? commonT("") : buttonLabel}
        error={buttonError}
        disabled={buttonDisabled}
      />

      {rootErrors && (
        <p className="text-red-500 text-shadow-md">{errorT(rootErrors)}</p>
      )}
    </form>
  );
}
