import PageLayout from "../../components/UI/PageLayout/PageLayout";
import Auth from "../../components/Pages/Auth/Auth";
import { getUserAccessToken } from "@/utils/cookies/cookies.server";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const token = await getUserAccessToken();
  if (token) redirect("/");

  return (
    <PageLayout>
      <Auth />
    </PageLayout>
  );
}
