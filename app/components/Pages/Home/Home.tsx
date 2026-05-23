import { getTranslations } from "next-intl/server";
import { APP_NAME } from "@/utils/config/config.client";
import { getServerCookie } from "@/utils/cookies/cookies.server";
import Link from "next/link";

function ShieldIcon() {
  return (
    <svg className="size-8 text-foreground mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg className="size-8 text-foreground mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.02 5.912 4.75 4.75 0 01-1.286-.53L7.5 16.52l-2.286 2.286a.75.75 0 01-1.06 0l-1.144-1.144a.75.75 0 010-1.06l2.258-2.258a4.752 4.752 0 01-.507-1.284 6 6 0 016.512-6.512M18 9h.008v.008H18V9z" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg className="size-8 text-foreground mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  );
}

export default async function Home() {
  const t = await getTranslations("HOME_PAGE");
  const username = await getServerCookie("user_name");

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 md:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,119,198,0.08),transparent_50%)] pointer-events-none" />

      <div className="w-full max-w-4xl flex flex-col items-center gap-12 z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 border border-foreground/10 text-xs sm:text-sm text-foreground/80 backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          {t("META.TITLE", { name: APP_NAME })}
        </div>

        <div className="flex flex-col gap-4 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/75 bg-clip-text text-transparent leading-none pb-1">
            {t("HERO.TITLE")}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-foreground/75 font-medium">
            {t("HERO.DESCRIPTION")}
          </p>
        </div>

        <div>
          {username ? (
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm text-foreground/60 font-medium">
                {t.rich("CTA.SIGNED_IN_AS", {
                  username,
                  important: (chunks) => <span className="text-foreground font-semibold">{chunks}</span>,
                })}
              </p>
              <Link
                href="/profile"
                className="inline-flex items-center justify-center rounded-xl bg-foreground text-background font-semibold text-sm sm:text-base px-6 py-3 transition-all duration-300 hover:opacity-90 shadow-lg hover:scale-[1.02]"
              >
                {t("CTA.GO_TO_PROFILE")}
              </Link>
            </div>
          ) : (
            <Link
              href="/auth"
              className="inline-flex items-center justify-center rounded-xl bg-foreground text-background font-semibold text-sm sm:text-base px-8 py-3.5 transition-all duration-300 hover:opacity-90 shadow-lg hover:scale-[1.02]"
            >
              {t("CTA.GET_STARTED")}
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl mt-6">
          <div className="flex flex-col items-center p-6 rounded-2xl liquid-glass custom-shadow text-center transition-all duration-300 hover:scale-[1.02]">
            <ShieldIcon />
            <h3 className="text-base font-semibold text-foreground mb-2">{t("FEATURES.BIOMETRICS.TITLE")}</h3>
            <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed font-medium">
              {t("FEATURES.BIOMETRICS.DESCRIPTION")}
            </p>
          </div>

          <div className="flex flex-col items-center p-6 rounded-2xl liquid-glass custom-shadow text-center transition-all duration-300 hover:scale-[1.02]">
            <KeyIcon />
            <h3 className="text-base font-semibold text-foreground mb-2">{t("FEATURES.CRYPTOGRAPHY.TITLE")}</h3>
            <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed font-medium">
              {t("FEATURES.CRYPTOGRAPHY.DESCRIPTION")}
            </p>
          </div>

          <div className="flex flex-col items-center p-6 rounded-2xl liquid-glass custom-shadow text-center transition-all duration-300 hover:scale-[1.02]">
            <BoltIcon />
            <h3 className="text-base font-semibold text-foreground mb-2">{t("FEATURES.ENGINE.TITLE")}</h3>
            <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed font-medium">
              {t("FEATURES.ENGINE.DESCRIPTION")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
