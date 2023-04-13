import { updateUserDoc } from "api/user/updateUserDoc";
import { firebaseAuth } from "config/firebase.config";
import { onAuthStateChanged, UserInfo } from "firebase/auth";
import { PropsWithChildren, useEffect, useState } from "react";
import { UserDocument } from "types/User.type";
import { AuthContext, AUTH_STATE } from "./AuthContext";

export function AuthProvider(props: PropsWithChildren) {
  const { children } = props;
  const [authState, setAuthState] = useState<AUTH_STATE>(AUTH_STATE.LOADING);
  const [user, setUser] = useState<UserInfo>();

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

  return (
    <AuthContext.Provider value={{ user, state: authState }}>
      {children}
    </AuthContext.Provider>
  );
}
