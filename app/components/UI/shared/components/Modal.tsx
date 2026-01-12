"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  ariaLabel: string;
  childrenOnly?: boolean;
  title?: string;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  ariaLabel,
  childrenOnly,
  title,
}: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      <div
        className="absolute inset-0 bg-background/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {childrenOnly ? (
        children
      ) : (
        <div className="relative flex flex-col items-center justify-center w-full max-w-lg liquid-glass rounded-3xl p-6 sm:p-8 custom-shadow animate-in fade-in zoom-in-95 duration-1000">
          {title && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-center">{title}</h3>
            </div>
          )}

          {children}
        </div>
      )}
    </div>,
    document.body
  );
}
