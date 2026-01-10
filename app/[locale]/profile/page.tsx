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
  const email = await getServerCookie("user_email");
  if (!token || !email) redirect("/auth");

  const passkeys = await getUserPasskeysAction();

  return (
    <PageLayout>
      <MagicLinkToast />
      <Profile email={email} passkeys={passkeys} />
    </PageLayout>
  );
}
