import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoginMagicLinkSchema,
  LoginMagicLinkValues,
} from "@/schemas/authMagicLinkFormSchema";

export function useAuthMagicLinkForm() {
  const form = useForm<LoginMagicLinkValues>({
    resolver: zodResolver(LoginMagicLinkSchema),
  });

  return {
    ...form,
  };
}
