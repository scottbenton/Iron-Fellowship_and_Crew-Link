import { TrackWithId } from "features/character-sheet/characterSheet.store";
import produce from "immer";
import { CharacterDocumentWithPortraitUrl } from "stores/character.store";
import { StoredAsset } from "types/Asset.type";
import { StoredCampaign } from "types/Campaign.type";
import { Note } from "types/Notes.type";
import { TRACK_TYPES } from "types/Track.type";
import { UserDocument } from "types/User.type";
import { OracleSettings } from "types/UserSettings.type";
import { create } from "zustand";

export interface CampaignGMScreenStore {
  resetState: () => void;

  campaignId?: string;
  campaign?: StoredCampaign;
  setCampaign: (campaignId: string, campaign?: StoredCampaign) => void;

  players: {
    [uid: string]: UserDocument;
  };
  updatePlayer: (playerId: string, doc: UserDocument) => void;

  characters: {
    [characterId: string]: CharacterDocumentWithPortraitUrl;
  };
  updateCharacter: (
    characterId: string,
    character: CharacterDocumentWithPortraitUrl
  ) => void;
  removeCharacter: (characterId: string) => void;
  updateCharacterPortraitUrl: (
    characterId: string,
    portraitUrl: string
  ) => void;

  characterAssets: { [characterId: string]: StoredAsset[] };
  setCharacterAssets: (characterId: string, assets: StoredAsset[]) => void;

  tracks?: {
    [TRACK_TYPES.VOW]: TrackWithId[];
    [TRACK_TYPES.JOURNEY]: TrackWithId[];
    [TRACK_TYPES.FRAY]: TrackWithId[];
  };
  setTracks: (tracks: {
    [TRACK_TYPES.VOW]: TrackWithId[];
    [TRACK_TYPES.JOURNEY]: TrackWithId[];
    [TRACK_TYPES.FRAY]: TrackWithId[];
  }) => void;

  oracleSettings?: OracleSettings;
  setOracleSettings: (oracleSettings: OracleSettings) => void;

  campaignNotes?: Note[];
  setCampaignNotes: (notes: Note[]) => void;
  temporarilyReorderNotes: (noteId: string, order: number) => void;
}

const initialState = {
  campaignId: undefined,
  campaign: undefined,

  players: {},
  characters: {},
  characterAssets: {},
  tracks: undefined,
  oracleSettings: undefined,
  campaignNotes: undefined,
};

export const useCampaignGMScreenStore = create<CampaignGMScreenStore>()(
  (set, getState) => ({
    resetState: () =>
      set({
        ...getState(),
        ...initialState,
      }),

    setCampaign: (campaignId, campaign) => {
      set(
        produce((store: CampaignGMScreenStore) => {
          store.campaignId = campaignId;
          store.campaign = campaign;
        })
      );
    },

    players: {},
    updatePlayer: (playerId, player) => {
      set(
        produce((store: CampaignGMScreenStore) => {
          store.players[playerId] = player;
        })
      );
    },

    characters: {},
    updateCharacter: (characterId, character) => {
      set(
        produce((store: CampaignGMScreenStore) => {
          store.characters[characterId] = character;
        })
      );
    },
    removeCharacter: (characterId) => {
      set(
        produce((store: CampaignGMScreenStore) => {
          delete store.characters[characterId];
        })
      );
    },
    updateCharacterPortraitUrl: (characterId, portraitUrl) => {
      set(
        produce((store: CampaignGMScreenStore) => {
          store.characters[characterId].portraitUrl = portraitUrl;
        })
      );
    },

    characterAssets: {},
    setCharacterAssets: (characterId, assets) => {
      set(
        produce((store: CampaignGMScreenStore) => {
          store.characterAssets[characterId] = assets;
        })
      );
    },

    setTracks: (tracks) => {
      set(
        produce((store: CampaignGMScreenStore) => {
          store.tracks = tracks;
        })
      );
    },

    setOracleSettings: (settings) => {
      set(
        produce((store: CampaignGMScreenStore) => {
          store.oracleSettings = settings;
        })
      );
    },

    setCampaignNotes: (notes) => {
      set(
        produce((store: CampaignGMScreenStore) => {
          store.campaignNotes = notes;
        })
      );
    },

    temporarilyReorderNotes: (noteId, order) => {
      set(
        produce((store: CampaignGMScreenStore) => {
          if (!store.campaignNotes) return;

          const noteIndex = store.campaignNotes.findIndex(
            (note) => note.noteId === noteId
          );

          if (typeof noteIndex !== "number" || noteIndex < 0) return;

          store.campaignNotes[noteIndex].order = order;
          store.campaignNotes.sort((n1, n2) => n1.order - n2.order);
        })
      );
    },
  })
);
