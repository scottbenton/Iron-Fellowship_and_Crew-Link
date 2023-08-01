import { useCharacterSheetStore } from "pages/Character/CharacterSheetPage/characterSheet.store";
import { Unsubscribe } from "firebase/auth";
import { Bytes, onSnapshot, query, where } from "firebase/firestore";
import { useSnackbar } from "hooks/useSnackbar";
import { useCallback, useEffect, useState } from "react";
import { NPCDocument } from "types/NPCs.type";
import {
  constructNPCImagePath,
  convertFromDatabase,
  getNPCCollection,
  getPrivateDetailsNPCDoc,
  getPublicNotesNPCDoc,
} from "./_getRef";
import { GMNPCDocument } from "types/NPCs.type";
import { useAuth } from "providers/AuthProvider";
import { useCampaignGMScreenStore } from "pages/Campaign/CampaignGMScreenPage/campaignGMScreen.store";
import { NPC } from "stores/world.slice";
import { getImageUrl } from "lib/storage.lib";
import { useWorldSheetStore } from "pages/World/WorldSheetPage/worldSheet.store";

export function listenToNPCs(
  uid: string | undefined,
  worldOwnerId: string,
  worldId: string,
  updateNPC: (npcId: string, npc: NPCDocument) => void,
  updateNPCGMProperties: (npcId: string, gmProperties: GMNPCDocument) => void,
  updateNPCNotes: (npcId: string, notes: Uint8Array | null) => void,
  removeNPC: (npcId: string) => void,
  onError: (error: string) => void
): Unsubscribe[] {
  const unsubscribes: Unsubscribe[] = [];

  const npcCollectionRef = getNPCCollection(worldId);
  const isWorldOwner = uid === worldOwnerId;
  unsubscribes.push(
    onSnapshot(
      isWorldOwner
        ? npcCollectionRef
        : query(npcCollectionRef, where("sharedWithPlayers", "==", true)),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "removed") {
            removeNPC(change.doc.id);
          } else {
            if (change.type === "added") {
              if (isWorldOwner) {
                unsubscribes.push(
                  onSnapshot(
                    getPrivateDetailsNPCDoc(worldId, change.doc.id),
                    (doc) => {
                      const privateNPCDetails = doc.data();
                      if (privateNPCDetails) {
                        updateNPCGMProperties(change.doc.id, privateNPCDetails);
                      }
                    },
                    (error) => {
                      console.error(error);
                      onError("Failed to get npcs");
                    }
                  )
                );
              }
              unsubscribes.push(
                onSnapshot(
                  getPublicNotesNPCDoc(worldId, change.doc.id),
                  (doc) => {
                    const noteDoc = doc.data();

                    if (noteDoc?.notes) {
                      updateNPCNotes(
                        change.doc.id,
                        noteDoc.notes.toUint8Array()
                      );
                    } else {
                      updateNPCNotes(change.doc.id, null);
                    }
                  }
                )
              );
            }
            updateNPC(change.doc.id, convertFromDatabase(change.doc.data()));
          }
        });
      },
      (error) => {
        console.error(error);
        onError("Failed to get npcs");
      }
    )
  );

  return unsubscribes;
}

export function useListenToNPCs(worldOwnerId?: string, worldId?: string) {
  const { error } = useSnackbar();
  const uid = useAuth().user?.uid;

  const [npcs, setNPCs] = useState<{
    [key: string]: NPC;
  }>({});

  const updateNPCAndLoadImage = useCallback(
    (npcId: string, npc: NPCDocument) => {
      setNPCs((prevNPCs) => {
        let newNPCs = { ...prevNPCs };
        const prevNPC = newNPCs[npcId];
        newNPCs[npcId] = { ...prevNPC, ...npc };
        return newNPCs;
      });
      setNPCs((prevNPCs) => {
        const newNPCs = { ...prevNPCs };
        const prevNPC = newNPCs[npcId];
        newNPCs[npcId] = { ...prevNPC, ...npc };
        return newNPCs;
      });

      const imageUrl = npc.imageFilenames?.[0];

      if (worldId && imageUrl) {
        getImageUrl(constructNPCImagePath(worldId, npcId, imageUrl)).then(
          (url) => {
            setNPCs((prevNPCs) => {
              const newNPCs = { ...prevNPCs };
              const newNPC = { ...newNPCs[npcId] };
              newNPC.imageUrls = [url];
              newNPCs[npcId] = newNPC;
              return newNPCs;
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
      unsubscribes = listenToNPCs(
        uid,
        worldOwnerId,
        worldId,
        (npcId, npc) => updateNPCAndLoadImage(npcId, npc),
        (npcId, gmProperties) =>
          setNPCs((prevNPCs) => {
            let newNPCs = { ...prevNPCs };
            const prevNPC = newNPCs[npcId];
            newNPCs[npcId] = { ...prevNPC, gmProperties };
            return newNPCs;
          }),
        (npcId, notes) =>
          setNPCs((prevNPCs) => {
            let newNPCs = { ...prevNPCs };
            const prevNPC = newNPCs[npcId];
            newNPCs[npcId] = { ...prevNPC, notes };
            return newNPCs;
          }),
        (npcId) =>
          setNPCs((prevNPCs) => {
            let newNPCs = { ...prevNPCs };
            delete newNPCs[npcId];
            return newNPCs;
          }),
        (err) => error(err)
      );
    } else {
      setNPCs({});
    }

    return () => {
      unsubscribes?.forEach((unsubscribe) => unsubscribe());
    };
  }, [uid, worldId, worldOwnerId]);

  return { npcs };
}

export function useCharacterSheetListenToNPCs() {
  const { error } = useSnackbar();

  const uid = useAuth().user?.uid;

  const worldOwnerId = useCharacterSheetStore((store) => store.worldOwnerId);
  const worldId = useCharacterSheetStore((store) => store.worldId);

  const updateNPC = useCharacterSheetStore((store) => store.updateNPC);
  const updateNPCImageUrl = useCharacterSheetStore(
    (store) => store.addNPCImageURL
  );
  const updateNPCGMProperties = useCharacterSheetStore(
    (store) => store.updateNPCGMProperties
  );
  const updateNPCNotes = useCharacterSheetStore(
    (store) => store.updateNPCNotes
  );
  const removeNPC = useCharacterSheetStore((store) => store.removeNPC);
  const clearNPCs = useCharacterSheetStore((store) => store.clearNPCs);

  const updateNPCAndLoadImage = useCallback(
    (npcId: string, npc: NPCDocument) => {
      updateNPC(npcId, npc, (filename: string) => {
        if (worldId) {
          getImageUrl(constructNPCImagePath(worldId, npcId, filename)).then(
            (url) => {
              updateNPCImageUrl(npcId, 0, url);
            }
          );
        }
      });
    },
    [updateNPC, updateNPCImageUrl, worldId]
  );

  useEffect(() => {
    let unsubscribes: Unsubscribe[];
    if (worldId && worldOwnerId) {
      unsubscribes = listenToNPCs(
        uid,
        worldOwnerId,
        worldId,
        updateNPCAndLoadImage,
        updateNPCGMProperties,
        updateNPCNotes,
        removeNPC,
        (err) => error(err)
      );
    } else {
      clearNPCs();
    }

    return () => {
      unsubscribes?.forEach((unsubscribe) => unsubscribe());
    };
  }, [uid, worldId, worldOwnerId]);
}

export function useCampaignGMScreenListenToNPCs() {
  const { error } = useSnackbar();

  const uid = useAuth().user?.uid;

  const worldOwnerId = useCampaignGMScreenStore(
    (store) => store.world?.ownerId
  );
  const worldId = useCampaignGMScreenStore((store) => store.campaign?.worldId);

  const updateNPC = useCampaignGMScreenStore((store) => store.updateNPC);
  const updateNPCImageUrl = useCampaignGMScreenStore(
    (store) => store.addNPCImageURL
  );
  const updateNPCGMProperties = useCampaignGMScreenStore(
    (store) => store.updateNPCGMProperties
  );
  const updateNPCNotes = useCampaignGMScreenStore(
    (store) => store.updateNPCNotes
  );
  const removeNPC = useCampaignGMScreenStore((store) => store.removeNPC);
  const clearNPCs = useCampaignGMScreenStore((store) => store.clearNPCs);

  const updateNPCAndLoadImage = useCallback(
    (npcId: string, npc: NPCDocument) => {
      updateNPC(npcId, npc, (filename: string) => {
        if (worldId) {
          getImageUrl(constructNPCImagePath(worldId, npcId, filename)).then(
            (url) => {
              updateNPCImageUrl(npcId, 0, url);
            }
          );
        }
      });
    },
    [updateNPC, updateNPCImageUrl, worldId]
  );

  useEffect(() => {
    let unsubscribes: Unsubscribe[];
    if (worldId && worldOwnerId) {
      unsubscribes = listenToNPCs(
        uid,
        worldOwnerId,
        worldId,
        updateNPCAndLoadImage,
        updateNPCGMProperties,
        updateNPCNotes,
        removeNPC,
        (err) => error(err)
      );
    } else {
      clearNPCs();
    }

    return () => {
      unsubscribes?.forEach((unsubscribe) => unsubscribe());
    };
  }, [uid, worldId, worldOwnerId]);
}

export function useWorldSheetListenToNPCs(
  worldOwnerId: string | undefined,
  worldId: string | undefined
) {
  const { error } = useSnackbar();

  const uid = useAuth().user?.uid;

  const updateNPC = useWorldSheetStore((store) => store.updateNPC);
  const updateNPCImageUrl = useWorldSheetStore((store) => store.addNPCImageURL);
  const updateNPCGMProperties = useWorldSheetStore(
    (store) => store.updateNPCGMProperties
  );
  const updateNPCNotes = useWorldSheetStore((store) => store.updateNPCNotes);
  const removeNPC = useWorldSheetStore((store) => store.removeNPC);
  const clearNPCs = useWorldSheetStore((store) => store.clearNPCs);

  const updateNPCAndLoadImage = useCallback(
    (npcId: string, npc: NPCDocument) => {
      updateNPC(npcId, npc, (filename: string) => {
        if (worldId) {
          getImageUrl(constructNPCImagePath(worldId, npcId, filename)).then(
            (url) => {
              updateNPCImageUrl(npcId, 0, url);
            }
          );
        }
      });
    },
    [updateNPC, updateNPCImageUrl, worldId]
  );

  useEffect(() => {
    let unsubscribes: Unsubscribe[];
    if (worldId && worldOwnerId) {
      unsubscribes = listenToNPCs(
        uid,
        worldOwnerId,
        worldId,
        updateNPCAndLoadImage,
        updateNPCGMProperties,
        updateNPCNotes,
        removeNPC,
        (err) => error(err)
      );
    } else {
      clearNPCs();
    }

    return () => {
      unsubscribes?.forEach((unsubscribe) => unsubscribe());
    };
  }, [uid, worldId, worldOwnerId]);
}
