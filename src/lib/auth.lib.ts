import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { setDoc } from "firebase/firestore";
import { firebaseAuth } from "../config/firebase.config";
import { getUsersDoc } from "./firebase.lib";

const googleAuthProvider = new GoogleAuthProvider();

export function loginWithGoogle() {
  return new Promise((resolve, reject) => {
    signInWithPopup(firebaseAuth, googleAuthProvider)
      .then((data) => {
        // handles updating the users collection with user info
        const { displayName, photoURL, uid } = data.user;

        const userDoc = {
          displayName,
          photoURL,
        };

        setDoc(getUsersDoc(uid), userDoc)
          .then(() => {
            resolve(true);
          })
          .catch((e) => {
            console.error(e);
            reject(e);
          });
      })
      .catch((e) => {
        console.error("e");
        reject(e);
      });
  });
}

export async function logout() {
  await signOut(firebaseAuth);
}
