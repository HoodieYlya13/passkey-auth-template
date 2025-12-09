"use server";

import { checkRateLimit } from "@/utils/rateLimit";
import {
  deleteServerUserCookies,
  getUserAccessToken,
} from "@/utils/cookies/cookiesServer";

export async function logoutAction() {
  await checkRateLimit("authLogout");

  const userAccessToken = await getUserAccessToken();

  if (userAccessToken) // TODO: delete the cookie in the backend too

  await deleteServerUserCookies();
}
