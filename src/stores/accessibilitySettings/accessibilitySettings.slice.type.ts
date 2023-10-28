import { Unsubscribe } from "firebase/firestore";
import { IAccessibilitySettings } from "types/UserAccessibilitySettings.type";

export interface AccessibilitySettingsSliceData {
  settings: IAccessibilitySettings;
}

export interface AccessibilitySettingsSliceActions {
  listenToSettings: (uid: string) => Unsubscribe;
  updateSettings: (settings: Partial<IAccessibilitySettings>) => Promise<void>;
}

export type AccessibilitySettingsSlice = AccessibilitySettingsSliceData &
  AccessibilitySettingsSliceActions;
