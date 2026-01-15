import { useRouter } from "next/navigation";
import {
  deleteUserSessionAction,
  logoutAction,
} from "@/actions/auth/logout/logout.actions";
import { ERROR_CODES, tryCatch } from "@/utils/errors.utils";

export const useAuth = () => {
  const router = useRouter();

  const logout = async () => {
    const [error] = await tryCatch(logoutAction());

    if (error) console.error("Logout failed", error);
    router.refresh();
  };

  const verifySession = async (error: Error) => {
    const authErrors: string[] = Object.values(ERROR_CODES.AUTH);

    if (authErrors.includes(error.message)) {
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
    verifySession,
  };
};
