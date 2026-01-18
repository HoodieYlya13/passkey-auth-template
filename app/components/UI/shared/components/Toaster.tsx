"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Suspense, useContext, useEffect } from "react";
import { toast, Toaster as Sonner, type ToasterProps } from "sonner";
import { ThemeProviderContext } from "./ThemeProvider";
import { useSearchParams, useRouter } from "next/navigation";
import { useCommon } from "@/hooks/useCommon";
import { useErrors } from "@/hooks/useErrors";

function ToastLogic() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { commonT } = useCommon();
  const { errorT } = useErrors();

  useEffect(() => {
    const username = searchParams.get("username");
    const error = searchParams.get("error");

    if (username || error) {
      if (username) toast.success(commonT("HELLO", username));

      if (error) toast.error(errorT(error));

      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("username");
      newParams.delete("error");

      router.replace(`?${newParams.toString()}`, { scroll: false });
    }
  }, [searchParams, commonT, errorT, router]);

  return null;
}

export const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useContext(ThemeProviderContext);

  return (
    <>
      <Sonner
        theme={theme as ToasterProps["theme"]}
        className="toaster group"
        icons={{
          success: <CircleCheckIcon className="size-4" />,
          info: <InfoIcon className="size-4" />,
          warning: <TriangleAlertIcon className="size-4" />,
          error: <OctagonXIcon className="size-4" />,
          loading: <Loader2Icon className="size-4 animate-spin" />,
        }}
        richColors
        position="top-center"
        {...props}
      />
      <Suspense fallback={null}>
        <ToastLogic />
      </Suspense>
    </>
  );
};
