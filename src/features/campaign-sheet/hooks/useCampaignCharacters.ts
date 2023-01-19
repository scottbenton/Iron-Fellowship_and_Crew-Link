import { onSnapshot, Unsubscribe } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getCharacterDoc } from "../../../lib/firebase.lib";
import { useCampaignStore } from "../../../stores/campaigns.store";
import { CharacterDocument } from "../../../types/Character.type";

export function useCampaignCharacters(campaignId?: string) {
  const characters = useCampaignStore((store) =>
    campaignId ? store.campaigns[campaignId]?.characters : undefined
  );

  const [campaignCharacters, setCampaignCharacters] = useState<{
    [id: string]: CharacterDocument;
  }>({});

  useEffect(() => {
    let unsubscribes: Unsubscribe[] = [];

    try {
      (characters || []).forEach((character) => {
        unsubscribes.push(
          onSnapshot(
            getCharacterDoc(character.uid, character.characterId),
            (snapshot) => {
              setCampaignCharacters((prevCharacters) => {
                let newCharacters = { ...prevCharacters };
                const character = snapshot.data();
                if (character) {
                  newCharacters[snapshot.id] = character;
                }
                return newCharacters;
              });
            }
          )
        );
      });
    } catch (e) {
      console.error(e);
    }

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [characters]);

  return campaignCharacters;
}
