import { useTranslations } from "next-intl";
import { APP_NAME } from "@/utils/config";

export default function Home() {
  const t = useTranslations("HOME_PAGE");

  return (
    <div className="flex grow flex-col items-center justify-center bg-background text-foreground pt-20 md:pt-30">
      <h1 className="text-3xl font-semibold">
        {t("META.TITLE", { name: APP_NAME })}
      </h1>
    </div>
  );
}
