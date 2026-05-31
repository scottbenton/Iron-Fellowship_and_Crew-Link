import { getDoc } from "firebase/firestore";
import { World } from "./_world.type";
import { decodeWorld, getWorldDoc } from "./_getRef";

/**
 * One-shot read of a world document for export purposes.
 * Returns the decoded World (with ownerIds merged with campaignGuides)
 * or null if the document does not exist.
 */
export async function getWorldForExport(worldId: string): Promise<World | null> {
  const snap = await getDoc(getWorldDoc(worldId));
  if (!snap.exists()) return null;
  return decodeWorld(snap.data());
}
