import { functions } from "config/firebase.config";
import { httpsCallable } from "firebase/functions";

export interface VerifyOtpSignInParams {
  code: string;
  email: string;
  name?: string;
}

export function verifyOtpSignIn(params: VerifyOtpSignInParams) {
  const verifyOtp = httpsCallable<
    VerifyOtpSignInParams,
    { token: string }
  >(functions, "verifyOtpSignIn");

  return verifyOtp(params);
}
