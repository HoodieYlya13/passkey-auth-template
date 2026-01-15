import { useRouter } from "next/navigation";
import { logoutAction } from "@/actions/auth/logout/logout.actions";
import { tryCatch } from "@/utils/errors.utils";

export const useAuth = () => {
  const router = useRouter();

  const logout = async () => {
    const [error] = await tryCatch(logoutAction());
    
    if (error) console.error("Logout failed", error);
    router.refresh();
  };

  const reconnect = async () => { // TODO: reconnect in the server action
    const [error] = await tryCatch(logoutAction());

    if (error) console.error("Reconnect failed", error);
    router.push("/auth");
  };

  return {
    logout,
    reconnect,
  };
};
