import { getDoc } from "firebase/firestore";
import { getUsersDoc } from "./_getRef";
import { UserDocument } from "types/User.type";
import { createApiFunction } from "api-calls/createApiFunction";

export const getUserDoc = createApiFunction<{ uid: string }, UserDocument>(
  (params) => {
    const { uid } = params;

    return new Promise((resolve, reject) => {
      getDoc(getUsersDoc(uid))
        .then((snapshot) => {
          const user: UserDocument | undefined = snapshot.data();
          if (user) {
            resolve(user);
          } else {
            reject("User not found.");
          }
        })
        .catch((e) => {
          console.error(e);
          reject("Failed to load user.");
        });
    });
  },
  "Failed to load user information."
);
