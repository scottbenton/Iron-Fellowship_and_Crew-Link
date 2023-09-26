import { arrayRemove, arrayUnion, setDoc, updateDoc } from "firebase/firestore";
import { getCampaignSettingsDoc, getCharacterSettingsDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";
import { SettingsDoc } from "types/Settings.type";

export const updateSettings = createApiFunction<
  {
    campaignId?: string;
    characterId?: string;
    settings: Partial<SettingsDoc>;
    useUpdate?: boolean;
  },
  void
>((params) => {
  const { campaignId, characterId, settings, useUpdate } = params;

  return new Promise((resolve, reject) => {
    if (!campaignId && !characterId) {
      reject(new Error("Either character or campaign ID must be defined."));
      return;
    }

    (useUpdate
      ? updateDoc(
          campaignId
            ? getCampaignSettingsDoc(campaignId)
            : getCharacterSettingsDoc(characterId as string),
          settings
        )
      : setDoc(
          campaignId
            ? getCampaignSettingsDoc(campaignId)
            : getCharacterSettingsDoc(characterId as string),
          settings,
          { merge: true }
        )
    )
      .then(() => resolve())
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to update settings.");
