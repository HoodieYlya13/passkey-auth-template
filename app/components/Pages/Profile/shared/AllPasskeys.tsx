"use client";

import { useState } from "react";
import { useTranslations, useFormatter } from "next-intl";
import { Passkey } from "@/models/passkey.models";
import RenamePasskeyModal from "./RenamePasskeyModal";
import clsx from "clsx";

interface AllPasskeysProps {
  passkeys: Passkey[];
  renamePasskey: (
    id: string,
    newName: string
  ) => Promise<{ error: Error | null }>;
  deletePasskey: (id: string) => void;
}

export default function AllPasskeys({
  passkeys,
  renamePasskey,
  deletePasskey,
}: AllPasskeysProps) {
  const t = useTranslations("PROFILE.PASSKEY");
  const format = useFormatter();

  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      <h3 className="text-lg font-bold">{t("PASSKEY_LIST_TITLE")}</h3>

      {editingId && (
        <RenamePasskeyModal
          id={editingId}
          currentName={
            passkeys.find((passkey) => passkey.id === editingId)?.name || ""
          }
          renamePasskey={renamePasskey}
          onClose={() => setEditingId(null)}
          existingNames={passkeys.map((passkey) => passkey.name)}
        />
      )}

      {!passkeys || passkeys.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 font-medium">{t("NO_PASSKEYS")}</p>
      ) : (
        <div className="flex flex-col gap-2">
          {passkeys.map((passkey) => (
            <div
              key={passkey.id}
              className={clsx("flex items-center justify-between py-3 px-4 rounded-xl liquid-glass border liquid-glass-border-color custom-shadow", {
                "opacity-50": passkey.pending,
              })}
            >
              <div className="flex flex-col">
                <span className="font-semibold text-sm sm:text-base text-foreground">{passkey.name}</span>
                <span className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                  {format.dateTime(new Date(passkey.createdAt), {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setEditingId(passkey.id)}
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors cursor-pointer"
                >
                  {t("RENAME")}
                </button>

                <button
                  onClick={() => deletePasskey(passkey.id)}
                  className="text-xs sm:text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold transition-colors cursor-pointer"
                >
                  {t("DELETE")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
