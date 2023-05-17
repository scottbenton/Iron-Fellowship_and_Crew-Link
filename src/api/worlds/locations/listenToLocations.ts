import { useCharacterSheetStore } from "pages/Character/CharacterSheetPage/characterSheet.store";
import { Unsubscribe } from "firebase/auth";
import { Bytes, onSnapshot, query, where } from "firebase/firestore";
import { useSnackbar } from "hooks/useSnackbar";
import { useEffect, useState } from "react";
import { LocationDocument } from "types/Locations.type";
import {
  convertFromDatabase,
  getLocationCollection,
  getPrivateDetailsLocationDoc,
  getPublicNotesLocationDoc,
} from "./_getRef";
import { GMLocationDocument } from "types/Locations.type";
import { useAuth } from "providers/AuthProvider";
import { useCampaignGMScreenStore } from "pages/Campaign/CampaignGMScreenPage/campaignGMScreen.store";
import { LocationDocumentWithGMProperties } from "stores/sharedLocationStore";

export function listenToLocations(
  uid: string | undefined,
  worldOwnerId: string,
  worldId: string,
  updateLocation: (locationId: string, location: LocationDocument) => void,
  updateLocationGMProperties: (
    locationId: string,
    gmProperties: GMLocationDocument
  ) => void,
  updateLocationNotes: (locationId: string, notes: Uint8Array | null) => void,
  removeLocation: (locationId: string) => void,
  onError: (error: string) => void
): Unsubscribe[] {
  const unsubscribes: Unsubscribe[] = [];

  const locationCollectionRef = getLocationCollection(worldId);
  const isWorldOwner = uid === worldOwnerId;
  unsubscribes.push(
    onSnapshot(
      isWorldOwner
        ? locationCollectionRef
        : query(locationCollectionRef, where("sharedWithPlayers", "==", true)),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "removed") {
            removeLocation(change.doc.id);
          } else {
            if (change.type === "added") {
              if (isWorldOwner) {
                unsubscribes.push(
                  onSnapshot(
                    getPrivateDetailsLocationDoc(worldId, change.doc.id),
                    (doc) => {
                      const privateLocationDetails = doc.data();
                      if (privateLocationDetails) {
                        updateLocationGMProperties(
                          change.doc.id,
                          privateLocationDetails
                        );
                      }
                    },
                    (error) => {
                      console.error(error);
                      onError("Failed to get locations");
                    }
                  )
                );
              }
              unsubscribes.push(
                onSnapshot(
                  getPublicNotesLocationDoc(worldId, change.doc.id),
                  (doc) => {
                    const noteDoc = doc.data();

                    if (noteDoc?.notes) {
                      updateLocationNotes(
                        change.doc.id,
                        noteDoc.notes.toUint8Array()
                      );
                    } else {
                      updateLocationNotes(change.doc.id, null);
                    }
                  }
                )
              );
            }
            updateLocation(
              change.doc.id,
              convertFromDatabase(change.doc.data())
            );
          }
        });
      },
      (error) => {
        console.error(error);
        onError("Failed to get locations");
      }
    )
  );

  return unsubscribes;
}

export function useListenToLocations(worldOwnerId?: string, worldId?: string) {
  const { error } = useSnackbar();
  const uid = useAuth().user?.uid;

  const [locations, setLocations] = useState<{
    [key: string]: LocationDocumentWithGMProperties;
  }>({});

  useEffect(() => {
    let unsubscribes: Unsubscribe[];
    if (worldId && worldOwnerId) {
      unsubscribes = listenToLocations(
        uid,
        worldOwnerId,
        worldId,
        (locationId, location) =>
          setLocations((prevLocations) => {
            let newLocations = { ...prevLocations };
            const prevLocation = newLocations[locationId];
            newLocations[locationId] = { ...prevLocation, ...location };
            return newLocations;
          }),
        (locationId, gmProperties) =>
          setLocations((prevLocations) => {
            let newLocations = { ...prevLocations };
            const prevLocation = newLocations[locationId];
            newLocations[locationId] = { ...prevLocation, gmProperties };
            return newLocations;
          }),
        (locationId, notes) =>
          setLocations((prevLocations) => {
            let newLocations = { ...prevLocations };
            const prevLocation = newLocations[locationId];
            newLocations[locationId] = { ...prevLocation, notes };
            return newLocations;
          }),
        (locationId) =>
          setLocations((prevLocations) => {
            let newLocations = { ...prevLocations };
            delete newLocations[locationId];
            return newLocations;
          }),
        (err) => error(err)
      );
    } else {
      setLocations({});
    }

    return () => {
      unsubscribes?.forEach((unsubscribe) => unsubscribe());
    };
  }, [uid, worldId, worldOwnerId]);

  return { locations };
}

export function useCharacterSheetListenToLocations() {
  const { error } = useSnackbar();

  const uid = useAuth().user?.uid;

  const worldOwnerId = useCharacterSheetStore((store) => store.worldOwnerId);
  const worldId = useCharacterSheetStore((store) => store.worldId);

  const updateLocation = useCharacterSheetStore(
    (store) => store.updateLocation
  );
  const updateLocationGMProperties = useCharacterSheetStore(
    (store) => store.updateLocationGMProperties
  );
  const updateLocationNotes = useCharacterSheetStore(
    (store) => store.updateLocationNotes
  );
  const removeLocation = useCharacterSheetStore(
    (store) => store.removeLocation
  );
  const clearLocations = useCharacterSheetStore(
    (store) => store.clearLocations
  );

  useEffect(() => {
    let unsubscribes: Unsubscribe[];
    if (worldId && worldOwnerId) {
      unsubscribes = listenToLocations(
        uid,
        worldOwnerId,
        worldId,
        updateLocation,
        updateLocationGMProperties,
        updateLocationNotes,
        removeLocation,
        (err) => error(err)
      );
    } else {
      clearLocations();
    }

    return () => {
      unsubscribes?.forEach((unsubscribe) => unsubscribe());
    };
  }, [uid, worldId, worldOwnerId]);
}

export function useCampaignGMScreenListenToLocations() {
  const { error } = useSnackbar();

  const uid = useAuth().user?.uid;

  const worldOwnerId = useCampaignGMScreenStore(
    (store) => store.campaign?.gmId
  );
  const worldId = useCampaignGMScreenStore((store) => store.campaign?.worldId);

  const updateLocation = useCampaignGMScreenStore(
    (store) => store.updateLocation
  );
  const updateLocationGMProperties = useCampaignGMScreenStore(
    (store) => store.updateLocationGMProperties
  );
  const updateLocationNotes = useCampaignGMScreenStore(
    (store) => store.updateLocationNotes
  );
  const removeLocation = useCampaignGMScreenStore(
    (store) => store.removeLocation
  );
  const clearLocations = useCampaignGMScreenStore(
    (store) => store.clearLocations
  );

  useEffect(() => {
    let unsubscribes: Unsubscribe[];
    if (worldId && worldOwnerId) {
      unsubscribes = listenToLocations(
        uid,
        worldOwnerId,
        worldId,
        updateLocation,
        updateLocationGMProperties,
        updateLocationNotes,
        removeLocation,
        (err) => error(err)
      );
    } else {
      clearLocations();
    }

    return () => {
      unsubscribes?.forEach((unsubscribe) => unsubscribe());
    };
  }, [uid, worldId, worldOwnerId]);
}