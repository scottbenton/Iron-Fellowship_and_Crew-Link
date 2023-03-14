import { ApiFunction } from "hooks/useApiState";
import { getImageUrl } from "lib/storage.lib";
import { useEffect } from "react";
import { useCharacterPortraitStore } from "stores/characterPortrait.store";
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

export function useListenToCharacterPortraitUrl(
  uid: string,
  characterId: string,
  filename?: string
) {
  const setUrl = useCharacterPortraitStore((store) => store.setPortraitUrl);

  useEffect(() => {
    if (filename) {
      getCharacterPortraitUrl({ uid, characterId, filename })
        .then((url) => {
          setUrl(characterId, url);
        })
        .catch((e) => {});
    } else {
      setUrl(characterId, undefined);
    }
  }, [uid, characterId, filename]);
}
