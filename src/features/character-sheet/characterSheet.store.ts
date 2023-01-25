import {
  arrayRemove,
  arrayUnion,
  deleteField,
  onSnapshot,
  setDoc,
  Unsubscribe,
  updateDoc,
} from "firebase/firestore";
import produce from "immer";
import create from "zustand";
import { firebaseAuth } from "../../config/firebase.config";
import { momentumTrack } from "../../data/defaultTracks";
import {
  getCampaignDoc,
  getCharacterAssetDoc,
  getCharacterDoc,
  getCharacterTracksDoc,
  getSharedCampaignTracksCollection,
} from "../../lib/firebase.lib";
import { StoredAsset } from "../../types/Asset.type";
import { StoredCampaign } from "../../types/Campaign.type";
import { CharacterDocument } from "../../types/Character.type";
import { DEBILITIES } from "../../types/debilities.enum";
import { STATS } from "../../types/stats.enum";
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
  character?: CharacterDocument;

  campaignId?: string;
  campaign?: StoredCampaign;

  supply?: number;

  momentumResetValue?: number;
  maxMomentum?: number;

  setCharacter: (characterId?: string, character?: CharacterDocument) => void;
  setCampaign: (campaignId?: string, campaign?: StoredCampaign) => void;

  updateStat: (stat: STATS, newValue: number) => Promise<boolean>;
  updateCharacterTrack: (
    trackKey: TRACK_KEYS,
    trackValue: number
  ) => Promise<boolean>;

  assets?: StoredAsset[];
  loadAssets: () => Unsubscribe | undefined;
  addAsset: (asset: StoredAsset) => Promise<boolean>;
  removeAsset: (assetId: string) => Promise<boolean>;
  updateAssetInput: (
    assetId: string,
    label: string,
    value: string
  ) => Promise<boolean>;
  updateAssetAbilityCheckbox: (
    assetId: string,
    abilityIndex: number,
    checked: boolean
  ) => Promise<boolean>;
  updateAssetTrack: (assetId: string, value: number) => Promise<boolean>;
  updateAssetMultiTrack: (assetId: string, value: string) => Promise<boolean>;

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

  loadProgressTracks: () => () => void;

  addProgressTrack: (
    type: TRACK_TYPES,
    track: StoredTrack,
    shared?: boolean
  ) => Promise<boolean>;
  updateProgressTrackValue: (
    type: TRACK_TYPES,
    shared: boolean,
    id: string,
    value: number
  ) => Promise<boolean>;

  removeProgressTrack: (
    type: TRACK_TYPES,
    shared: boolean,
    id: string
  ) => Promise<boolean>;

  updateExperience: (
    value: number,
    type: "spent" | "earned"
  ) => Promise<boolean>;
  updateBonds: (value: number) => Promise<boolean>;
  updateName: (value: string) => Promise<boolean>;
  updateDebility: (debility: DEBILITIES, active: boolean) => Promise<boolean>;
}

const initialState = {
  characterId: undefined,
  character: undefined,
  campaignId: undefined,
  campaign: undefined,
  supply: undefined,
  assets: undefined,

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

    loadAssets: () => {
      const { characterId } = getState();
      const uid = firebaseAuth.currentUser?.uid;

      if (uid && characterId) {
        return onSnapshot(
          getCharacterAssetDoc(uid, characterId),
          (snapshot) => {
            const data = snapshot.data();
            const assets = data?.assets;
            const assetOrder = data?.assetOrder;

            if (assets && assetOrder) {
              const orderedAssets = assetOrder.map(
                (assetId) => assets[assetId]
              );
              set(
                produce((store: CharacterSheetStore) => {
                  store.assets = orderedAssets;
                })
              );
            }
          }
        );
      }
      return undefined;
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

    updateStat: (stat: STATS, newValue: number) => {
      return new Promise((resolve, reject) => {
        const uid = firebaseAuth.currentUser?.uid;
        const characterId = getState().characterId ?? "";

        const statKey = `stats.${stat}`;

        if (uid) {
          updateDoc(getCharacterDoc(uid, characterId), {
            [statKey]: newValue,
          })
            .then(() => {
              resolve(true);
            })
            .catch((e) => {
              console.error(e);
              reject("Failed to update " + stat);
            });
        } else {
          reject("No user found.");
        }
      });
    },

    updateCharacterTrack: async (trackKey, trackValue): Promise<boolean> => {
      const uid = firebaseAuth.currentUser?.uid;
      const { characterId = "", campaignId } = getState();

      if (uid) {
        let campaignPromise;
        try {
          if (campaignId && trackKey === "supply") {
            campaignPromise = updateDoc(getCampaignDoc(campaignId), {
              supply: trackValue,
            });
          }
          const characterPromise = updateDoc(
            getCharacterDoc(uid, characterId),
            {
              [trackKey]: trackValue,
            }
          );

          await Promise.all([campaignPromise, characterPromise]);
        } catch (e) {
          console.error(e);
          throw new Error("Error updating track");
        }
        return true;
      } else {
        throw new Error("No user found.");
      }
    },

    addAsset: (asset) => {
      return new Promise((resolve, reject) => {
        const uid = firebaseAuth.currentUser?.uid;
        const characterId = getState().characterId ?? "";
        if (uid) {
          //@ts-ignore
          updateDoc(getCharacterAssetDoc(uid, characterId), {
            assetOrder: arrayUnion(asset.id),
            [`assets.${asset.id}`]: asset,
          })
            .then(() => {
              resolve(true);
            })
            .catch((e) => {
              console.error(e);
              reject("Error adding asset");
            });
        } else {
          reject("No user found");
        }
      });
    },

    removeAsset: (assetId: string) => {
      return new Promise<boolean>((resolve, reject) => {
        const uid = firebaseAuth.currentUser?.uid;
        const characterId = getState().characterId;
        if (uid && characterId) {
          //@ts-ignore
          updateDoc(getCharacterAssetDoc(uid, characterId), {
            assetOrder: arrayRemove(assetId),
            [`assets.${assetId}`]: deleteField(),
          })
            .then(() => {
              resolve(true);
            })
            .catch((e) => {
              console.error(e);
              reject("Error removing asset");
            });
        } else {
          reject("No user found");
        }
      });
    },

    updateAssetInput: (assetId, label, value) =>
      new Promise((resolve, reject) => {
        const uid = firebaseAuth.currentUser?.uid;
        const characterId = getState().characterId ?? "";

        if (uid) {
          //@ts-ignore
          updateDoc(getCharacterAssetDoc(uid, characterId), {
            [`assets.${assetId}.inputs.${label}`]: value,
          })
            .then(() => {
              resolve(true);
            })
            .catch((e) => {
              console.error(e);
              reject("Error updating asset label");
            });
        } else {
          reject("No user found");
        }
      }),

    updateAssetAbilityCheckbox: (assetId, abilityIndex, checked) => {
      return new Promise<boolean>((resolve, reject) => {
        const uid = firebaseAuth.currentUser?.uid;
        const characterId = getState().characterId;
        if (uid && characterId) {
          //@ts-ignore
          updateDoc(getCharacterAssetDoc(uid, characterId), {
            [`assets.${assetId}.enabledAbilities.${abilityIndex}`]: checked,
          })
            .then(() => {
              resolve(true);
            })
            .catch((e) => {
              console.error(e);
              reject("Error updating asset ability");
            });
        } else {
          reject("No user found");
        }
      });
    },
    updateAssetTrack: (assetId, value) => {
      return new Promise((resolve, reject) => {
        const uid = firebaseAuth.currentUser?.uid;
        const characterId = getState().characterId;
        if (uid && characterId) {
          //@ts-ignore
          updateDoc(getCharacterAssetDoc(uid, characterId), {
            [`assets.${assetId}.trackValue`]: value,
          })
            .then(() => {
              resolve(true);
            })
            .catch((e) => {
              console.error(e);
              reject("Error updating asset value");
            });
        } else {
          reject("No user found");
        }
      });
    },
    updateAssetMultiTrack: (assetId, value) => {
      return new Promise<boolean>((resolve, reject) => {
        const uid = firebaseAuth.currentUser?.uid;
        const characterId = getState().characterId;

        if (uid && characterId) {
          //@ts-ignore
          updateDoc(getCharacterAssetDoc(uid, characterId), {
            [`assets.${assetId}.multiFieldTrackValue`]: value,
          })
            .then(() => {
              resolve(true);
            })
            .catch((e) => {
              console.error(e);
              reject("Error updating asset value");
            });
        } else {
          reject("No user found");
        }
      });
    },

    loadProgressTracks: () => {
      let unsubscribeFromSharedTracks: Unsubscribe;
      let unsubscribeFromCharacterTracks: Unsubscribe;

      const uid = firebaseAuth.currentUser?.uid;

      const characterId = getState().characterId;
      const campaignId = getState().campaignId;

      if (characterId && uid) {
        unsubscribeFromCharacterTracks = onSnapshot(
          getCharacterTracksDoc(uid, characterId),
          (snapshot) => {
            const data = snapshot.data();

            const vows = convertTrackMapToArray(data?.[TRACK_TYPES.VOW] ?? {});
            const journeys = convertTrackMapToArray(
              data?.[TRACK_TYPES.JOURNEY] ?? {}
            );
            const frays = convertTrackMapToArray(
              data?.[TRACK_TYPES.FRAY] ?? {}
            );

            set(
              produce((state: CharacterSheetStore) => {
                state[TRACK_TYPES.VOW].character = vows;
                state[TRACK_TYPES.JOURNEY].character = journeys;
                state[TRACK_TYPES.FRAY].character = frays;
              })
            );
          }
        );
      }

      if (campaignId && uid) {
        unsubscribeFromSharedTracks = onSnapshot(
          getSharedCampaignTracksCollection(campaignId),
          (snapshot) => {
            const data = snapshot.data();

            const vows = convertTrackMapToArray(data?.[TRACK_TYPES.VOW] ?? {});
            const journeys = convertTrackMapToArray(
              data?.[TRACK_TYPES.JOURNEY] ?? {}
            );
            const frays = convertTrackMapToArray(
              data?.[TRACK_TYPES.FRAY] ?? {}
            );

            set(
              produce((state: CharacterSheetStore) => {
                state[TRACK_TYPES.VOW].campaign = vows;
                state[TRACK_TYPES.JOURNEY].campaign = journeys;
                state[TRACK_TYPES.FRAY].campaign = frays;
              })
            );
          }
        );
      }

      return () => {
        unsubscribeFromSharedTracks && unsubscribeFromSharedTracks();
        unsubscribeFromCharacterTracks && unsubscribeFromCharacterTracks();
      };
    },

    addProgressTrack: (type, track, shared) => {
      return new Promise<boolean>((resolve, reject) => {
        const uid = firebaseAuth.currentUser?.uid;
        const { campaignId, characterId } = getState();

        if (!uid) {
          reject("No user found");
          return;
        }
        if (shared && !campaignId) {
          reject("No campaign found");
          return;
        } else if (!shared && !characterId) {
          reject("No character found");
          return;
        }

        setDoc(
          shared
            ? getSharedCampaignTracksCollection(campaignId ?? "")
            : getCharacterTracksDoc(uid, characterId ?? ""),
          {
            [type]: {
              [track.label + track.createdTimestamp.toString()]: track,
            },
          },
          { merge: true }
        )
          .then(() => {
            resolve(true);
          })
          .catch((e) => {
            console.error(e);
            reject("Failed to add shared progress track");
          });
      });
    },

    updateProgressTrackValue: (type, shared, id, value) => {
      return new Promise((resolve, reject) => {
        const uid = firebaseAuth.currentUser?.uid;
        const { campaignId, characterId } = getState();

        if (!uid) {
          reject("No user found");
          return;
        }
        if (shared && !campaignId) {
          reject("No campaign found");
          return;
        } else if (!shared && !characterId) {
          reject("No character found");
          return;
        }

        updateDoc(
          shared
            ? getSharedCampaignTracksCollection(campaignId ?? "")
            : getCharacterTracksDoc(uid, characterId ?? ""),
          //@ts-ignore
          {
            [`${type}.${id}.value`]: value,
          }
        )
          .then(() => {
            resolve(true);
          })
          .catch((e) => {
            console.error(e);
            reject("Failed to update progress track");
          });
      });
    },

    removeProgressTrack: (type, shared, id) => {
      return new Promise((resolve, reject) => {
        const uid = firebaseAuth.currentUser?.uid;
        const { campaignId, characterId } = getState();

        if (!uid) {
          reject("No user found");
          return;
        }
        if (shared && !campaignId) {
          reject("No campaign found");
          return;
        } else if (!shared && !characterId) {
          reject("No character found");
          return;
        }

        updateDoc(
          shared
            ? getSharedCampaignTracksCollection(campaignId ?? "")
            : getCharacterTracksDoc(uid, characterId ?? ""),
          //@ts-ignore
          {
            [`${type}.${id}`]: deleteField(),
          }
        )
          .then(() => {
            resolve(true);
          })
          .catch((e) => {
            console.error(e);
            reject("Failed to remove progress track");
          });
      });
    },

    updateExperience: (value, type) => {
      return new Promise((resolve, reject) => {
        const uid = firebaseAuth.currentUser?.uid;
        const characterId = getState().characterId ?? "";

        if (uid) {
          updateDoc(getCharacterDoc(uid, characterId), {
            [`experience.${type}`]: value,
          })
            .then(() => {
              resolve(true);
            })
            .catch((e) => {
              console.error(e);
              reject("Failed to update experience");
            });
        } else {
          reject("No user found.");
        }
      });
    },

    updateBonds: (value) => {
      return new Promise((resolve, reject) => {
        const uid = firebaseAuth.currentUser?.uid;
        const characterId = getState().characterId ?? "";

        if (uid) {
          updateDoc(getCharacterDoc(uid, characterId), {
            bonds: value,
          })
            .then(() => {
              resolve(true);
            })
            .catch((e) => {
              console.error(e);
              reject("Failed to update bonds");
            });
        } else {
          reject("No user found.");
        }
      });
    },

    updateName: (value) => {
      return new Promise((resolve, reject) => {
        const uid = firebaseAuth.currentUser?.uid;
        const characterId = getState().characterId ?? "";

        if (uid) {
          updateDoc(getCharacterDoc(uid, characterId), {
            name: value,
          })
            .then(() => {
              resolve(true);
            })
            .catch((e) => {
              console.error(e);
              reject("Failed to update bonds");
            });
        } else {
          reject("No user found.");
        }
      });
    },

    updateDebility: (debility, active) => {
      return new Promise((resolve, reject) => {
        const uid = firebaseAuth.currentUser?.uid;
        const state = getState();
        const characterId = state.characterId ?? "";
        const maxMomentum = getState().maxMomentum;
        const momentum = getState().character?.momentum;

        if (uid) {
          let newMomentum = momentum;
          if (
            active === true &&
            typeof momentum === "number" &&
            maxMomentum &&
            maxMomentum - 1 < momentum
          ) {
            newMomentum = maxMomentum - 1;
          }
          updateDoc(getCharacterDoc(uid, characterId), {
            [`debilities.${debility}`]: active,
            momentum: newMomentum,
          })
            .then(() => {
              resolve(true);
            })
            .catch((e) => {
              console.error(e);
              reject("Failed to update debilities");
            });
        } else {
          reject("No user found.");
        }
      });
    },
  })
);
