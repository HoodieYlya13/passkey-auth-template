import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginTestingModeSchema, LoginTestingModeValues } from "@/schemas/authTestingModeSchema";

export function useAuthTestingModeForm() {
  const form = useForm<LoginTestingModeValues>({
    resolver: zodResolver(LoginTestingModeSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  return {
    ...form,
  };
}