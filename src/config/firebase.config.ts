import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getSystem } from "hooks/useGameSystem";
import { GAME_SYSTEMS, GameSystemChooser } from "types/GameSystems.type";

const gameSystem = getSystem();
const firebaseConfigs: GameSystemChooser<FirebaseOptions> = {
  [GAME_SYSTEMS.IRONSWORN]: {
    apiKey: import.meta.env.VITE_IRON_FELLOWSHIP_FIREBASE_APIKEY,
    authDomain: import.meta.env.VITE_IRON_FELLOWSHIP_FIREBASE_AUTHDOMAIN,
    projectId: import.meta.env.VITE_IRON_FELLOWSHIP_FIREBASE_PROJECTID,
    storageBucket: import.meta.env.VITE_IRON_FELLOWSHIP_FIREBASE_STORAGEBUCKET,
    messagingSenderId: import.meta.env
      .VITE_IRON_FELLOWSHIP_FIREBASE_MESSAGINGSENDERID,
    appId: import.meta.env.VITE_IRON_FELLOWSHIP_FIREBASE_APPID,
  },
  [GAME_SYSTEMS.STARFORGED]: {
    apiKey: import.meta.env.VITE_CREW_LINK_FIREBASE_APIKEY,
    authDomain: import.meta.env.VITE_CREW_LINK_FIREBASE_AUTHDOMAIN,
    projectId: import.meta.env.VITE_CREW_LINK_FIREBASE_PROJECTID,
    storageBucket: import.meta.env.VITE_CREW_LINK_FIREBASE_STORAGEBUCKET,
    messagingSenderId: import.meta.env
      .VITE_CREW_LINK_FIREBASE_MESSAGINGSENDERID,
    appId: import.meta.env.VITE_CREW_LINK_FIREBASE_APPID,
  },
};

export const projectId = firebaseConfigs[gameSystem].projectId;

export const firebaseApp = initializeApp(firebaseConfigs[gameSystem]);

export const firebaseAuth = getAuth(firebaseApp);

export const firestore = getFirestore(firebaseApp);

export const storage = getStorage(firebaseApp);
