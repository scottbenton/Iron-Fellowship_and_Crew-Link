import { onAuthStateChanged, UserInfo } from "firebase/auth";
import { useEffect, useState } from "react";
import { firebaseAuth } from "../config/firebase.config";

export enum AUTH_STATE {
  LOADING,
  UNAUTHENTICATED,
  AUTHENTICATED,
}

export function useAuth() {
  const [authState, setAuthState] = useState<AUTH_STATE>(AUTH_STATE.LOADING);
  const [user, setUser] = useState<UserInfo>();

  useEffect(() => {
    onAuthStateChanged(
      firebaseAuth,
      (user) => {
        if (user) {
          setUser(user);
          setAuthState(AUTH_STATE.AUTHENTICATED);
        } else {
          setUser(undefined);
          setAuthState(AUTH_STATE.UNAUTHENTICATED);
        }
      },
      () => {
        setAuthState(AUTH_STATE.UNAUTHENTICATED);
        setUser(undefined);
      }
    );
  }, []);

  return { authState, user };
}
