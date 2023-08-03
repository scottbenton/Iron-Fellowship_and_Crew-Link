import { useCharacterSheetStore } from "pages/Character/CharacterSheetPage/characterSheet.store";
import { onSnapshot, Unsubscribe } from "firebase/firestore";
import { getErrorMessage } from "functions/getErrorMessage";
import { useAuth } from "providers/AuthProvider";
import { useSnackbar } from "providers/SnackbarProvider/useSnackbar";
import { useEffect } from "react";
import { CharacterSettingsDoc } from "types/Settings.type";
import { getCharacterSettingsDoc } from "./_getRef";

export function listenToCharacterSettings(
  uid: string,
  characterId: string,
  onSettings: (settings: CharacterSettingsDoc) => void,
  onError: (error: any) => void
) {
  return onSnapshot(
    getCharacterSettingsDoc(uid, characterId),
    (snapshot) => {
      onSettings({
        hiddenCustomMoveIds: [],
        hiddenCustomOraclesIds: [],
        ...snapshot.data(),
      });
    },
    (error) => onError(error)
  );
}

export function useCharacterSheetListenToCharacterSettings() {
  const uid = useAuth().user?.uid;
  const characterId = useCharacterSheetStore((store) => store.characterId);
  const setSettings = useCharacterSheetStore(
    (store) => store.setCharacterSettings
  );

  const { error } = useSnackbar();

  useEffect(() => {
    let unsubscribe: Unsubscribe;

    if (uid && characterId) {
      unsubscribe = listenToCharacterSettings(
        uid,
        characterId,
        setSettings,
        (err) => {
          console.error(err);
          const errorMessage = getErrorMessage(
            error,
            "Failed to retrieve character settings"
          );
          error(errorMessage);
        }
      );
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [uid, characterId]);
}
