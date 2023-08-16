import { arrayUnion, updateDoc } from "firebase/firestore";
import { encodeDataswornId } from "functions/dataswornIdEncoder";
import { StoredOracle } from "types/Oracles.type";
import { getUsersCustomOracleDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const addCustomOracle = createApiFunction<
  {
    uid: string;
    customOracle: StoredOracle;
  },
  void
>((params) => {
  const { uid, customOracle } = params;

  return new Promise((resolve, reject) => {
    const encodedId = encodeDataswornId(customOracle.$id);
    updateDoc(getUsersCustomOracleDoc(uid), {
      [`oracles.${encodedId}`]: customOracle,
      oracleOrder: arrayUnion(encodedId),
    })
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to create custom oracle.");
