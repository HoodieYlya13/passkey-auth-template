import PageLayout from "../../components/UI/PageLayout/PageLayout";
import {
  getServerCookie,
  getUserAccessToken,
} from "@/utils/cookies/cookies.server";
import { redirect } from "next/navigation";
import Profile from "@/app/components/Pages/Profile/Profile";
import MagicLinkToast from "@/app/components/Pages/Auth/MagicLink/MagicLinkToast";
import { getUserPasskeysAction } from "@/actions/auth/passkey/management.passkey.actions";

export default async function ProfilePage() {
  const token = await getUserAccessToken();
  if (!token) redirect("/auth");

  const username = await getServerCookie("user_name");
  if (!username) redirect("/profile/user-name");

  const passkeys = await getUserPasskeysAction();

  return (
    <PageLayout>
      <MagicLinkToast />
      <Profile username={username} passkeys={passkeys} />
    </PageLayout>
  );
}
