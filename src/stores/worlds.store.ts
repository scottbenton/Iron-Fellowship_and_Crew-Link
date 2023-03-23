import { World } from "types/World.type";
import { create } from "zustand";

export interface WorldsStore {
  worlds: { [key: string]: World };
  loading?: boolean;
  error?: string;
}

export const useWorldsStore = create<WorldsStore>()((set, getState) => ({
  worlds: {
    AHH: {
      name: "Beans World",
    },
  },
  loading: false,
}));
