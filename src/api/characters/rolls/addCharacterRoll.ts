import { addDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { Roll } from "types/DieRolls.type";
import { getCharacterRollsCollection } from "./_getRef";
import { useAuth } from "providers/AuthProvider";
import { useCharacterSheetStore } from "pages/Character/CharacterSheetPage/characterSheet.store";

export const addCharacterRoll: ApiFunction<
  {
    uid: string;
    characterId: string;
    roll: Roll;
  },
  boolean
> = (params) => {
  const { uid, characterId, roll } = params;

  return new Promise((resolve, reject) => {
    addDoc(getCharacterRollsCollection(uid, characterId), roll)
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to store roll");
      });
  });
};

export function useAddCharacterRoll() {
  const characterId = useCharacterSheetStore((store) => store.characterId);
  const uid = useAuth().user?.uid;

  const { call, ...rest } = useApiState(addCharacterRoll, {
    disableErrorSnackbar: true,
  });

  return {
    addCharacterRoll: (roll: Roll) => {
      if (uid && characterId) {
        return call({ uid, characterId, roll });
      }
    },
  };
}
