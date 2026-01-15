import { useRouter } from "next/navigation";
import {
  deleteUserSessionAction,
  logoutAction,
} from "@/actions/auth/logout/logout.actions";
import { AUTH_ERRORS, tryCatch } from "@/utils/errors.utils";

export const useAuth = () => {
  const router = useRouter();

  const logout = async () => {
    const [error] = await tryCatch(logoutAction());

    if (error) console.error("Logout failed", error);
    router.refresh();
  };

  const shouldReconnect = async (error: Error) => {
    if (AUTH_ERRORS.includes(error.message)) {
      const [deleteUserSessionError] = await tryCatch(
        deleteUserSessionAction()
      );

      if (deleteUserSessionError)
        console.error("Logout failed", deleteUserSessionError);
      router.push("/auth");
    }
  };

  return {
    logout,
    shouldReconnect,
  };
};
