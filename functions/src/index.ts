/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { getFirestore, FieldValue } from "firebase-admin/firestore";
import * as admin from "firebase-admin";
import { onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
export { requestOtpSignIn, verifyOtpSignIn } from "./authOtp";

admin.initializeApp();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const getHomebrewEditorInviteKey = onCall<
  { homebrewCollectionId: string },
  Promise<string | null>
>(async (request) => {
  const homebrewCollectionId = request.data.homebrewCollectionId;
  const uid = request.auth?.uid;

  if (!uid) {
    logger.warn("User was not authenticated");
    return null;
  }

  const homebrewCollection = (
    await getFirestore()
      .doc(`/homebrew/homebrew/collections/${homebrewCollectionId}`)
      .get()
  ).data();

  logger.info(homebrewCollection);

  if (!homebrewCollection) {
    logger.warn("Homebrew Collection could not be found.");
    return null;
  }
  if (!homebrewCollection.editors.includes(uid)) {
    logger.warn(
      "User was not an editor of the collection.",
      homebrewCollection.editors,
      uid
    );
    return null;
  }

  const linkDocuments = (
    await getFirestore()
      .collection("/homebrew/homebrew/editorInviteKeys")
      .where("collectionId", "==", homebrewCollectionId)
      .get()
  ).docs;

  if (linkDocuments.length === 0) {
    logger.info("No link documents found, creating one.");
    const doc = await getFirestore()
      .collection("/homebrew/homebrew/editorInviteKeys")
      .add({
        collectionId: homebrewCollectionId,
      });

    return doc.id;
  }

  return linkDocuments[0].id;
});

export const getHomebrewIdFromInviteKey = onCall<
  { inviteKey: string },
  Promise<string | null>
>(async (request) => {
  const inviteKey = request.data.inviteKey;
  const uid = request.auth?.uid;

  if (!uid) {
    logger.warn("User was not authenticated");
    return null;
  }

  const collectionId = (
    await getFirestore()
      .doc(`/homebrew/homebrew/editorInviteKeys/${inviteKey}`)
      .get()
  ).data()?.collectionId;

  if (!collectionId) {
    logger.error(`Couldn't find homebrew id from invite key ${inviteKey}`);
    return null;
  }

  return collectionId;
});

export const addCurrentUserAsHomebrewCampaignEditor = onCall<
  { inviteKey: string; homebrewCollectionId: string },
  Promise<boolean>
>(async (request) => {
  const inviteKey = request.data.inviteKey;
  const homebrewCollectionId = request.data.homebrewCollectionId;
  const uid = request.auth?.uid;

  if (!uid) {
    logger.warn("User was not authenticated");
    return false;
  }

  const collectionId = (
    await getFirestore()
      .doc(`/homebrew/homebrew/editorInviteKeys/${inviteKey}`)
      .get()
  ).data()?.collectionId;

  if (!collectionId) {
    logger.error(`Couldn't find homebrew id from invite key ${inviteKey}`);
    return false;
  }
  if (collectionId !== homebrewCollectionId) {
    logger.error(
      `Request collection id ${homebrewCollectionId} did not match stored collection ID ${collectionId}.`
    );

    return false;
  }

  await getFirestore()
    .doc(`/homebrew/homebrew/collections/${homebrewCollectionId}`)
    .update({ editors: FieldValue.arrayUnion(uid) });

  return true;
});

export const removeCurrentUserAsHomebrewCampaignEditor = onCall<
  { homebrewCollectionId: string },
  Promise<boolean>
>(async (request) => {
  const homebrewCollectionId = request.data.homebrewCollectionId;
  const uid = request.auth?.uid;

  if (!uid) {
    logger.warn("User was not authenticated");
    return false;
  }

  await getFirestore()
    .doc(`/homebrew/homebrew/collections/${homebrewCollectionId}`)
    .update({ editors: FieldValue.arrayRemove(uid) });

  return true;
});
