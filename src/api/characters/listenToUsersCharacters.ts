import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { onSnapshot, query, Unsubscribe } from "firebase/firestore";
import { useEffect } from "react";
import { getErrorMessage } from "../../functions/getErrorMessage";
import { useAuth } from "../../hooks/useAuth";
import { useSnackbar } from "../../hooks/useSnackbar";
import { getUsersCharacterCollection } from "../../lib/firebase.lib";
import { useCharacterStore } from "../../stores/character.store";
import { CharacterDocument } from "../../types/Character.type";

export function listenToUsersCharacters(
  uid: string | undefined,
  dataHandler: {
    onDocChange: (id: string, data: CharacterDocument) => void;
    onDocRemove: (id: string) => void;
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
    },
    (error) => onError(error)
  );
}

export function useListenToUsersCharacters() {
  const setCharacter = useCharacterStore((state) => state.setCharacter);
  const removeCharacter = useCharacterStore((state) => state.removeCharacter);

  const { error } = useSnackbar();

  const uid = useAuth().user?.uid;

  useEffect(() => {
    let unsubscribe: Unsubscribe;

    listenToUsersCharacters(
      uid,
      {
        onDocChange: (id, doc) => setCharacter(id, doc),
        onDocRemove: (id) => removeCharacter(id),
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
      unsubscribe && unsubscribe();
    };
  }, [uid]);
}
