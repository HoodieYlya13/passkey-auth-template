import { deleteUserSessionCookies } from "@/utils/cookies/cookies.server";
import { redirect } from "next/navigation";
import { ERROR_CODES } from "@/utils/errors.utils";

export async function GET() {
  await deleteUserSessionCookies();
  redirect("/auth?error=" + ERROR_CODES.AUTH[4]);
}
