import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUpdateUsernameSchema,
  UpdateUsernameValues,
} from "@/schemas/updateUsernameFormSchema";

export function useUpdateUsernameForm(username?: string) {
  const form = useForm<UpdateUsernameValues>({
    resolver: zodResolver(createUpdateUsernameSchema(username)),
    defaultValues: {
      username,
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  return {
    ...form,
  };
}
