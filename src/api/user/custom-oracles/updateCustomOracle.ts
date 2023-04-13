import {
  arrayRemove,
  arrayUnion,
  deleteField,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { firestore } from "config/firebase.config";
import { encodeDataswornId } from "functions/dataswornIdEncoder";
import { StoredOracle } from "types/Oracles.type";
import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { useAuth } from "providers/AuthProvider";
import { getUsersCustomOracleDoc } from "./_getRef";

export const updateCustomOracle: ApiFunction<
  {
    uid?: string;
    oracleId: string;
    customOracle: StoredOracle;
  },
  boolean
> = function (params) {
  const { uid, oracleId, customOracle } = params;

  return new Promise((resolve, reject) => {
    if (!uid) {
      reject(new UserNotLoggedInException());
      return;
    }

    const encodedId = encodeDataswornId(customOracle.$id);
    if (oracleId !== customOracle.$id) {
      const oldEncodedId = encodeDataswornId(oracleId);

      const batch = writeBatch(firestore);
      batch.update(getUsersCustomOracleDoc(uid), {
        [`oracles.${encodedId}`]: customOracle,
        [`oracles.${oldEncodedId}`]: deleteField(),
        oracleOrder: arrayRemove(oldEncodedId),
      });
      batch.update(getUsersCustomOracleDoc(uid), {
        oracleOrder: arrayUnion(encodedId),
      });

      batch
        .commit()
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          console.error(err);
          reject("Failed to update custom oracle");
        });
    } else {
      updateDoc(getUsersCustomOracleDoc(uid), {
        [`oracles.${encodedId}`]: customOracle,
      })
        .then(() => {
          resolve(true);
        })
        .catch((e) => {
          console.error(e);
          reject("Failed to add track");
        });
    }
  });
};

export function useUpdateCustomOracle() {
  const { call, loading, error } = useApiState(updateCustomOracle);
  const uid = useAuth().user?.uid;

  return {
    updateCustomOracle: (oracleId: string, customOracle: StoredOracle) =>
      call({ uid, oracleId, customOracle }),
    loading,
    error,
  };
}
