import { Bytes, setDoc, updateDoc } from "firebase/firestore";
import {
  constructCampaignNoteContentPath,
  constructCampaignNoteDocPath,
  constructCharacterNoteContentPath,
  constructCharacterNoteDocPath,
  getCampaignNoteContentDocument,
  getCampaignNoteDocument,
  getCharacterNoteContentDocument,
  getCharacterNoteDocument,
} from "./_getRef";
import { firebaseAuth } from "config/firebase.config";
import { createApiFunction } from "api-calls/createApiFunction";

export const updateNote = createApiFunction<
  {
    campaignId: string | undefined;
    characterId: string | undefined;
    noteId: string;
    title: string;
    content?: Uint8Array;
    isBeaconRequest?: boolean;
  },
  void
>((params) => {
  const { campaignId, characterId, noteId, title, content, isBeaconRequest } =
    params;

  return new Promise((resolve, reject) => {
    if (!campaignId && !characterId) {
      reject(new Error("Either campaign or character ID must be defined."));
      return;
    }

    const noteContentPath = characterId
      ? constructCharacterNoteContentPath(characterId, noteId)
      : constructCampaignNoteContentPath(campaignId as string, noteId);
    const noteDocPath = characterId
      ? constructCharacterNoteDocPath(characterId, noteId)
      : constructCampaignNoteDocPath(campaignId as string, noteId);

    // If we are making this call when closing the page, we want to use a fetch call with keepalive
    if (isBeaconRequest) {
      const contentPath = `projects/${
        import.meta.env.VITE_FIREBASE_PROJECTID
      }/databases/(default)/documents${noteContentPath}`;
      const titlePath = `projects/${
        import.meta.env.VITE_FIREBASE_PROJECTID
      }/databases/(default)/documents${noteDocPath}`;

      const token = (firebaseAuth.currentUser?.toJSON() as any).stsTokenManager
        .accessToken;
      if (content) {
        fetch(
          `https://firestore.googleapis.com/v1/${contentPath}?updateMask.fieldPaths=notes`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: contentPath,
              fields: {
                notes: {
                  bytesValue: Bytes.fromUint8Array(content).toBase64(),
                },
              },
            }),
            keepalive: true,
          }
        ).catch((e) => console.error(e));
      }
      fetch(
        `https://firestore.googleapis.com/v1/${titlePath}?updateMask.fieldPaths=title`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: titlePath,
            fields: {
              title: {
                stringValue: title,
              },
            },
          }),
          keepalive: true,
        }
      ).catch((e) => console.error(e));

      resolve();
    } else {
      const promises: Promise<any>[] = [];
      promises.push(
        updateDoc(
          characterId
            ? getCharacterNoteDocument(characterId, noteId)
            : getCampaignNoteDocument(campaignId as string, noteId),
          {
            title,
          }
        )
      );

      if (content) {
        promises.push(
          setDoc(
            characterId
              ? getCharacterNoteContentDocument(characterId, noteId)
              : getCampaignNoteContentDocument(campaignId as string, noteId),
            {
              notes: Bytes.fromUint8Array(content),
            },
            { merge: true }
          )
        );
      }

      Promise.all(promises)
        .then(() => {
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    }
  });
}, "Failed to update note.");
