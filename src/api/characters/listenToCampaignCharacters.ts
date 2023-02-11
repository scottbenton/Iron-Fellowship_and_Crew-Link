import { onSnapshot, query, Unsubscribe, where } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { getErrorMessage } from "../../functions/getErrorMessage";
import { useAuth } from "../../hooks/useAuth";
import { useSnackbar } from "../../hooks/useSnackbar";
import { getCharacterDoc } from "../../lib/firebase.lib";
import { useCampaignStore } from "../../stores/campaigns.store";
import { CharacterDocument } from "../../types/Character.type";

export function listenToCampaignCharacters(
  characterIdList: { characterId: string; uid: string }[] | undefined,
  onDocChange: (id: string, character?: CharacterDocument) => void,
  onError: (error: any) => void
): Unsubscribe[] {
  const unsubscribes = (characterIdList || []).map((character, index) => {
    return onSnapshot(
      getCharacterDoc(character.uid, character.characterId),
      (snapshot) => {
        onDocChange(character.characterId, snapshot.data());
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
    [id: string]: CharacterDocument;
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
