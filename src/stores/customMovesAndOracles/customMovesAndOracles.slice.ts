import { CreateSliceType } from "stores/store.type";
import { CustomMovesAndOraclesSlice } from "./customMovesAndOracles.slice.type";
import { defaultCustomMovesAndOracles } from "./customMovesAndOracles.slice.default";
import { Unsubscribe } from "firebase/firestore";
import { listenToCustomMoves } from "api-calls/user/custom-moves/listenToCustomMoves";
import { listenToCustomOracles } from "api-calls/user/custom-oracles/listenToCustomOracles";
import { listenToSettings } from "api-calls/custom-move-oracle-settings/listenToSettings";
import { listenToOracleSettings } from "api-calls/custom-move-oracle-settings/settings/listenToOracleSettings";
import { showOrHideCustomMove } from "api-calls/custom-move-oracle-settings/showOrHideCustomMove";
import { showOrHideCustomOracle } from "api-calls/custom-move-oracle-settings/showOrHideCustomOracle";
import { addCustomMove } from "api-calls/user/custom-moves/addCustomMove";
import { updateCustomMove } from "api-calls/user/custom-moves/updateCustomMove";
import { removeCustomMove } from "api-calls/user/custom-moves/removeCustomMove";
import { addCustomOracle } from "api-calls/user/custom-oracles/addCustomOracle";
import { updateCustomOracle } from "api-calls/user/custom-oracles/updateCustomOracle";
import { removeCustomOracle } from "api-calls/user/custom-oracles/removeCustomOracle";
import { updatePinnedOracle } from "api-calls/custom-move-oracle-settings/settings/updatePinnedOracle";
import { updateSettings } from "api-calls/custom-move-oracle-settings/updateSettings";

export const createCustomMovesAndOraclesSlice: CreateSliceType<
  CustomMovesAndOraclesSlice
> = (set, getState) => ({
  ...defaultCustomMovesAndOracles,

  subscribe: (uids) => {
    getState().users.loadUserDocuments(uids);
    const unsubscribes: Unsubscribe[] = [];

    uids.forEach((uid) => {
      unsubscribes.push(
        listenToCustomMoves(
          uid,
          (moves) => {
            set((store) => {
              store.customMovesAndOracles.customMoves[uid] = moves;
            });
          },
          (error) => {
            console.error(error);
          }
        )
      );

      unsubscribes.push(
        listenToCustomOracles(
          uid,
          (oracles) => {
            set((store) => {
              store.customMovesAndOracles.customOracles[uid] = oracles;
            });
          },
          (error) => {
            console.error(error);
          }
        )
      );
    });
    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
      getState().customMovesAndOracles.resetStore();
    };
  },

  subscribeToSettings: ({ characterId, campaignId }) => {
    if (characterId || campaignId) {
      return listenToSettings(
        campaignId,
        characterId,
        (settings) => {
          set((store) => {
            store.customMovesAndOracles.hiddenCustomMoveIds =
              settings.hiddenCustomMoveIds;
            store.customMovesAndOracles.hiddenCustomOracleIds =
              settings.hiddenCustomOraclesIds;
            store.customMovesAndOracles.delve = {
              showDelveMoves: !settings.hideDelveMoves,
              showDelveOracles: !settings.hideDelveOracles,
            };
          });
        },
        (error) => {
          console.error(error);
        }
      );
    }
    return () => {};
  },

  subscribeToPinnedOracleSettings: (uid) => {
    return listenToOracleSettings(
      uid,
      (settings) => {
        set((store) => {
          store.customMovesAndOracles.pinnedOraclesIds =
            settings.pinnedOracleSections ?? {};
        });
      },
      (error) => {
        console.error(error);
      }
    );
  },

  toggleCustomMoveVisibility: (moveId, hidden) => {
    const state = getState();

    const campaignId = state.campaigns.currentCampaign.currentCampaignId;
    const characterId = state.characters.currentCharacter.currentCharacterId;

    return showOrHideCustomMove({ campaignId, characterId, moveId, hidden });
  },
  toggleCustomOracleVisibility: (oracleId, hidden) => {
    const state = getState();

    const campaignId = state.campaigns.currentCampaign.currentCampaignId;
    const characterId = state.characters.currentCharacter.currentCharacterId;

    return showOrHideCustomOracle({
      campaignId,
      characterId,
      oracleId,
      hidden,
    });
  },

  addCustomMove: (customMove) => {
    const uid = getState().auth.uid;

    return addCustomMove({ uid, customMove });
  },
  updateCustomMove: (moveId, customMove) => {
    const uid = getState().auth.uid;

    return updateCustomMove({ uid, moveId, customMove });
  },
  removeCustomMove: (moveId) => {
    const uid = getState().auth.uid;

    return removeCustomMove({ uid, moveId });
  },

  addCustomOracle: (customOracle) => {
    const uid = getState().auth.uid;

    return addCustomOracle({ uid, customOracle });
  },
  updateCustomOracle: (oracleId, customOracle) => {
    const uid = getState().auth.uid;

    return updateCustomOracle({ uid, oracleId, customOracle });
  },
  removeCustomOracle: (oracleId) => {
    const uid = getState().auth.uid;

    return removeCustomOracle({ uid, oracleId });
  },
  togglePinnedOracle: (oracleId, pinned) => {
    const uid = getState().auth.uid;

    return updatePinnedOracle({ uid, oracleId, pinned });
  },

  updateSettings: (settings) => {
    const state = getState();

    const campaignId = state.campaigns.currentCampaign.currentCampaignId;
    const characterId = state.characters.currentCharacter.currentCharacterId;

    return updateSettings({
      campaignId,
      characterId,
      settings,
    });
  },

  resetStore: () => {
    set((state) => {
      const pinnedOraclesIds = state.customMovesAndOracles.pinnedOraclesIds;
      state.customMovesAndOracles = {
        ...state.customMovesAndOracles,
        ...defaultCustomMovesAndOracles,
        pinnedOraclesIds,
      };
    });
  },
});
