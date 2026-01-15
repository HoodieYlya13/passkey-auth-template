"use client";

import clsx from "clsx";
import { ReactNode } from "react";

interface BottomModalProps {
  title: string;
  description: ReactNode;
  actions: ReactNode;
  isVisible: boolean;
  className?: string;
}

export default function BottomModal({
  title,
  description,
  actions,
  isVisible,
  className,
}: BottomModalProps) {
  if (!isVisible) return null;

  return (
    <div
      className={clsx(
        "fixed bottom-5 right-5 z-50 bg-background/90 p-6 rounded-xl shadow-2xl border liquid-glass-border-color custom-shadow flex flex-col gap-4 max-w-sm animate-in slide-in-from-bottom-5 fade-in duration-300",
        className
      )}
    >
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-lg">{title}</h3>
        <div className="text-sm text-gray-600">{description}</div>
      </div>
      <div className="flex gap-3">{actions}</div>
    </div>
  );
}
