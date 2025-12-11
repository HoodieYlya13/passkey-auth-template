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

export async function loginPasskeyAction() {
  return await baseClientAction(
    "loginPasskeyAction",
    async () => {
      const options = await getPasskeyLoginOptionsAction();

      const asseResp = await startAuthentication({ optionsJSON: options });

      return await verifyPasskeyLoginAction(asseResp);
    },
    {
      fallback: "PASSKEY_ERROR_LOGIN",
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
      fallback: "PASSKEY_ERROR_REGISTER",
      overrides: {
        InvalidStateError: "PASSKEY_ALREADY_EXISTS",
      },
    }
  );
}
