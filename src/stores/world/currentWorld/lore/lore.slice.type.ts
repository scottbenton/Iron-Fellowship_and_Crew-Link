import { Unsubscribe } from "firebase/firestore";
import {
  GMLoreDocument,
  LoreDocument,
  LoreDocumentFirestore,
} from "types/Lore.type";

export type LoreDocumentWithGMProperties = LoreDocument & {
  gmProperties?: GMLoreDocument | null;
  notes?: Uint8Array | null;
  imageUrl: string;
};

export interface LoreSliceData {
  loreMap: { [key: string]: LoreDocumentWithGMProperties };
  loading: boolean;
  error?: string;
  openLoreId?: string;
  loreSearch: string;
}

export interface LoreSliceActions {
  subscribe: (worldId: string, worldOwnerIds: string[]) => Unsubscribe;
  setOpenLoreId: (loreId?: string) => void;
  setLoreSearch: (search: string) => void;

  createLore: () => Promise<string>;
  deleteLore: (loreId: string) => Promise<void>;
  updateLore: (
    loreId: string,
    lore: Partial<LoreDocumentFirestore>
  ) => Promise<void>;
  updateLoreGMNotes: (
    loreId: string,
    notes: string,
    isBeaconRequest?: boolean
  ) => Promise<void>;
  updateLoreGMProperties: (
    loreId: string,
    gmProperties: Partial<GMLoreDocument>
  ) => Promise<void>;
  updateLoreNotes: (
    loreId: string,
    notes: Uint8Array,
    isBeaconRequest?: boolean
  ) => Promise<void>;
  uploadLoreImage: (loreId: string, image: File) => Promise<void>;
  subscribeToOpenLore: (loreId: string) => Unsubscribe;
}

export type LoreSlice = LoreSliceData & LoreSliceActions;
