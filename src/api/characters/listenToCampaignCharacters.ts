import { onSnapshot, Unsubscribe } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getErrorMessage } from "../../functions/getErrorMessage";
import { useSnackbar } from "../../hooks/useSnackbar";
import { getCharacterDoc } from "./_getRef";
import { useCampaignStore } from "../../stores/campaigns.store";
import { CharacterDocument } from "../../types/Character.type";
import { useCampaignGMScreenStore } from "pages/Campaign/CampaignGMScreenPage/campaignGMScreen.store";
import { UserDocument } from "types/User.type";
import { getUserDoc } from "api/user/getUserDoc";
import { useMiscDataStore } from "stores/miscData.store";

interface Params {
  characterIdList: { characterId: string; uid: string }[] | undefined;
  onDocChange: (id: string, character?: CharacterDocument) => void;
  onCharacterUserDocument?: (id: string, userDocument: UserDocument) => void;
  onError: (error: any) => void;
}

export function listenToCampaignCharacters(params: Params): Unsubscribe[] {
  const { characterIdList, onDocChange, onCharacterUserDocument, onError } =
    params;

  const unsubscribes = (characterIdList || []).map((character, index) => {
    if (onCharacterUserDocument) {
      getUserDoc({ uid: character.uid })
        .then((userDoc) => {
          onCharacterUserDocument(character.uid, userDoc);
        })
        .catch(() => {});
    }
    return onSnapshot(
      getCharacterDoc(character.uid, character.characterId),
      (snapshot) => {
        const characterDoc = snapshot.data();
        onDocChange(character.characterId, characterDoc);
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

  const setUserDoc = useMiscDataStore((store) => store.setUserDoc);

  const { error } = useSnackbar();

  useEffect(() => {
    let unsubscribes: Unsubscribe[];
    // TODO - figure out how to refactor this to remove this call to set
    // It causes a flash where all characters are removed.
    setCampaignCharacters({});
    unsubscribes = listenToCampaignCharacters({
      characterIdList: characters,
      onDocChange: (id, doc) =>
        setCampaignCharacters((prevCharacters) => {
          let newCharacters = { ...prevCharacters };
          if (doc) {
            newCharacters[id] = doc;
          } else {
            delete newCharacters[id];
          }
          return newCharacters;
        }),
      onCharacterUserDocument: (playerId, playerDocument) =>
        setUserDoc(playerId, playerDocument),
      onError: (err) => {
        console.error(err);
        const errorMessage = getErrorMessage(
          error,
          "Failed to load characters"
        );
        error(errorMessage);
      },
    });

    return () => {
      unsubscribes?.forEach((unsubscribe) => unsubscribe());
    };
  }, [characters]);

  return campaignCharacters;
}

export function useCampaignGMScreenListenToCampaignCharacters() {
  const { error } = useSnackbar();

  const campaignId = useCampaignGMScreenStore((store) => store.campaignId);
  const characters = useCampaignStore(
    (store) => store.campaigns[campaignId ?? ""]?.characters
  );

  const updateCharacter = useCampaignGMScreenStore(
    (store) => store.updateCharacter
  );
  const removeCharacter = useCampaignGMScreenStore(
    (store) => store.removeCharacter
  );
  const setUserDoc = useMiscDataStore((store) => store.setUserDoc);

  useEffect(() => {
    let unsubscribes = listenToCampaignCharacters({
      characterIdList: characters,
      onDocChange: (id, doc) => {
        if (doc) {
          updateCharacter(id, doc);
        } else {
          removeCharacter(id);
        }
      },
      onCharacterUserDocument: (playerId, playerDocument) =>
        setUserDoc(playerId, playerDocument),
      onError: (err) => {
        console.error(err);
        const errorMessage = getErrorMessage(
          error,
          "Failed to load characters"
        );
        error(errorMessage);
      },
    });

    return () => {
      unsubscribes?.forEach((unsubscribe) => unsubscribe());
    };
  }, [characters]);
}
