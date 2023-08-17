import { Unsubscribe } from "firebase/auth";
import { onSnapshot } from "firebase/firestore";
import { GMLoreDocument } from "types/Lore.type";
import { getPrivateDetailsLoreDoc } from "./_getRef";
import { getErrorMessage } from "functions/getErrorMessage";

export function listenToLoreGMProperties(
  worldId: string,
  loreId: string,
  updateGMProperties: (properties: GMLoreDocument | undefined) => void,
  onError: (error: string) => void
): Unsubscribe {
  return onSnapshot(
    getPrivateDetailsLoreDoc(worldId, loreId),
    (snapshot) => {
      const gmProps = snapshot.data();
      updateGMProperties(gmProps);
    },
    (error) => {
      onError(getErrorMessage(error, "Failed to get lore document gm notes"));
    }
  );
}
