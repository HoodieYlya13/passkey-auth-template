"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useContext } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { ThemeProviderContext } from "./ThemeProvider";

export const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useContext(ThemeProviderContext);

  return (
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
  );
};
