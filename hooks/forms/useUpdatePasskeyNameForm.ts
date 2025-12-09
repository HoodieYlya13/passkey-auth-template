import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdatePasskeyNameSchema, UpdatePasskeyNameValues } from "@/schemas/updatePasskeyNameFormSchema";

export function useUpdatePasskeyNameForm() {
  const form = useForm<UpdatePasskeyNameValues>({
    resolver: zodResolver(UpdatePasskeyNameSchema),
  });

  return {
    ...form,
  };
}