import PageLayout from "../../components/UI/PageLayout/PageLayout";
import { getServerCookie } from "@/utils/cookies/cookies.server";
import { redirect } from "next/navigation";
import Profile from "@/app/components/Pages/Profile/Profile";
import MagicLinkToast from "@/app/components/Pages/Auth/MagicLink/MagicLinkToast";
import { getUserPasskeysAction } from "@/actions/auth/passkey/management.passkey.actions";

export default async function ProfilePage() {
  const username = await getServerCookie("user_name");
  if (!username) redirect("/profile/user-name"); // TODO: remove this at some point because handled in the proxy

  const passkeys = await getUserPasskeysAction(); // TODO: create a handler to reconnect

  // const [error, passkeys] = await tryCatch(getUserPasskeysAction()); // TODO: create a handler to reconnect

  // if (error) reconnect(); // TODO: create a handler to reconnect on the server if auth error

  return (
    <PageLayout>
      <MagicLinkToast />
      <Profile username={username} passkeys={passkeys} />
    </PageLayout>
  );
}
