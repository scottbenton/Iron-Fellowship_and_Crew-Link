import { ApiFunction } from "api-calls/createApiFunction";
import { setDoc } from "firebase/firestore";
import { IAccessibilitySettings } from "types/UserAccessibilitySettings.type";
import { getUserAccessibilitySettingsDoc } from "./_getRef";

export const updateAccessibilitySettings: ApiFunction<
  { uid: string; settings: Partial<IAccessibilitySettings> },
  void
> = (params) => {
  const { uid, settings } = params;
  return setDoc(getUserAccessibilitySettingsDoc(uid), settings, {
    merge: true,
  });
};
