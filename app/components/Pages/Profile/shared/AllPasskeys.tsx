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
        <p className="text-gray-400">{t("NO_PASSKEYS")}</p>
      ) : (
        <div className="flex flex-col gap-2">
          {passkeys.map((passkey) => (
            <div
              key={passkey.id}
              className={clsx("flex items-center justify-between p-3 rounded-lg liquid-glass custom-shadow", {
                "opacity-50": passkey.pending,
              })}
            >
              <div className="flex flex-col">
                <span className="font-medium">{passkey.name}</span>
                <span className="text-xs text-gray-400">
                  {format.dateTime(new Date(passkey.createdAt), {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setEditingId(passkey.id)}
                  className="text-sm text-blue-600 font-medium hover:underline"
                >
                  {t("RENAME")}
                </button>

                <button
                  onClick={() => deletePasskey(passkey.id)}
                  className="text-sm text-red-600 font-medium hover:underline"
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
