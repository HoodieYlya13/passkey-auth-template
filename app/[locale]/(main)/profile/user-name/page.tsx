import { Suspense } from "react";
import { getServerCookie } from "@/utils/cookies/cookies.server";
import UserName from "@/app/components/Pages/Profile/UserName/UserName";
import Loading from "@/app/components/UI/shared/elements/Loading";

async function UserNameContent() {
  const username = await getServerCookie("user_name");

  return <UserName username={username} />;
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<Loading />}>
      <UserNameContent />
    </Suspense>
  );
}
