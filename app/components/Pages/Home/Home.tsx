import { useTranslations } from "next-intl";
import { APP_NAME } from "@/utils/config/config.client";

export default function Home() {
  const t = useTranslations("HOME_PAGE");

  return (
    <div className="flex min-h-fullscreen flex-col items-center justify-center pt-20">
      <h1 className="text-3xl font-semibold">
        {t("META.TITLE", { name: APP_NAME })}
      </h1>
    </div>
  );
}
