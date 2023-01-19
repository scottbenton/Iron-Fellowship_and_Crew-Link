import { arrayRemove, deleteDoc, getDoc, updateDoc } from "firebase/firestore";
import { firebaseAuth } from "../config/firebase.config";
import {
  getCampaignDoc,
  getCharacterAssetDoc,
  getCharacterDoc,
  getCharacterTracksDoc,
} from "../lib/firebase.lib";

export async function deleteCharacter(characterId: string): Promise<boolean> {
  const uid = firebaseAuth.currentUser?.uid;
  if (uid) {
    try {
      const campaignId = await (
        await getDoc(getCharacterDoc(uid, characterId))
      ).data()?.campaignId;

      let promises: Promise<any>[] = [];

      if (campaignId) {
        promises.push(
          updateDoc(getCampaignDoc(campaignId), {
            characters: arrayRemove({
              characterId: characterId,
              uid: uid,
            }),
          })
        );
      }

      promises.push(deleteDoc(getCharacterAssetDoc(uid, characterId)));
      promises.push(deleteDoc(getCharacterTracksDoc(uid, characterId)));
      promises.push(deleteDoc(getCharacterDoc(uid, characterId)));

      await Promise.all(promises);
      return true;
    } catch (e) {
      console.error(e);
      throw new Error("Failed to delete character");
    }
  } else {
    throw new Error("Failed to delete character");
  }
}
