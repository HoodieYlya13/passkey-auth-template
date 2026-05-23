import { Suspense } from "react";
import { getServerCookie } from "@/utils/cookies/cookies.server";
import { redirect } from "next/navigation";
import Profile from "@/app/components/Pages/Profile/Profile";
import { getUserPasskeysAction } from "@/actions/auth/passkey/management.passkey.actions";
import { AUTH_ERRORS, tryCatch } from "@/utils/errors.utils";
import Loading from "@/app/components/UI/shared/elements/Loading";

async function ProfileContent() {
  const username = await getServerCookie("user_name");
  if (!username) redirect("/profile/user-name");

  const [error, passkeys] = await tryCatch(getUserPasskeysAction());

  if (error && AUTH_ERRORS.includes(error.message))
    redirect("/auth/session-clear");

  return <Profile username={username} passkeys={passkeys ?? undefined} />;
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<Loading />}>
      <ProfileContent />
    </Suspense>
  );
}
