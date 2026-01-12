"use client";

import { useState } from "react";
import { useTranslations, useFormatter } from "next-intl";
import { Passkey } from "@/models/passkey.models";

interface AllPasskeysProps {
  passkeys: Passkey[];
  renamePasskey: (id: string, newName: string) => void;
  deletePasskey: (id: string) => void;
  // renamePasskey: (
  //   id: string,
  //   newName: string
  // ) => Promise<{ error: Error | null }>;
  // deletePasskey: (id: string) => Promise<{ error: Error | null }>;
}

export default function AllPasskeys({
  passkeys,
  renamePasskey,
  deletePasskey,
}: AllPasskeysProps) {
  const t = useTranslations("PROFILE.PASSKEY");
  const format = useFormatter();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  const handleRenameSubmit = (id: string) => {
    renamePasskey(id, newName);
    setEditingId(null);
    setNewName("");
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      <h3 className="text-lg font-bold">{t("PASSKEY_LIST_TITLE")}</h3>

      {!passkeys || passkeys.length === 0 ? (
        <p className="text-gray-400">{t("NO_PASSKEYS")}</p>
      ) : (
        <div className="flex flex-col gap-2">
          {passkeys.map((passkey) => (
            <div
              key={passkey.id}
              className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            >
              {editingId === passkey.id ? (
                <div className="flex gap-2 w-full">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="flex-1 px-2 py-1 border rounded"
                    placeholder={t("RENAME_PLACEHOLDER")}
                    autoFocus
                  />
                  <button
                    onClick={() => handleRenameSubmit(passkey.id)}
                    className="text-sm text-green-600 font-medium hover:underline"
                  >
                    {t("SAVE")}
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-sm text-gray-500 font-medium hover:underline"
                  >
                    {t("CANCEL")}
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {passkey.name || "Untitled"}
                    </span>
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
                      onClick={() => {
                        setEditingId(passkey.id);
                        setNewName(passkey.name || "");
                      }}
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
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
