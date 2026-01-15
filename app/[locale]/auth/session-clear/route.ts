import { deleteUserSessionCookies } from "@/utils/cookies/cookies.server";
import { redirect } from "next/navigation";

export async function GET() {
  await deleteUserSessionCookies();
  redirect("/auth");
}
