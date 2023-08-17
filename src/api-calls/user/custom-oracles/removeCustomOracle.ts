import { arrayRemove, deleteField, updateDoc } from "firebase/firestore";
import { getUsersCustomOracleDoc } from "./_getRef";
import { encodeDataswornId } from "functions/dataswornIdEncoder";
import { createApiFunction } from "api-calls/createApiFunction";

export const removeCustomOracle = createApiFunction<
  {
    uid: string;
    oracleId: string;
  },
  void
>((params) => {
  const { uid, oracleId } = params;

  return new Promise((resolve, reject) => {
    const encodedId = encodeDataswornId(oracleId);
    updateDoc(getUsersCustomOracleDoc(uid), {
      [`oracles.${encodedId}`]: deleteField(),
      oracleOrder: arrayRemove(encodedId),
    })
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to remove custom oracle.");
