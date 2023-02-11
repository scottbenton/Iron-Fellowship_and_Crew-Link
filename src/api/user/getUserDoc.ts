import { getDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { getUsersDoc } from "lib/firebase.lib";
import { UserDocument } from "types/User.type";

export const getUserDoc: ApiFunction<{ uid: string }, UserDocument> = function (
  params
) {
  const { uid } = params;

  return new Promise((resolve, reject) => {
    getDoc(getUsersDoc(uid))
      .then((snapshot) => {
        const user = snapshot.data();
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
};

export function useGetUserDoc() {
  const { call, data, loading, error } = useApiState(getUserDoc);

  return {
    getUserDoc: call,
    data,
    loading,
    error,
  };
}
