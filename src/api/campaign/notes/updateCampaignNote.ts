import { CampaignNotFoundException } from "api/error/CampaignNotFoundException";
import { setDoc, updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { useAuth } from "hooks/useAuth";
import {
  constructCampaignNoteContentPath,
  constructCampaignNoteDocPath,
  getCampaignNoteContentDocument,
  getCampaignNoteDocument,
} from "./_getRef";
import { NoteNotFoundException } from "api/error/NoteException";
import { firebaseAuth } from "config/firebase.config";

export const updateCampaignNote: ApiFunction<
  {
    campaignId?: string;
    noteId?: string;
    title: string;
    content: string;
    isBeaconRequest?: boolean;
  },
  boolean
> = function (params) {
  const { campaignId, noteId, title, content, isBeaconRequest } = params;

  return new Promise((resolve, reject) => {
    if (!campaignId) {
      reject(new CampaignNotFoundException());
      return;
    }

    if (!noteId) {
      reject(new NoteNotFoundException());
      return;
    }

    // If we are making this call when closing the page, we want to use a fetch call with keepalive
    if (isBeaconRequest) {
      const contentPath = `projects/${
        import.meta.env.VITE_FIREBASE_PROJECTID
      }/databases/(default)/documents${constructCampaignNoteContentPath(
        campaignId,
        noteId
      )}`;
      const titlePath = `projects/${
        import.meta.env.VITE_FIREBASE_PROJECTID
      }/databases/(default)/documents${constructCampaignNoteDocPath(
        campaignId,
        noteId
      )}`;

      const token = (firebaseAuth.currentUser?.toJSON() as any).stsTokenManager
        .accessToken;
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

      resolve(true);
    } else {
      const updateTitlePromise = updateDoc(
        getCampaignNoteDocument(campaignId, noteId),
        {
          title,
        }
      );

      const updateContentPromise = setDoc(
        getCampaignNoteContentDocument(campaignId, noteId),
        {
          content,
        }
      );

      Promise.all([updateTitlePromise, updateContentPromise])
        .then(() => {
          resolve(true);
        })
        .catch((e) => {
          console.error(e);
          reject("Failed to update note");
        });
    }
  });
};

export function useUpdateCampaignNote() {
  const { call, loading, error } = useApiState(updateCampaignNote);

  return {
    updateCampaignNote: call,
    loading,
    error,
  };
}
