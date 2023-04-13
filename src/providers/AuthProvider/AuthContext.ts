import { UserInfo } from "firebase/auth";
import { createContext } from "react";

export enum AUTH_STATE {
  LOADING,
  UNAUTHENTICATED,
  AUTHENTICATED,
}

export interface IAuthContext {
  user?: UserInfo;
  state: AUTH_STATE;
}

export const AuthContext = createContext<IAuthContext>({
  state: AUTH_STATE.LOADING,
});
