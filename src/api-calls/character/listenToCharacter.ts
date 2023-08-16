import { onSnapshot } from "firebase/firestore";
import { CharacterDocument } from "../../types/Character.type";
import { getCharacterDoc } from "./_getRef";

export function listenToCharacter(
  characterId: string,
  onCharacter: (character: CharacterDocument) => void,
  onError: (error: any) => void
) {
  return onSnapshot(
    getCharacterDoc(characterId),
    (snapshot) => {
      const character = snapshot.data();
      if (character) {
        onCharacter(character);
      } else {
        onError("No character found");
      }
    },
    (error) => onError(error)
  );
}
