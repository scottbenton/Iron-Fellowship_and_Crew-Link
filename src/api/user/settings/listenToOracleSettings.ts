import { onSnapshot, setDoc, Unsubscribe } from "firebase/firestore";
import { decodeDataswornId } from "functions/dataswornIdEncoder";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import { useEffect } from "react";
import { useSettingsStore } from "stores/settings.store";
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

export function useListenToOracleSettings() {
  const uid = useAuth().user?.uid;
  const { error } = useSnackbar();

  const setOracleSettings = useSettingsStore(
    (store) => store.setOracleSettings
  );

  useEffect(() => {
    let unsubscribe: Unsubscribe;

    if (uid) {
      unsubscribe = listenToOracleSettings(uid, setOracleSettings, (err) => {
        console.error(err);
        error("Failed to load oracle settings.");
      });
    } else {
      setOracleSettings(undefined);
    }

    return () => unsubscribe && unsubscribe();
  }, [uid]);
}
