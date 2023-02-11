import { setDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { getUsersDoc } from "lib/firebase.lib";
import { UserDocument } from "types/User.type";

export const updateUserDoc: ApiFunction<
  { uid: string; user: UserDocument },
  boolean
> = function (params) {
  const { uid, user } = params;
  return new Promise((resolve, reject) => {
    setDoc(getUsersDoc(uid), user)
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to update user");
      });
  });
};

export function useUpdateUserDoc() {
  const { call, loading, error } = useApiState(updateUserDoc);

  return {
    updateUserDoc: call,
    loading,
    error,
  };
}
