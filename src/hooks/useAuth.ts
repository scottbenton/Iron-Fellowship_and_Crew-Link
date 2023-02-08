import { onAuthStateChanged, UserInfo } from "firebase/auth";
import { setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firebaseAuth } from "../config/firebase.config";
import { getUsersDoc } from "../lib/firebase.lib";

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
          const userDoc = {
            displayName: user.displayName,
            photoURL: user.photoURL,
          };

          setDoc(getUsersDoc(user.uid), userDoc);

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
