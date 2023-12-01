import { CreateSliceType } from "stores/store.type";
import { GameLogSlice } from "./gameLog.slice.type";
import { addRoll } from "api-calls/game-log/addRoll";
import { defaultGameLogSlice } from "./gameLog.slice.default";
import { getPaginatedLogs } from "api-calls/game-log/getPaginatedLogs";
import { listenToLogsAfter } from "api-calls/game-log/listenToLogsAfter";
import { updateLog } from "api-calls/game-log/updateLog";

export const createGameLogSlice: CreateSliceType<GameLogSlice> = (
  set,
  getState
) => ({
  ...defaultGameLogSlice,

  addRoll: ({ characterId, campaignId, roll }) => {
    if (!characterId && !campaignId) {
      return new Promise((res, reject) =>
        reject("Either character or campaign Id must be defined.")
      );
    }
    return addRoll({ characterId, campaignId, roll });
  },
  updateRoll: (id, roll) => {
    const campaignId = getState().campaigns.currentCampaign.currentCampaignId;
    const characterId =
      getState().characters.currentCharacter.currentCharacterId;

    if (!characterId && !campaignId) {
      return new Promise((res, reject) =>
        reject("Either character or campaign Id must be defined.")
      );
    }

    return updateLog({ characterId, campaignId, logId: id, log: roll });
  },

  loadMoreLogs: () => {
    const state = getState();
    if (state.gameLog.loading) {
      return;
    }

    const oldestLogDate = state.gameLog.oldestLogDate;
    set((store) => {
      store.gameLog.loading = true;
    });
    const characterId = state.characters.currentCharacter.currentCharacterId;
    const campaignId = state.campaigns.currentCampaign.currentCampaignId;
    const isGM =
      (!campaignId ||
        state.campaigns.currentCampaign.currentCampaign?.gmIds?.includes(
          state.auth.uid
        )) ??
      false;

    getPaginatedLogs({
      oldestLogDate,
      characterId,
      campaignId,
      amountToFetch: 20,
      isGM,
    })
      .then((logs) => {
        set((store) => {
          store.gameLog.loading = false;
          store.gameLog.logs = [...logs, ...store.gameLog.logs];
          if (logs.length > 0) {
            store.gameLog.oldestLogDate = logs[0].timestamp;
            if (!store.gameLog.newestLogDate) {
              store.gameLog.newestLogDate = logs[logs.length - 1].timestamp;
            }
          } else if (!store.gameLog.oldestLogDate) {
            store.gameLog.oldestLogDate = new Date();
            store.gameLog.newestLogDate = new Date();
          }
        });
      })
      .catch((e) => console.error(e));
  },

  subscribe: (params) => {
    const state = getState();

    const isGM =
      (!params.campaignId ||
        state.campaigns.currentCampaign.currentCampaign?.gmIds?.includes(
          state.auth.uid
        )) ??
      false;
    return listenToLogsAfter({
      ...params,
      isGM,
      onRoll: (logId, log) => {
        set((store) => {
          store.gameLog.logs.push(log);
        });
      },
      onError: (error) => {
        console.error(error);
      },
    });
  },

  resetStore: () => {
    set((store) => {
      store.gameLog = { ...store.gameLog, ...defaultGameLogSlice };
    });
  },
});
