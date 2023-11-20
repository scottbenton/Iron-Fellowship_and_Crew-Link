import { firebaseAuth } from "config/firebase.config";
import { onSnapshot, setDoc } from "firebase/firestore";
import { StoredOracle } from "types/Oracles.type";
import { getUsersCustomOracleDoc } from "./_getRef";

export function listenToCustomOracles(
  uid: string,
  onCustomOracles: (oracles: StoredOracle[]) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError: (error: any) => void
) {
  return onSnapshot(
    getUsersCustomOracleDoc(uid),
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        onCustomOracles(
          data.oracleOrder.map((oracleId) => data.oracles[oracleId])
        );
      } else if (uid === firebaseAuth.currentUser?.uid) {
        setDoc(getUsersCustomOracleDoc(uid), {
          oracles: {},
          oracleOrder: [],
        });
      } else {
        onCustomOracles([]);
      }
    },
    (error) => onError(error)
  );
}
