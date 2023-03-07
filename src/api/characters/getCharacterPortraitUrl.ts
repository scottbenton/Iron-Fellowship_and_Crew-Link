import { ApiFunction } from "hooks/useApiState";
import { getImageUrl } from "lib/storage.lib";
import { constructCharacterPortraitPath } from "./_getRef";

export const getCharacterPortraitUrl: ApiFunction<
  {
    uid: string;
    characterId: string;
    filename: string;
  },
  string
> = function (params) {
  const { uid, characterId, filename } = params;
  return new Promise((resolve, reject) => {
    getImageUrl(constructCharacterPortraitPath(uid, characterId, filename))
      .then((url) => resolve(url))
      .catch((e) => {
        console.error(e);
        reject(e);
      });
  });
};
