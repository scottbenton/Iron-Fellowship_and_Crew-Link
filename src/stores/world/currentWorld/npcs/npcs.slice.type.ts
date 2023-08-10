import { Unsubscribe } from "firebase/firestore";
import {
  GMNPCDocument,
  NPCDocument,
  NPCDocumentFirestore,
} from "types/NPCs.type";

export type NPCDocumentWithGMProperties = NPCDocument & {
  gmProperties?: GMNPCDocument | null;
  notes?: Uint8Array | null;
  imageUrl: string;
};

export interface NPCsSliceData {
  npcMap: { [key: string]: NPCDocumentWithGMProperties };
  loading: boolean;
  error?: string;
  openNPCId?: string;
  npcSearch: string;
}

export interface NPCsSliceActions {
  subscribe: (worldId: string, worldOwnerIds: string[]) => Unsubscribe;
  setOpenNPCId: (npcId?: string) => void;
  setNPCSearch: (search: string) => void;

  createNPC: () => Promise<string>;
  deleteNPC: (npcId: string) => Promise<void>;
  updateNPC: (
    npcId: string,
    npc: Partial<NPCDocumentFirestore>
  ) => Promise<void>;
  updateNPCGMNotes: (
    npcId: string,
    notes: string,
    isBeaconRequest?: boolean
  ) => Promise<void>;
  updateNPCGMProperties: (
    npcId: string,
    gmProperties: Partial<GMNPCDocument>
  ) => Promise<void>;
  updateNPCNotes: (
    npcId: string,
    notes: Uint8Array,
    isBeaconRequest?: boolean
  ) => Promise<void>;
  uploadNPCImage: (npcId: string, image: File) => Promise<void>;
  subscribeToOpenNPC: (npcId: string) => Unsubscribe;

  resetStore: () => void;
}

export type NPCsSlice = NPCsSliceData & NPCsSliceActions;
