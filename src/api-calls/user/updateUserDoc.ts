import { setDoc } from "firebase/firestore";
import { getUsersDoc } from "./_getRef";
import { UserDocument } from "types/User.type";
import { createApiFunction } from "api-calls/createApiFunction";

export const updateUserDoc = createApiFunction<
  { uid: string; user: UserDocument },
  void
>((params) => {
  const { uid, user } = params;
  return new Promise((resolve, reject) => {
    setDoc(getUsersDoc(uid), user, { merge: true })
      .then(() => {
        resolve();
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to update user");
      });
  });
}, "Failed to update user information.");
