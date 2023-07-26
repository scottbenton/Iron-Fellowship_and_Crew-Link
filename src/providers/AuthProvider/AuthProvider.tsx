import { updateUserDoc } from "api/user/updateUserDoc";
import { firebaseAuth } from "config/firebase.config";
import { onAuthStateChanged, UserInfo } from "firebase/auth";
import { PropsWithChildren, useEffect, useState } from "react";
import { UserDocument } from "types/User.type";
import { AuthContext, AUTH_STATE } from "./AuthContext";
import { clearAnalyticsUser, setAnalyticsUser } from "config/posthog.config";
import { UserNameDialog } from "components/UserNameDialog";

export function AuthProvider(props: PropsWithChildren) {
  const { children } = props;
  const [authState, setAuthState] = useState<AUTH_STATE>(AUTH_STATE.LOADING);
  const [user, setUser] = useState<UserInfo>();

  const [userNameDialogOpen, setUserNameDialogOpen] = useState(false);

  useEffect(() => {
    onAuthStateChanged(
      firebaseAuth,
      (user) => {
        if (user) {
          if (!user.displayName) {
            setUserNameDialogOpen(true);
          }

          const userDoc: UserDocument = {
            displayName: user.displayName ?? "Unknown User",
          };

          if (user.photoURL) {
            userDoc.photoURL = user.photoURL;
          }

          setAnalyticsUser(user);
          updateUserDoc({ uid: user.uid, user: userDoc }).catch((e) => {});
          setUser(user);
          setAuthState(AUTH_STATE.AUTHENTICATED);
        } else {
          clearAnalyticsUser();
          setUser(undefined);
          setAuthState(AUTH_STATE.UNAUTHENTICATED);
        }
      },
      () => {
        clearAnalyticsUser();
        setAuthState(AUTH_STATE.UNAUTHENTICATED);
        setUser(undefined);
      }
    );
  }, []);

  return (
    <AuthContext.Provider value={{ user, state: authState }}>
      <UserNameDialog
        open={userNameDialogOpen}
        handleClose={() => setUserNameDialogOpen(false)}
      />
      {children}
    </AuthContext.Provider>
  );
}
