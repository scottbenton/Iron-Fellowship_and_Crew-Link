import { CreateSliceType } from "stores/store.type";
import { AccessibilitySettingsSlice } from "./accessibilitySettings.slice.type";
import { defaultAccessibilitySettingsSlice } from "./accessibilitySettings.slice.default";
import { updateAccessibilitySettings } from "api-calls/user/settings/updateAccessibilitySettings";
import { listenToAccessibilitySettings } from "api-calls/user/settings/listenToAccessibilitySettings";
export const createAccessibilitySettingsSlice: CreateSliceType<
  AccessibilitySettingsSlice
> = (set, getState) => ({
  ...defaultAccessibilitySettingsSlice,

  listenToSettings: (uid) => {
    return listenToAccessibilitySettings(uid, (settings) => {
      set((store) => {
        store.accessibilitySettings.settings = settings;
      });
    });
  },

  updateSettings: (settings) => {
    const uid = getState().auth.uid;
    return updateAccessibilitySettings({ uid, settings });
  },
});
