import { getDoc } from "firebase/firestore";
import { CharacterDocument } from "./_character.type";
import { getCharacterDoc } from "./_getRef";

/**
 * One-shot fetch of a character document for export purposes.
 * Returns null if the document does not exist.
 */
export async function getCharacterForExport(
  characterId: string
): Promise<{ id: string; data: CharacterDocument } | null> {
  const snap = await getDoc(getCharacterDoc(characterId));
  if (!snap.exists()) {
    return null;
  }
  return { id: snap.id, data: snap.data() };
}
