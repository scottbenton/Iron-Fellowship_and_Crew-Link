import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { firebaseAuth } from "config/firebase.config";
import { setDoc, updateDoc } from "firebase/firestore";
import { encodeDataswornId } from "functions/dataswornIdEncoder";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { getUserOracleSettingsDoc } from "./_getRef";

export const updatePinnedOracle: ApiFunction<
  { oracleId: string; pinned: boolean },
  boolean
> = function (params) {
  const { oracleId, pinned } = params;
  const uid = firebaseAuth.currentUser?.uid;

  return new Promise((resolve, reject) => {
    if (!uid) {
      reject(new UserNotLoggedInException());
      return;
    }

    const encodedId = encodeDataswornId(oracleId);
    updateDoc(
      getUserOracleSettingsDoc(uid),
      //@ts-ignore
      {
        [`pinnedOracleSections.${encodedId}`]: pinned,
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
    updatePinnedOracle: (params: { oracleId: string; pinned: boolean }) =>
      call(params),
    loading,
    error,
  };
}
