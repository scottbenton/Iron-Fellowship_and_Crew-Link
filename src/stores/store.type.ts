import { StateCreator } from "zustand";
import { CharacterSlice } from "./character/character.slice.type";
import { AuthSlice } from "./auth/auth.slice.type";
import { CampaignSlice } from "./campaign/campaign.slice.type";
import { UserSlice } from "./user/users.slice.type";
import { WorldSlice } from "./world/world.slice.type";

export type IStore = {
  auth: AuthSlice;
  characters: CharacterSlice;
  campaigns: CampaignSlice;
  users: UserSlice;
  worlds: WorldSlice;
};

export type CreateSliceType<T> = StateCreator<
  IStore,
  [["zustand/immer", never]],
  [],
  T
>;
