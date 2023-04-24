import { useCharacterSheetStore } from "features/character-sheet/characterSheet.store";
import { Unsubscribe } from "firebase/auth";
import { Bytes, onSnapshot } from "firebase/firestore";
import { useSnackbar } from "hooks/useSnackbar";
import { useEffect } from "react";
import { LocationDocument } from "types/Locations.type";
import {
  convertFromDatabase,
  getLocationCollection,
  getPrivateDetailsLocationDoc,
  getPublicNotesLocationDoc,
} from "./_getRef";
import { GMLocationDocument } from "types/Locations.type";
import { firebaseAuth } from "config/firebase.config";
import { useAuth } from "providers/AuthProvider";

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

  unsubscribes.push(
    onSnapshot(
      getLocationCollection(worldOwnerId, worldId),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "removed") {
            removeLocation(change.doc.id);
          } else {
            if (change.type === "added") {
              if (uid === worldOwnerId) {
                unsubscribes.push(
                  onSnapshot(
                    getPrivateDetailsLocationDoc(
                      worldOwnerId,
                      worldId,
                      change.doc.id
                    ),
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
                  getPublicNotesLocationDoc(
                    worldOwnerId,
                    worldId,
                    change.doc.id
                  ),
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
