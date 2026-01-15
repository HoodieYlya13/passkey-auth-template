import PageLayout from "../../../components/UI/PageLayout/PageLayout";
import { getServerCookie } from "@/utils/cookies/cookies.server";
import UserName from "@/app/components/Pages/Profile/UserName/UserName";

export default async function ProfilePage() {
  const username = await getServerCookie("user_name");

  return (
    <PageLayout>
      <UserName username={username} />
    </PageLayout>
  );
}
