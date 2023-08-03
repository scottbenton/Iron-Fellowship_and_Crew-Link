import { onSnapshot, query, Unsubscribe } from "firebase/firestore";
import { useEffect } from "react";
import { getErrorMessage } from "../../functions/getErrorMessage";
import { useAuth } from "../../providers/AuthProvider";
import { useSnackbar } from "../../providers/SnackbarProvider/useSnackbar";
import { useCharacterStore } from "../../stores/character.store";
import { CharacterDocument } from "../../types/Character.type";
import { getUsersCharacterCollection } from "./_getRef";

export function listenToUsersCharacters(
  uid: string,
  dataHandler: {
    onDocChange: (id: string, data: CharacterDocument) => void;
    onDocRemove: (id: string) => void;
    onLoaded: () => void;
  },
  onError: (error: any) => void
) {
  if (!uid) {
    return;
  }
  const characterQuery = query(getUsersCharacterCollection(uid));
  return onSnapshot(
    characterQuery,
    (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "removed") {
          dataHandler.onDocRemove(change.doc.id);
        } else {
          dataHandler.onDocChange(change.doc.id, change.doc.data());
        }
      });
      dataHandler.onLoaded();
    },
    (error) => onError(error)
  );
}
