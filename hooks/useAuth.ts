import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/actions/auth/logout/logout.actions";

export const useAuth = () => {
  const router = useRouter();

  const logout = useCallback(async () => {
    try {
      await logoutAction();
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      router.refresh();
    }
  }, [router]);

  const reconnect = useCallback(async () => {
    try {
      await logoutAction();
    } catch (e) {
      console.error("Reconnect failed", e);
    } finally {
      router.push("/auth");
    }
  }, [router]);

  return {
    logout,
    reconnect,
  };
};
