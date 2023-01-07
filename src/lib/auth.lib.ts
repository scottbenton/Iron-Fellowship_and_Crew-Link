import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseAuth } from "../config/firebase.config";

const googleAuthProvider = new GoogleAuthProvider();

export function loginWithGoogle() {
  return new Promise((resolve, reject) => {
    signInWithPopup(firebaseAuth, googleAuthProvider)
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error("e");
        reject(e);
      });
  });
}
