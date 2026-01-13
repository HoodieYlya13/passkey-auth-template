import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUpdatePasskeyNameSchema,
  UpdatePasskeyNameValues,
} from "@/schemas/updatePasskeyNameFormSchema";

export function useUpdatePasskeyNameForm(
  passkeyName?: string,
  existingNames: string[] = []
) {
  const form = useForm<UpdatePasskeyNameValues>({
    resolver: zodResolver(
      createUpdatePasskeyNameSchema(passkeyName, existingNames)
    ),
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
