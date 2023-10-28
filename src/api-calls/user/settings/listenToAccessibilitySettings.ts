import { onSnapshot } from "firebase/firestore";
import { IAccessibilitySettings } from "types/UserAccessibilitySettings.type";
import { getUserAccessibilitySettingsDoc } from "./_getRef";

export const listenToAccessibilitySettings = (
  uid: string,
  onSettings: (settings: IAccessibilitySettings) => void
) => {
  return onSnapshot(getUserAccessibilitySettingsDoc(uid), (snapshot) => {
    onSettings(snapshot.data() ?? {});
  });
};
