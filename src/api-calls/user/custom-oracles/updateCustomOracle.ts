import {
  arrayRemove,
  arrayUnion,
  deleteField,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { firestore } from "config/firebase.config";
import { encodeDataswornId } from "functions/dataswornIdEncoder";
import { StoredOracle } from "types/Oracles.type";
import { getUsersCustomOracleDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const updateCustomOracle = createApiFunction<
  {
    uid: string;
    oracleId: string;
    customOracle: StoredOracle;
  },
  void
>((params) => {
  const { uid, oracleId, customOracle } = params;

  return new Promise((resolve, reject) => {
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
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    } else {
      updateDoc(getUsersCustomOracleDoc(uid), {
        [`oracles.${encodedId}`]: customOracle,
      })
        .then(() => {
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    }
  });
}, "Failed to update custom oracle.");
