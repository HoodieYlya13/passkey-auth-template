import PageLayout from "../../../components/UI/PageLayout/PageLayout";
import {
  getServerCookie,
  getUserAccessToken,
} from "@/utils/cookies/cookiesServer";
import { redirect } from "next/navigation";
import UserName from "@/app/components/Pages/Profile/UserName/UserName";

export default async function ProfilePage() {
  const token = await getUserAccessToken();
  if (!token) redirect("/auth");

  const username = await getServerCookie("user_name");

  return (
    <PageLayout>
      <UserName username={username} />
    </PageLayout>
  );
}
