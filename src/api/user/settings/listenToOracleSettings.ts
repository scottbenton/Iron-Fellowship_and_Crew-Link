import { addDoc, onSnapshot, setDoc, Unsubscribe } from "firebase/firestore";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import { useEffect, useState } from "react";
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
        onOracleSettings(data);
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
      listenToOracleSettings(uid, setOracleSettings, (err) => {
        console.error(err);
        error("Failed to load oracle settings.");
      });
    } else {
      setOracleSettings(undefined);
    }

    return () => unsubscribe && unsubscribe();
  }, [uid]);
}
