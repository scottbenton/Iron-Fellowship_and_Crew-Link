import { setDoc, updateDoc } from "firebase/firestore";
import {
  constructCharacterNoteContentPath,
  constructCharacterNoteDocPath,
  getCharacterNoteContentDocument,
  getCharacterNoteDocument,
} from "./_getRef";
import { firebaseAuth } from "config/firebase.config";
import { createApiFunction } from "api-calls/createApiFunction";

export const updateCharacterNote = createApiFunction<
  {
    characterId: string;
    noteId: string;
    title: string;
    content?: string;
    isBeaconRequest?: boolean;
  },
  void
>((params) => {
  const { characterId, noteId, title, content, isBeaconRequest } = params;

  return new Promise((resolve, reject) => {
    // If we are making this call when closing the page, we want to use a fetch call with keepalive
    if (isBeaconRequest) {
      const contentPath = `projects/${
        import.meta.env.VITE_FIREBASE_PROJECTID
      }/databases/(default)/documents${constructCharacterNoteContentPath(
        characterId,
        noteId
      )}`;
      const titlePath = `projects/${
        import.meta.env.VITE_FIREBASE_PROJECTID
      }/databases/(default)/documents${constructCharacterNoteDocPath(
        characterId,
        noteId
      )}`;

      const token = (firebaseAuth.currentUser?.toJSON() as any).stsTokenManager
        .accessToken;
      if (content) {
        fetch(
          `https://firestore.googleapis.com/v1/${contentPath}?updateMask.fieldPaths=content`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: contentPath,
              fields: {
                content: {
                  stringValue: content,
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
        updateDoc(getCharacterNoteDocument(characterId, noteId), {
          title,
        })
      );

      if (content) {
        promises.push(
          setDoc(getCharacterNoteContentDocument(characterId, noteId), {
            content,
          })
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
}, "Failed to update note");
