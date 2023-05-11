import { arrayUnion, updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { StoredMove } from "types/Moves.type";
import { useCampaignGMScreenStore } from "pages/Campaign/CampaignGMScreenPage/campaignGMScreen.store";
import { encodeDataswornId } from "functions/dataswornIdEncoder";
import { StoredOracle } from "types/Oracles.type";
import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { getUsersCustomOracleDoc } from "./_getRef";
import { useAuth } from "providers/AuthProvider";

export const addCustomOracle: ApiFunction<
  {
    uid?: string;
    customOracle: StoredOracle;
  },
  boolean
> = function (params) {
  const { uid, customOracle } = params;

  return new Promise((resolve, reject) => {
    if (!uid) {
      reject(new UserNotLoggedInException());
      return;
    }

    const encodedId = encodeDataswornId(customOracle.$id);
    updateDoc(getUsersCustomOracleDoc(uid), {
      [`oracles.${encodedId}`]: customOracle,
      oracleOrder: arrayUnion(encodedId),
    })
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to add oracle");
      });
  });
};

export function useAddCustomOracle() {
  const { call, loading, error } = useApiState(addCustomOracle);

  const uid = useAuth().user?.uid;

  return {
    addCustomOracle: (customOracle: StoredOracle) =>
      call({ uid, customOracle }),
    loading,
    error,
  };
}
