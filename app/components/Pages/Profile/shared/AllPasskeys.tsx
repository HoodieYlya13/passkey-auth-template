"use client";

import { useState, useOptimistic, startTransition } from "react";
import { useTranslations, useFormatter } from "next-intl";
import { renamePasskeyAction } from "@/actions/auth/passkey/management.passkey.actions";
import { tryCatch } from "@/utils/tryCatch";
import { Passkey } from "@/models/passkey.models";

interface AllPasskeysProps {
  passkeys?: Passkey[];
}

export default function AllPasskeys({ passkeys }: AllPasskeysProps) {
  const t = useTranslations("PROFILE.PASSKEY");
  const format = useFormatter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [optimisticPasskeys, setOptimisticPasskey] = useOptimistic(
    passkeys || [],
    (state: Passkey[], { id, name }: { id: string; name: string }) =>
      state.map((pk) => (pk.id === id ? { ...pk, name } : pk))
  );

  const handleRename = (id: string) => {
    startTransition(async () => {
      setOptimisticPasskey({ id, name: newName });
      const [, error] = await tryCatch(renamePasskeyAction(id, newName));
      if (!error) {
        setEditingId(null);
        setNewName("");
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      <h3 className="text-lg font-bold">{t("PASSKEY_LIST_TITLE")}</h3>
      {!optimisticPasskeys || optimisticPasskeys.length === 0 ? (
        <p className="text-gray-400">{t("NO_PASSKEYS")}</p>
      ) : (
        <div className="flex flex-col gap-2">
          {optimisticPasskeys.map((pk) => (
            <div
              key={pk.id}
              className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            >
              {editingId === pk.id ? (
                <div className="flex gap-2 w-full">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="flex-1 px-2 py-1 border rounded"
                    placeholder={t("RENAME_PLACEHOLDER")}
                  />
                  <button
                    onClick={() => handleRename(pk.id)}
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
                    <span className="font-medium">{pk.name || "Untitled"}</span>
                    <span className="text-xs text-gray-400">
                      {format.dateTime(new Date(pk.createdAt), {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setEditingId(pk.id);
                      setNewName(pk.name || "");
                    }}
                    className="text-sm text-blue-600 font-medium hover:underline"
                  >
                    {t("RENAME")}
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
