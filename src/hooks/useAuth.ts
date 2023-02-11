import { useUpdateUserDoc } from "api/user/updateUserDoc";
import { onAuthStateChanged, UserInfo } from "firebase/auth";
import { useEffect, useState } from "react";
import { UserDocument } from "types/User.type";
import { firebaseAuth } from "../config/firebase.config";

export enum AUTH_STATE {
  LOADING,
  UNAUTHENTICATED,
  AUTHENTICATED,
}

export function useAuth() {
  const [authState, setAuthState] = useState<AUTH_STATE>(AUTH_STATE.LOADING);
  const [user, setUser] = useState<UserInfo>();

  const { updateUserDoc } = useUpdateUserDoc();

  useEffect(() => {
    onAuthStateChanged(
      firebaseAuth,
      (user) => {
        if (user) {
          const userDoc: UserDocument = {
            displayName: user.displayName ?? "",
            photoURL: user.photoURL ?? undefined,
          };

          updateUserDoc({ uid: user.uid, user: userDoc }).catch((e) => {});
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
