import { useCharacterSheetStore } from "pages/Character/CharacterSheetPage/characterSheet.store";
import { Unsubscribe } from "firebase/auth";
import { Bytes, onSnapshot, query, where } from "firebase/firestore";
import { useSnackbar } from "providers/SnackbarProvider/useSnackbar";
import { useCallback, useEffect, useState } from "react";
import { LoreDocument } from "types/Lore.type";
import {
  constructLoreImagePath,
  convertFromDatabase,
  getLoreCollection,
  getPrivateDetailsLoreDoc,
  getPublicNotesLoreDoc,
} from "./_getRef";
import { GMLoreDocument } from "types/Lore.type";
import { useAuth } from "providers/AuthProvider";
import { useCampaignGMScreenStore } from "pages/Campaign/CampaignGMScreenPage/campaignGMScreen.store";
import { Lore } from "stores/world.slice";
import { getImageUrl } from "lib/storage.lib";
import { useWorldSheetStore } from "pages/World/WorldSheetPage/worldSheet.store";
import { useWorldsStore } from "stores/worlds.store";

export function listenToLore(
  uid: string | undefined,
  worldOwnerId: string,
  worldId: string,
  updateLore: (loreId: string, lore: LoreDocument) => void,
  updateLoreGMProperties: (
    loreId: string,
    gmProperties: GMLoreDocument
  ) => void,
  updateLoreNotes: (loreId: string, notes: Uint8Array | null) => void,
  removeLore: (loreId: string) => void,
  onError: (error: string) => void
): Unsubscribe[] {
  const unsubscribes: Unsubscribe[] = [];

  const loreCollectionRef = getLoreCollection(worldId);
  const isWorldOwner = uid === worldOwnerId;
  unsubscribes.push(
    onSnapshot(
      isWorldOwner
        ? loreCollectionRef
        : query(loreCollectionRef, where("sharedWithPlayers", "==", true)),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "removed") {
            removeLore(change.doc.id);
          } else {
            if (change.type === "added") {
              if (isWorldOwner) {
                unsubscribes.push(
                  onSnapshot(
                    getPrivateDetailsLoreDoc(worldId, change.doc.id),
                    (doc) => {
                      const privateLoreDetails = doc.data();
                      if (privateLoreDetails) {
                        updateLoreGMProperties(
                          change.doc.id,
                          privateLoreDetails
                        );
                      }
                    },
                    (error) => {
                      console.error(error);
                      onError("Failed to get lore");
                    }
                  )
                );
              }
              unsubscribes.push(
                onSnapshot(
                  getPublicNotesLoreDoc(worldId, change.doc.id),
                  (doc) => {
                    const noteDoc = doc.data();

                    if (noteDoc?.notes) {
                      updateLoreNotes(
                        change.doc.id,
                        noteDoc.notes.toUint8Array()
                      );
                    } else {
                      updateLoreNotes(change.doc.id, null);
                    }
                  }
                )
              );
            }
            updateLore(change.doc.id, convertFromDatabase(change.doc.data()));
          }
        });
      },
      (error) => {
        console.error(error);
        onError("Failed to get lore");
      }
    )
  );

  return unsubscribes;
}

export function useListenToLore(worldOwnerId?: string, worldId?: string) {
  const { error } = useSnackbar();
  const uid = useAuth().user?.uid;

  const [lore, setLore] = useState<{
    [key: string]: Lore;
  }>({});

  const updateLoreAndLoadImage = useCallback(
    (loreId: string, lore: LoreDocument) => {
      setLore((prevLore) => {
        let newLore = { ...prevLore };
        const oldLoreDoc = newLore[loreId];
        newLore[loreId] = { ...oldLoreDoc, ...lore };
        return newLore;
      });

      const imageUrl = lore.imageFilenames?.[0];

      if (worldId && imageUrl) {
        getImageUrl(constructLoreImagePath(worldId, loreId, imageUrl)).then(
          (url) => {
            setLore((prevLore) => {
              const newLore = { ...prevLore };
              const newLoreDoc = { ...newLore[loreId] };
              newLoreDoc.imageUrls = [url];
              newLore[loreId] = newLoreDoc;
              return newLore;
            });
          }
        );
      }
    },
    [worldId]
  );

  useEffect(() => {
    let unsubscribes: Unsubscribe[];
    if (worldId && worldOwnerId) {
      unsubscribes = listenToLore(
        uid,
        worldOwnerId,
        worldId,
        (loreId, lore) => updateLoreAndLoadImage(loreId, lore),
        (loreId, gmProperties) =>
          setLore((prevLore) => {
            let newLore = { ...prevLore };
            const prevLoreDoc = newLore[loreId];
            newLore[loreId] = { ...prevLoreDoc, gmProperties };
            return newLore;
          }),
        (loreId, notes) =>
          setLore((prevLore) => {
            let newLore = { ...prevLore };
            const prevLoreDoc = newLore[loreId];
            newLore[loreId] = { ...prevLoreDoc, notes };
            return newLore;
          }),
        (loreId) =>
          setLore((prevLore) => {
            let newLore = { ...prevLore };
            delete newLore[loreId];
            return newLore;
          }),
        (err) => error(err)
      );
    } else {
      setLore({});
    }

    return () => {
      unsubscribes?.forEach((unsubscribe) => unsubscribe());
    };
  }, [uid, worldId, worldOwnerId]);

  return { lore };
}

export function useCharacterSheetListenToLore() {
  const { error } = useSnackbar();

  const uid = useAuth().user?.uid;

  const worldOwnerId = useCharacterSheetStore((store) => store.worldOwnerId);
  const worldId = useCharacterSheetStore((store) => store.worldId);

  const updateLore = useCharacterSheetStore((store) => store.updateLore);
  const updateLoreImageUrl = useCharacterSheetStore(
    (store) => store.addLoreImageURL
  );
  const updateLoreGMProperties = useCharacterSheetStore(
    (store) => store.updateLoreGMProperties
  );
  const updateLoreNotes = useCharacterSheetStore(
    (store) => store.updateLoreNotes
  );
  const removeLore = useCharacterSheetStore((store) => store.removeLore);
  const clearLore = useCharacterSheetStore((store) => store.clearLore);

  const updateLoreAndLoadImage = useCallback(
    (loreId: string, lore: LoreDocument) => {
      updateLore(loreId, lore, (filename: string) => {
        if (worldId) {
          getImageUrl(constructLoreImagePath(worldId, loreId, filename)).then(
            (url) => {
              updateLoreImageUrl(loreId, 0, url);
            }
          );
        }
      });
    },
    [updateLore, updateLoreImageUrl, worldId]
  );

  useEffect(() => {
    let unsubscribes: Unsubscribe[];
    if (worldId && worldOwnerId) {
      unsubscribes = listenToLore(
        uid,
        worldOwnerId,
        worldId,
        updateLoreAndLoadImage,
        updateLoreGMProperties,
        updateLoreNotes,
        removeLore,
        (err) => error(err)
      );
    } else {
      clearLore();
    }

    return () => {
      unsubscribes?.forEach((unsubscribe) => unsubscribe());
    };
  }, [uid, worldId, worldOwnerId]);
}

export function useCampaignGMScreenListenToLore() {
  const { error } = useSnackbar();

  const uid = useAuth().user?.uid;
  const worldId = useCampaignGMScreenStore((store) => store.campaign?.worldId);
  const worldOwnerId = useWorldsStore((store) =>
    worldId ? store.worlds[worldId]?.ownerId : ""
  );
  const updateLore = useCampaignGMScreenStore((store) => store.updateLore);
  const updateLoreImageUrl = useCampaignGMScreenStore(
    (store) => store.addLoreImageURL
  );
  const updateLoreGMProperties = useCampaignGMScreenStore(
    (store) => store.updateLoreGMProperties
  );
  const updateLoreNotes = useCampaignGMScreenStore(
    (store) => store.updateLoreNotes
  );
  const removeLore = useCampaignGMScreenStore((store) => store.removeLore);
  const clearLore = useCampaignGMScreenStore((store) => store.clearLore);

  const updateLoreAndLoadImage = useCallback(
    (loreId: string, lore: LoreDocument) => {
      updateLore(loreId, lore, (filename: string) => {
        if (worldId) {
          getImageUrl(constructLoreImagePath(worldId, loreId, filename)).then(
            (url) => {
              updateLoreImageUrl(loreId, 0, url);
            }
          );
        }
      });
    },
    [updateLore, updateLoreImageUrl, worldId]
  );

  useEffect(() => {
    let unsubscribes: Unsubscribe[];
    if (worldId && worldOwnerId) {
      unsubscribes = listenToLore(
        uid,
        worldOwnerId,
        worldId,
        updateLoreAndLoadImage,
        updateLoreGMProperties,
        updateLoreNotes,
        removeLore,
        (err) => error(err)
      );
    } else {
      clearLore();
    }

    return () => {
      unsubscribes?.forEach((unsubscribe) => unsubscribe());
    };
  }, [uid, worldId, worldOwnerId]);
}

export function useWorldSheetListenToLore(
  worldOwnerId: string | undefined,
  worldId: string | undefined
) {
  const { error } = useSnackbar();

  const uid = useAuth().user?.uid;

  const updateLore = useWorldSheetStore((store) => store.updateLore);
  const updateLoreImageUrl = useWorldSheetStore(
    (store) => store.addLoreImageURL
  );
  const updateLoreGMProperties = useWorldSheetStore(
    (store) => store.updateLoreGMProperties
  );
  const updateLoreNotes = useWorldSheetStore((store) => store.updateLoreNotes);
  const removeLore = useWorldSheetStore((store) => store.removeLore);
  const clearLore = useWorldSheetStore((store) => store.clearLore);

  const updateLoreAndLoadImage = useCallback(
    (loreId: string, lore: LoreDocument) => {
      updateLore(loreId, lore, (filename: string) => {
        if (worldId) {
          getImageUrl(constructLoreImagePath(worldId, loreId, filename)).then(
            (url) => {
              updateLoreImageUrl(loreId, 0, url);
            }
          );
        }
      });
    },
    [updateLore, updateLoreImageUrl, worldId]
  );

  useEffect(() => {
    let unsubscribes: Unsubscribe[];
    if (worldId && worldOwnerId) {
      unsubscribes = listenToLore(
        uid,
        worldOwnerId,
        worldId,
        updateLoreAndLoadImage,
        updateLoreGMProperties,
        updateLoreNotes,
        removeLore,
        (err) => error(err)
      );
    } else {
      clearLore();
    }

    return () => {
      unsubscribes?.forEach((unsubscribe) => unsubscribe());
    };
  }, [uid, worldId, worldOwnerId]);
}
