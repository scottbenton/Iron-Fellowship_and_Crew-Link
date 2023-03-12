import produce from "immer";
import { CharacterDocumentWithPortraitUrl } from "stores/character.store";
import { StoredMove } from "types/Moves.type";
import { Note } from "types/Notes.type";
import { StoredOracle } from "types/Oracles.type";
import { create } from "zustand";
import { momentumTrack } from "../../data/defaultTracks";
import { StoredAsset } from "../../types/Asset.type";
import { StoredCampaign } from "../../types/Campaign.type";
import { CharacterDocument } from "../../types/Character.type";
import { StoredTrack, TRACK_TYPES } from "../../types/Track.type";

export type TRACK_KEYS = "health" | "spirit" | "supply" | "momentum";

export type TrackWithId = StoredTrack & { id: string };

export const convertTrackMapToArray = (trackMap: {
  [id: string]: StoredTrack;
}): TrackWithId[] => {
  return Object.keys(trackMap)
    .map((trackId) => {
      return {
        ...trackMap[trackId],
        id: trackId,
      };
    })
    .sort((t1, t2) => {
      const t1Millis = t1.createdTimestamp.toMillis();
      const t2Millis = t2.createdTimestamp.toMillis();
      if (t1Millis < t2Millis) {
        return -1;
      } else if (t1Millis > t2Millis) {
        return 1;
      } else {
        return 0;
      }
    });
};

export interface CharacterSheetStore {
  resetState: () => void;
  characterId?: string;
  character?: CharacterDocumentWithPortraitUrl;

  campaignId?: string;
  campaign?: StoredCampaign;

  supply?: number;

  momentumResetValue?: number;
  maxMomentum?: number;

  portraitUrl?: string;

  setCharacter: (
    characterId?: string,
    character?: CharacterDocumentWithPortraitUrl
  ) => void;
  setCampaign: (campaignId?: string, campaign?: StoredCampaign) => void;
  assets?: StoredAsset[];
  setAssets: (newAssets: StoredAsset[]) => void;

  [TRACK_TYPES.VOW]: {
    character?: TrackWithId[];
    campaign?: TrackWithId[];
  };
  [TRACK_TYPES.JOURNEY]: {
    character?: TrackWithId[];
    campaign?: TrackWithId[];
  };
  [TRACK_TYPES.FRAY]: {
    character?: TrackWithId[];
    campaign?: TrackWithId[];
  };

  setProgressTracks: (
    vows: TrackWithId[],
    journeys: TrackWithId[],
    frays: TrackWithId[],
    isCampaign?: boolean
  ) => void;

  customMoves?: StoredMove[];
  setCustomMoves: (moves: StoredMove[]) => void;

  customOracles?: StoredOracle[];
  setCustomOracles: (oracles: StoredOracle[]) => void;

  notes?: Note[];
  setNotes: (notes: Note[]) => void;
  temporarilyReorderNotes: (noteId: string, order: number) => void;
}

const initialState = {
  characterId: undefined,
  character: undefined,
  campaignId: undefined,
  campaign: undefined,
  supply: undefined,
  assets: undefined,
  customOracles: undefined,
  customMoves: undefined,
  notes: undefined,

  [TRACK_TYPES.VOW]: {},
  [TRACK_TYPES.JOURNEY]: {},
  [TRACK_TYPES.FRAY]: {},
};

export const useCharacterSheetStore = create<CharacterSheetStore>()(
  (set, getState) => ({
    ...initialState,

    resetState: () => {
      set({
        ...getState(),
        ...initialState,
      });
    },

    setCharacter: (characterId?: string, character?: CharacterDocument) => {
      set(
        produce((store: CharacterSheetStore) => {
          if (character) {
            const numberOfActiveDebilities = Object.values(
              character.debilities ?? {}
            ).filter((debility) => debility).length;

            store.maxMomentum = momentumTrack.max - numberOfActiveDebilities;
            if (numberOfActiveDebilities >= 2) {
              store.momentumResetValue = 0;
            } else if (numberOfActiveDebilities === 1) {
              store.momentumResetValue = 1;
            } else {
              store.momentumResetValue = momentumTrack.startingValue;
            }
          } else {
            store.maxMomentum = momentumTrack.max;
            store.momentumResetValue = momentumTrack.startingValue;
          }
          store.characterId = characterId;
          store.character = character;
          if (!store.campaignId) {
            store.supply = character?.supply;
          }
        })
      );
    },

    setAssets: (newAssets) => {
      set(
        produce((store: CharacterSheetStore) => {
          store.assets = newAssets;
        })
      );
    },

    setCampaign: (campaignId?: string, campaign?: StoredCampaign) => {
      set(
        produce((store: CharacterSheetStore) => {
          store.campaignId = campaignId;
          store.campaign = campaign;
          if (campaign) {
            store.supply = campaign?.supply;
          }
        })
      );
    },

    setProgressTracks: (vows, journeys, frays, isCampaign) => {
      set(
        produce((state: CharacterSheetStore) => {
          if (isCampaign) {
            state[TRACK_TYPES.VOW].campaign = vows;
            state[TRACK_TYPES.JOURNEY].campaign = journeys;
            state[TRACK_TYPES.FRAY].campaign = frays;
          } else {
            state[TRACK_TYPES.VOW].character = vows;
            state[TRACK_TYPES.JOURNEY].character = journeys;
            state[TRACK_TYPES.FRAY].character = frays;
          }
        })
      );
    },

    setNotes: (notes) => {
      set(
        produce((state: CharacterSheetStore) => {
          state.notes = notes;
        })
      );
    },

    temporarilyReorderNotes: (noteId: string, order: number) => {
      set(
        produce((state: CharacterSheetStore) => {
          if (!state.notes) return;

          const noteIndex = state.notes.findIndex(
            (note) => note.noteId === noteId
          );

          if (typeof noteIndex !== "number" || noteIndex < 0) return;

          state.notes[noteIndex].order = order;
          state.notes.sort((n1, n2) => n1.order - n2.order);
        })
      );
    },

    setCustomMoves: (moves) => {
      set(
        produce((state: CharacterSheetStore) => {
          state.customMoves = moves;
        })
      );
    },

    setCustomOracles: (oracles) => {
      set(
        produce((state: CharacterSheetStore) => {
          state.customOracles = oracles;
        })
      );
    },
  })
);
