import { Suspense } from "react";
import Auth from "../../../components/Pages/Auth/Auth";
import { getUserAccessToken } from "@/utils/cookies/cookies.server";
import { redirect } from "next/navigation";
import Loading from "@/app/components/UI/shared/elements/Loading";

async function AuthContent() {
  const token = await getUserAccessToken();
  if (token) redirect("/profile");

  return <Auth />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AuthContent />
    </Suspense>
  );
}
