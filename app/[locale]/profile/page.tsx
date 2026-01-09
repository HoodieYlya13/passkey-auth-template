import PageLayout from "../../components/UI/PageLayout/PageLayout";
import {
  getServerCookie,
  getUserAccessToken,
} from "@/utils/cookies/cookies.server";
import { redirect } from "next/navigation";
import Profile from "@/app/components/Pages/Profile/Profile";
import MagicLinkToast from "@/app/components/Pages/Auth/MagicLink/MagicLinkToast";

export default async function ProfilePage() {
  const token = await getUserAccessToken();
  if (!token) redirect("/auth");

  const email = await getServerCookie("user_email");

  return (
    <PageLayout>
      <MagicLinkToast />
      <Profile email={email} />
    </PageLayout>
  );
}
