import { Unsubscribe } from "firebase/firestore";
import { useEffect } from "react";
import { useStore } from "stores/store";

export function useListenToNotes() {
  const campaignId = useStore(
    (store) => store.campaigns.currentCampaign.currentCampaignId
  );
  const characterId = useStore(
    (store) => store.characters.currentCharacter.currentCharacterId
  );

  const openNoteId = useStore((store) => store.notes.openNoteId);

  const subscribe = useStore((store) => store.notes.subscribe);
  const subscribeToNoteContent = useStore(
    (store) => store.notes.subscribeToNoteContent
  );

  useEffect(() => {
    const unsubscribe = subscribe(campaignId, characterId);

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [campaignId, characterId, subscribe]);

  useEffect(() => {
    let unsubscribe: Unsubscribe;

    if (openNoteId) {
      subscribeToNoteContent(openNoteId);
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [openNoteId, subscribeToNoteContent]);
}
