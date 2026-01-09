import NavBarClient from "./shared/NavBarClient";
import { getUserAccessToken } from "@/utils/cookies/cookies.server";
import { LocaleLanguages } from "@/i18n/utils";

interface NavBarProps {
  locale: LocaleLanguages;
  localeMismatch?: LocaleLanguages;
}

export default async function NavBar({ locale, localeMismatch }: NavBarProps) {
  const token = await getUserAccessToken();

  return (
    <header className="fixed w-full z-20 h-20 backdrop-blur-md liquid-glass-background border-b liquid-glass-border-color shadow-xl flex">
      <NavBarClient
        locale={locale}
        localeMismatch={localeMismatch}
        token={token}
      />
    </header>
  );
}
