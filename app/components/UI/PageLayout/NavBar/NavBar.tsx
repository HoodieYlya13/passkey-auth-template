import NavBarClient from "./shared/NavBarClient";
import { getLocaleMismatch, getUserAccessToken } from "@/utils/cookies/cookies.server";
import { LocaleLanguages } from "@/i18n/utils";

interface NavBarProps {
  locale: LocaleLanguages;
}

export default async function NavBar({ locale }: NavBarProps) {
  const token = await getUserAccessToken();
  const localeMismatch = await getLocaleMismatch();

  return (
    <header className="fixed w-full z-20 h-(--nav-height) backdrop-blur-md liquid-glass-background border-b liquid-glass-border-color shadow-xl flex">
      <NavBarClient
        locale={locale}
        localeMismatch={localeMismatch}
        token={token}
      />
    </header>
  );
}
