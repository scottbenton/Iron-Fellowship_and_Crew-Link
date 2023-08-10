import { createWithEqualityFn } from "zustand/traditional";
import { immer } from "zustand/middleware/immer";
import { IStore } from "./store.type";
import { createCharacterSlice } from "./character/character.slice";
import { createAuthSlice } from "./auth/auth.slice";
import { createCampaignSlice } from "./campaign/campaign.slice";
import { createUsersSlice } from "./user/users.slice";
import { createWorldSlice } from "./world/world.slice";
import { shallow } from "zustand/shallow";

export const useStore = createWithEqualityFn<IStore>()(
  immer((...params) => ({
    characters: createCharacterSlice(...params),
    campaigns: createCampaignSlice(...params),
    worlds: createWorldSlice(...params),
    auth: createAuthSlice(...params),
    users: createUsersSlice(...params),
  })),
  shallow
);
