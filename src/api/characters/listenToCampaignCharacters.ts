import { onSnapshot, Unsubscribe } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getErrorMessage } from "../../functions/getErrorMessage";
import { useSnackbar } from "../../hooks/useSnackbar";
import { getCharacterDoc } from "./_getRef";
import { useCampaignStore } from "../../stores/campaigns.store";
import { CharacterDocument } from "../../types/Character.type";
import { getCharacterPortraitUrl } from "./getCharacterPortraitUrl";
import { CharacterDocumentWithPortraitUrl } from "stores/character.store";

export function listenToCampaignCharacters(
  characterIdList: { characterId: string; uid: string }[] | undefined,
  onDocChange: (id: string, character?: CharacterDocument) => void,
  onPortraitUrl: (id: string, url: string) => void,
  onError: (error: any) => void
): Unsubscribe[] {
  const unsubscribes = (characterIdList || []).map((character, index) => {
    return onSnapshot(
      getCharacterDoc(character.uid, character.characterId),
      (snapshot) => {
        const characterDoc = snapshot.data();
        onDocChange(character.characterId, characterDoc);
        if (characterDoc?.profileImage?.filename) {
          getCharacterPortraitUrl({
            uid: character.uid,
            characterId: character.characterId,
            filename: characterDoc.profileImage.filename,
          })
            .then((url) => {
              onPortraitUrl(character.characterId, url);
            })
            .catch();
        }
      },
      (error) => {
        console.error(error);
        onError(new Error("Failed to fetch characters."));
      }
    );
  });
  return unsubscribes;
}

export function useListenToCampaignCharacters(campaignId?: string) {
  const characters = useCampaignStore(
    (store) => store.campaigns[campaignId ?? ""]?.characters
  );

  const [campaignCharacters, setCampaignCharacters] = useState<{
    [id: string]: CharacterDocumentWithPortraitUrl;
  }>({});

  const { error } = useSnackbar();

  useEffect(() => {
    let unsubscribes: Unsubscribe[];
    // TODO - figure out how to refactor this to remove this call to set
    // It causes a flash where all characters are removed.
    setCampaignCharacters({});
    unsubscribes = listenToCampaignCharacters(
      characters,
      (id, doc) =>
        setCampaignCharacters((prevCharacters) => {
          let newCharacters = { ...prevCharacters };
          if (doc) {
            newCharacters[id] = doc;
          } else {
            delete newCharacters[id];
          }
          return newCharacters;
        }),
      (id, url) => {
        setCampaignCharacters((prevCharacters) => {
          if (url !== prevCharacters[id].portraitUrl) {
            let newCharacters = { ...prevCharacters };
            newCharacters[id] = { ...prevCharacters[id], portraitUrl: url };
            return newCharacters;
          }
          return prevCharacters;
        });
      },
      (err) => {
        console.error(err);
        const errorMessage = getErrorMessage(
          error,
          "Failed to load characters"
        );
        error(errorMessage);
      }
    );

    return () => {
      unsubscribes?.forEach((unsubscribe) => unsubscribe());
    };
  }, [characters]);

  return campaignCharacters;
}
