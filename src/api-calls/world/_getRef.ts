import { firestore } from "config/firebase.config";
import {
  Bytes,
  collection,
  CollectionReference,
  doc,
  DocumentReference,
} from "firebase/firestore";
import {
  decodeDataswornId,
  encodeDataswornId,
} from "functions/dataswornIdEncoder";
import { EncodedWorld, Truth, World } from "types/World.type";

export function constructWorldsPath() {
  return `/worlds`;
}

export function constructWorldDocPath(worldId: string) {
  return `/worlds/${worldId}`;
}

export function getWorldCollection() {
  return collection(
    firestore,
    constructWorldsPath()
  ) as CollectionReference<EncodedWorld>;
}

export function getWorldDoc(worldId: string) {
  return doc(
    firestore,
    constructWorldDocPath(worldId)
  ) as DocumentReference<EncodedWorld>;
}

export function encodeWorld(world: World): EncodedWorld {
  const { truths: decodedTruths, worldDescription, ...remainingWorld } = world;

  const encodedTruths: { [key: string]: Truth } = {};

  if (decodedTruths) {
    Object.keys(decodedTruths).forEach((truthId) => {
      encodedTruths[encodeDataswornId(truthId)] = decodedTruths[truthId];
    });
  }

  const encodedWorld: EncodedWorld = {
    ...remainingWorld,
    truths: encodedTruths,
  };

  if (worldDescription) {
    encodedWorld.worldDescription = Bytes.fromUint8Array(worldDescription);
  }

  return encodedWorld;
}

export function decodeWorld(encodedWorld: EncodedWorld): World {
  const {
    truths: encodedTruths,
    worldDescription,
    ...remainingWorld
  } = encodedWorld;

  const decodedTruths: { [key: string]: Truth } = {};

  if (encodedTruths) {
    Object.keys(encodedTruths).forEach((encodedTruthId) => {
      decodedTruths[decodeDataswornId(encodedTruthId)] =
        encodedTruths[encodedTruthId];
    });
  }

  const world: World = {
    ...remainingWorld,
    worldDescription: worldDescription?.toUint8Array(),
    truths: decodedTruths,
  };

  return world;
}
