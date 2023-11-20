import {
  GoogleAuthProvider,
  isSignInWithEmailLink,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signInWithPopup,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import { firebaseAuth } from "../config/firebase.config";
import { BASE_ROUTES, basePaths } from "routes";
import { getErrorMessage } from "functions/getErrorMessage";

const googleAuthProvider = new GoogleAuthProvider();

export function loginWithGoogle() {
  return new Promise((resolve, reject) => {
    signInWithPopup(firebaseAuth, googleAuthProvider)
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject(e);
      });
  });
}

export function sendMagicEmailLink(
  email: string,
  name?: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const actionCodeSettings = {
      url: window.location.origin + basePaths[BASE_ROUTES.LOGIN],
      handleCodeInApp: true,
    };

    sendSignInLinkToEmail(firebaseAuth, email, actionCodeSettings)
      .then(() => {
        window.localStorage.setItem("auth-email", email);
        if (name) {
          window.localStorage.setItem("auth-name", name);
        }
        resolve(true);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
}

export function completeMagicLinkSignupIfPresent(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (isSignInWithEmailLink(firebaseAuth, window.location.href)) {
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      let email = window.localStorage.getItem("auth-email");
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt("Please provide your email for confirmation");
      }
      if (email) {
        // The client SDK will parse the code from the link for you.
        signInWithEmailLink(firebaseAuth, email, window.location.href)
          .then((result) => {
            // Clear email from storage.
            window.localStorage.removeItem("auth-email");
            const name = window.localStorage.getItem("auth-name");
            if (name) {
              updateProfile(result.user, { displayName: name });
            }
            window.localStorage.removeItem("auth-name");
            resolve(true);
          })
          .catch((error) => {
            console.error(error);
            reject(
              getErrorMessage(
                error,
                "Error signing in from email link. Please try again."
              )
            );
          });
      } else {
        reject("Failed to get your email for sign in.");
      }
    } else {
      resolve(true);
    }
  });
}

export async function logout() {
  await signOut(firebaseAuth);
}

export function getUser(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      (error) => {
        console.error(error);
        unsubscribe();
        resolve(null);
      }
    );
  });
}

export function updateUserName(name: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const user = firebaseAuth.currentUser;
    if (!user) {
      reject(new Error("User is not logged in."));
      return;
    }
    updateProfile(user, { displayName: name })
      .then(() => resolve())
      .catch((e) => {
        console.error(e);
        reject("Failed to update user name.");
      });
  });
}
