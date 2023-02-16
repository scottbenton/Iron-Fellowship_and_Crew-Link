import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { firebaseAuth } from "config/firebase.config";
import { setDoc, updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { getUserOracleSettingsDoc } from "./_getRef";

export const updatePinnedOracle: ApiFunction<
  { oracleName: string; pinned: boolean },
  boolean
> = function (params) {
  const { oracleName, pinned } = params;
  const uid = firebaseAuth.currentUser?.uid;

  return new Promise((resolve, reject) => {
    if (!uid) {
      reject(new UserNotLoggedInException());
      return;
    }

    console.debug(oracleName, pinned);

    updateDoc(
      getUserOracleSettingsDoc(uid),
      //@ts-ignore
      {
        [`pinnedOracleSections.${oracleName}`]: pinned,
      },
      { merge: true }
    )
      .then(() => resolve(true))
      .catch((e) => reject(e));
  });
};

export function useUpdatePinnedOracle() {
  const { call, loading, error } = useApiState(updatePinnedOracle);

  return {
    updatePinnedOracle: (params: { oracleName: string; pinned: boolean }) =>
      call(params),
    loading,
    error,
  };
}
