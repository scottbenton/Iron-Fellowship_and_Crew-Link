import produce from "immer";
import { World } from "types/World.type";
import { create } from "zustand";

export interface WorldsStore {
  worlds: { [key: string]: World };
  loading?: boolean;
  error?: string;

  setWorld: (worldId: string, world: World) => void;
  setLoading: (loading: boolean) => void;
  removeWorld: (worldId: string) => void;
}

export const useWorldsStore = create<WorldsStore>()((set, getState) => ({
  worlds: {},
  loading: false,

  setWorld: (worldId, world) => {
    set(
      produce((store: WorldsStore) => {
        store.worlds[worldId] = world;
        store.loading = false;
      })
    );
  },
  setLoading: (isLoading) => {
    set(
      produce((store: WorldsStore) => {
        store.loading = isLoading;
      })
    );
  },
  removeWorld: (worldId) => {
    set(
      produce((store: WorldsStore) => {
        delete store.worlds[worldId];
      })
    );
  },
}));
