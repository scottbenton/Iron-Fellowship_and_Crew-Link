import { ApiFunction } from "hooks/useApiState";
import { getImageUrl } from "lib/storage.lib";
import { constructCharacterPortraitPath } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const getCharacterPortraitUrl = createApiFunction<
  {
    uid: string;
    characterId: string;
    filename: string;
  },
  string
>((params) => {
  const { uid, characterId, filename } = params;
  return new Promise((resolve, reject) => {
    getImageUrl(constructCharacterPortraitPath(uid, characterId, filename))
      .then((url) => resolve(url))
      .catch((e) => {
        console.error(e);
        reject(e);
      });
  });
}, "Failed to load character portrait.");
