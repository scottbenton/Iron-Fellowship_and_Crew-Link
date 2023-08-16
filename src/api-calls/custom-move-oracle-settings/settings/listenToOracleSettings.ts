import { onSnapshot, setDoc } from "firebase/firestore";
import { decodeDataswornId } from "functions/dataswornIdEncoder";
import { OracleSettings } from "types/UserSettings.type";
import { getUserOracleSettingsDoc } from "./_getRef";

export function listenToOracleSettings(
  uid: string,
  onOracleSettings: (settings: OracleSettings) => void,
  onError: (error: any) => void
) {
  return onSnapshot(
    getUserOracleSettingsDoc(uid),
    (snapshot) => {
      const data = snapshot.data();
      if (data) {
        const { pinnedOracleSections } = data;
        const decodedPinnedOracleSections: { [key: string]: boolean } = {};

        if (pinnedOracleSections) {
          Object.keys(data.pinnedOracleSections ?? {}).forEach((pinnedId) => {
            decodedPinnedOracleSections[decodeDataswornId(pinnedId)] =
              pinnedOracleSections[pinnedId];
          });
        }

        onOracleSettings({ pinnedOracleSections: decodedPinnedOracleSections });
      } else {
        if (uid) {
          setDoc(getUserOracleSettingsDoc(uid), {
            pinnedOracleSections: {},
          });
        }
        onOracleSettings({});
      }
    },
    (error) => {
      console.error(error);
      onError(error);
    }
  );
}
