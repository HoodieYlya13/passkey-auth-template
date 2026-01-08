import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
import {
  getPasskeyLoginOptionsAction,
  verifyPasskeyLoginAction,
} from "./login.passkey.actions";
import {
  getPasskeyRegistrationOptionsAction,
  verifyPasskeyRegistrationAction,
} from "./register.passkey.actions";

import { baseClientAction } from "@/actions/base.client.actions";
import { ERROR_CODES } from "@/utils/errors";

export async function loginPasskeyAction() {
  return await baseClientAction(
    "loginPasskeyAction",
    async () => {
      const options = await getPasskeyLoginOptionsAction();

      const asseResp = await startAuthentication({ optionsJSON: options });

      return await verifyPasskeyLoginAction(asseResp);
    },
    {
      fallback: ERROR_CODES.PASSKEY.ERROR_LOGIN,
    }
  );
}

export async function registerPasskeyAction(
  email: string,
  passkeyName: string
) {
  return await baseClientAction(
    "registerPasskeyAction",
    async () => {
      const options = await getPasskeyRegistrationOptionsAction(
        email,
        passkeyName
      );

      const attResp = await startRegistration({ optionsJSON: options });

      return await verifyPasskeyRegistrationAction(attResp, email, passkeyName);
    },
    {
      fallback: ERROR_CODES.PASSKEY.ERROR_REGISTER,
      overrides: {
        InvalidStateError: ERROR_CODES.PASSKEY.ALREADY_EXISTS,
      },
    }
  );
}
