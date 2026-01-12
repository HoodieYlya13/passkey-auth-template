"use client";

import { useOptimistic, startTransition } from "react";
import { useTranslations } from "next-intl";
import { OptimisticPasskeyActions, Passkey } from "@/models/passkey.models";
import { registerPasskeyAction } from "@/actions/auth/passkey/client.paskey.actions";
import {
  renamePasskeyAction,
  deletePasskeyAction,
} from "@/actions/auth/passkey/management.passkey.actions";
import { tryCatch } from "@/utils/errors.utils";
import PasskeyRegistration from "./PasskeyRegistration";
import AllPasskeys from "./AllPasskeys";
import { toast } from "sonner";
import { useErrors } from "@/hooks/useErrors";

function passkeyReducer(
  state: Passkey[],
  action: OptimisticPasskeyActions
): Passkey[] {
  switch (action.type) {
    case "ADD":
      return [action.payload, ...state];
    case "DELETE":
      return state.filter((passkey) => passkey.id !== action.payload);
    case "RENAME":
      return state.map((passkey) =>
        passkey.id === action.payload.id
          ? { ...passkey, name: action.payload.newName }
          : passkey
      );
    default:
      return state;
  }
}

interface PasskeyManagerProps {
  email: string;
  initialPasskeys?: Passkey[];
}

export default function PasskeyManager({
  email,
  initialPasskeys = [],
}: PasskeyManagerProps) {
  const t = useTranslations("PROFILE.PASSKEY");
  const { errorT } = useErrors();

  const [optimisticPasskeys, dispatch] = useOptimistic(
    initialPasskeys,
    passkeyReducer
  );

  const handleAddPasskey = async (name: string) => {
    let temporaryId = crypto.randomUUID();
    while (optimisticPasskeys.some((passkey) => passkey.id === temporaryId))
      temporaryId = crypto.randomUUID();
    const temporaryPasskey: Passkey = {
      id: temporaryId,
      name: name,
      createdAt: new Date(),
    };

    return new Promise<{ error: Error | null }>(async (resolve) => {
      startTransition(async () => {
        dispatch({ type: "ADD", payload: temporaryPasskey });

        const [, error] = await tryCatch(registerPasskeyAction(email, name));

        resolve({ error });
      });
    });
  };

  const handleRenamePasskey = async (id: string, newName: string) => {
    return new Promise<{ error: Error | null }>(async (resolve) => {
      startTransition(async () => {
        dispatch({ type: "RENAME", payload: { id, newName } });

        const [, error] = await tryCatch(renamePasskeyAction(id, newName));

        resolve({ error });
      });
    });
  };

  const handleDeletePasskey = async (id: string) => {
    startTransition(async () => {
      dispatch({ type: "DELETE", payload: id });

      const [, error] = await tryCatch(deletePasskeyAction(id));

      if (error) toast.error(errorT(error.message));
      else toast.success(t("DELETE_SUCCESS"));
    });
  };

  return (
    <>
      <PasskeyRegistration addPasskey={handleAddPasskey} />

      <AllPasskeys
        passkeys={optimisticPasskeys}
        renamePasskey={handleRenamePasskey}
        deletePasskey={handleDeletePasskey}
      />
    </>
  );
}
