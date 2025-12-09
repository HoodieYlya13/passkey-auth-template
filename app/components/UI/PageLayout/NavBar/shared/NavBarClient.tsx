"use client";

import Image from "next/image";
import Link from "next/link";
import Logout from "./Logout";
import { APP_NAME } from "@/utils/config";
import LocaleSwitcher from "./LocaleSwitcher";
import { LocaleLanguages } from "@/i18n/utils";
import ThemeSwitcher from "./ThemeSwitcher";

function MyAccountIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="currentColor"
    >
      <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" />
    </svg>
  );
}

interface NavBarClientProps {
  locale: LocaleLanguages;
  localeMismatch?: LocaleLanguages;
  token?: string;
}

export default function NavBarClient({
  locale,
  localeMismatch,
  token,
}: NavBarClientProps) {
  return (
    <nav className="w-full flex items-center justify-between px-4 bg-background">
      <Link href="/" className="flex items-center gap-2 md:gap-3">
        <Image
          src="/favicon.ico"
          alt="Logo"
          width={40}
          height={40}
          className="size-10 md:size-15"
          priority
        />
        <span>{APP_NAME}</span>
      </Link>

      <div className="flex items-center gap-2">
        <ThemeSwitcher />

        <LocaleSwitcher storedLocale={locale} localeMismatch={localeMismatch} />

        <Link href={token ? "/profile" : "/auth"}>
          <MyAccountIcon />
        </Link>

        {token && <Logout />}
      </div>
    </nav>
  );
}
