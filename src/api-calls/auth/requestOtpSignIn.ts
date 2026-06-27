import { functions } from "config/firebase.config";
import { httpsCallable } from "firebase/functions";
import { GAME_SYSTEMS } from "types/GameSystems.type";

export interface RequestOtpSignInParams {
  app: GAME_SYSTEMS;
  email: string;
}

export function requestOtpSignIn(params: RequestOtpSignInParams) {
  const requestOtp = httpsCallable<
    RequestOtpSignInParams,
    { sent: true }
  >(functions, "requestOtpSignIn");

  return requestOtp(params);
}
