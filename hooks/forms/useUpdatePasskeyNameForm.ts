import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUpdatePasskeyNameSchema,
  UpdatePasskeyNameValues,
} from "@/schemas/updatePasskeyNameFormSchema";

export function useUpdatePasskeyNameForm(passkeyName?: string) {
  const form = useForm<UpdatePasskeyNameValues>({
    resolver: zodResolver(createUpdatePasskeyNameSchema(passkeyName)),
    defaultValues: {
      passkeyName,
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  return {
    ...form,
  };
}
