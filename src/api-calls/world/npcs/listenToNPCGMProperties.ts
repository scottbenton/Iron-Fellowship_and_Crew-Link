import { Unsubscribe } from "firebase/auth";
import { onSnapshot } from "firebase/firestore";
import { GMNPCDocument } from "types/NPCs.type";
import { getPrivateDetailsNPCDoc } from "./_getRef";
import { getErrorMessage } from "functions/getErrorMessage";

export function listenToNPCGMProperties(
  worldId: string,
  npcId: string,
  updateGMProperties: (properties: GMNPCDocument | undefined) => void,
  onError: (error: string) => void
): Unsubscribe {
  return onSnapshot(
    getPrivateDetailsNPCDoc(worldId, npcId),
    (snapshot) => {
      const gmProps = snapshot.data();
      const newProps: GMNPCDocument = {
        ...gmProps,
        gmNotes: gmProps?.gmNotes?.toUint8Array(),
      };
      updateGMProperties(newProps);
    },
    (error) => {
      onError(getErrorMessage(error, "Failed to get npc gm notes"));
    }
  );
}
