import PageLayout from "../../components/UI/PageLayout/PageLayout";
import {
  getServerCookie,
  getUserAccessToken,
} from "@/utils/cookies/cookiesServer";
import { redirect } from "next/navigation";
import Profile from "@/app/components/Pages/Profile/Profile";

export default async function ProfilePage() {
  const token = await getUserAccessToken();
  if (!token) redirect("/auth");

  const email = await getServerCookie("user_email");

  return (
    <PageLayout>
      <Profile email={email} />
    </PageLayout>
  );
}
