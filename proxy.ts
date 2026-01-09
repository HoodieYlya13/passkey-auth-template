import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { DEFAULT_LOCALE, TESTING_MODE } from "./utils/config/config.client";
import { SUPPORTED_LOCALES } from "./i18n/utils";
import { getProxyCookie, setProxyCookie } from "./utils/cookies/cookies.proxy";

const intlMiddleware = createMiddleware(routing);

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  let res: NextResponse = NextResponse.next();

  const isTesting = TESTING_MODE === "true";

  res = intlMiddleware(req);

  const isAuthorized = getProxyCookie(req, "isAuthorized");
  if (isTesting && !pathname.endsWith("/auth-testing-mode") && !isAuthorized) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/auth-testing-mode";
    return NextResponse.redirect(redirectUrl);
  }

  if ((!isTesting || isAuthorized) && pathname.endsWith("/auth-testing-mode")) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/";
    return NextResponse.redirect(redirectUrl);
  }

  const userAccessToken = getProxyCookie(req, "user_access_token");
  if (userAccessToken) {
    const userName = getProxyCookie(req, "user_name");
    if (!userName && !pathname.endsWith("/profile/user-name")) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/profile/user-name";
      return NextResponse.redirect(redirectUrl);
    }
  }

  const pathLocale = pathname.split("/")[1];
  let preferredLocale = getProxyCookie(req, "preferred_locale");

  if (!preferredLocale) {
    const acceptLang = req.headers.get("accept-language");
    const browserLocale =
      acceptLang?.split(",")[0]?.split("-")[0]?.trim() || DEFAULT_LOCALE;
    const isSupportedLocale =
      browserLocale &&
      (SUPPORTED_LOCALES as readonly string[]).includes(browserLocale);
    if (isSupportedLocale)
      setProxyCookie(res, "preferred_locale", browserLocale, {
        httpOnly: false,
      });

    preferredLocale = browserLocale;
  }

  if (
    pathLocale &&
    (SUPPORTED_LOCALES as readonly string[]).includes(pathLocale) &&
    preferredLocale &&
    pathLocale !== preferredLocale
  ) {
    setProxyCookie(res, "locale_mismatch", pathLocale, {
      httpOnly: false,
    });
  }

  return res;
}

export const config = {
  matcher: ["/api/:path*", "/((?!_next|_vercel|.*\\..*).*)"],
};
