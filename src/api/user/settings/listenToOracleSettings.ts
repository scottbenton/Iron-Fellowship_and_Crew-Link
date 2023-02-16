import { onSnapshot, Unsubscribe } from "firebase/firestore";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import { useEffect, useState } from "react";
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
        onOracleSettings({});
      }
    },
    (error) => {
      onError(error);
    }
  );
}

export function useListenToOracleSettings() {
  const uid = useAuth().user?.uid;
  const { error } = useSnackbar();

  const [settings, setSettings] = useState<OracleSettings>();

  useEffect(() => {
    let unsubscribe: Unsubscribe;

    if (uid) {
      listenToOracleSettings(uid, setSettings, (err) => {
        console.error(err);
        error("Failed to load oracle settings.");
      });
    } else {
      setSettings(undefined);
    }

    return () => unsubscribe && unsubscribe();
  }, [uid]);

  return { settings };
}
