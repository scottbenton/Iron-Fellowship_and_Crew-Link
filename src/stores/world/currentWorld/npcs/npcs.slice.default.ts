import { NPCsSliceData } from "./npcs.slice.type";

export const defaultNPCsSlice: NPCsSliceData = {
  npcMap: {},
  loading: false,
  npcSearch: "",
  error: undefined,
  openNPCId: undefined,
};
