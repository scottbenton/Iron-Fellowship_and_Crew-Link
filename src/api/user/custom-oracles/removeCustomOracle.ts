import { CampaignNotFoundException } from "api/error/CampaignNotFoundException";
import { arrayRemove, deleteField, updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { getUsersCustomOracleDoc } from "./_getRef";
import { encodeDataswornId } from "functions/dataswornIdEncoder";
import { useAuth } from "hooks/useAuth";

export const removeCustomOracle: ApiFunction<
  {
    uid?: string;
    oracleId: string;
  },
  boolean
> = function (params) {
  const { uid, oracleId } = params;

  return new Promise((resolve, reject) => {
    if (!uid) {
      reject(new CampaignNotFoundException());
      return;
    }
    const encodedId = encodeDataswornId(oracleId);
    updateDoc(getUsersCustomOracleDoc(uid), {
      [`oracles.${encodedId}`]: deleteField(),
      oracleOrder: arrayRemove(encodedId),
    })
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to remove custom oracle");
      });
  });
};

export function useRemoveCustomOracle() {
  const { call, loading, error } = useApiState(removeCustomOracle);
  const uid = useAuth().user?.uid;

  return {
    removeCustomOracle: (oracleId: string) => call({ uid, oracleId }),
    loading,
    error,
  };
}
