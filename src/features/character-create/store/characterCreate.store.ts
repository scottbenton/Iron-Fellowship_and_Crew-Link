import produce from "immer";
import create from "zustand";
import { STATS } from "../../../types/stats.enum";
import { StoredAsset } from "../../../types/Asset.type";
import { assets } from "../../../data/assets";
import { createFirebaseCharacter } from "../api/createCharacter";
import { StatsMap } from "../../../types/Character.type";

export interface CharacterCreateStore {
  name: string;
  setName: (name: string) => void;

  stats: { [key in STATS]: number | undefined };
  setStat: (stat: STATS, value: number | undefined) => void;

  assets: [
    StoredAsset | undefined,
    StoredAsset | undefined,
    StoredAsset | undefined
  ];
  selectAsset: (index: number, assetId?: string) => void;

  createCharacter: () => Promise<string>;

  resetState: () => void;
}

const defaultState: {
  name: string;
  stats: CharacterCreateStore["stats"];
  assets: CharacterCreateStore["assets"];
} = {
  name: "",
  stats: {
    [STATS.EDGE]: undefined,
    [STATS.HEART]: undefined,
    [STATS.IRON]: undefined,
    [STATS.SHADOW]: undefined,
    [STATS.WITS]: undefined,
  },
  assets: [undefined, undefined, undefined],
};

export const useCharacterCreateStore = create<CharacterCreateStore>()(
  (set, getState) => ({
    ...defaultState,
    setName: (name) => set({ name }),
    setStat: (stat, value) =>
      set(
        produce((state: CharacterCreateStore) => {
          state.stats[stat] = value;
        })
      ),
    selectAsset: (index, assetId) => {
      if (assetId) {
        const asset = assets[assetId];

        let inputs: StoredAsset["inputs"];
        asset.inputs?.forEach((input) => {
          if (!inputs) {
            inputs = {};
          }
          inputs[input] = "";
        });

        const storedAsset: StoredAsset = {
          id: assetId,
          enabledAbilities: asset.abilities.map(
            (ability) => ability.startsEnabled ?? false
          ),
        };

        if (inputs) {
          storedAsset.inputs = inputs;
        }
        if (asset.track) {
          storedAsset.trackValue = asset.track.startingValue ?? asset.track.max;
        }

        set(
          produce((state: CharacterCreateStore) => {
            state.assets[index] = storedAsset;
          })
        );
      } else {
        set(
          produce((state: CharacterCreateStore) => {
            state.assets[index] = undefined;
          })
        );
      }
    },
    createCharacter: () =>
      new Promise<string>((resolve, reject) => {
        const { name, stats, assets } = getState();

        if (!name) {
          reject("Name is required");
        } else if (
          !stats[STATS.EDGE] ||
          !stats[STATS.IRON] ||
          !stats[STATS.HEART] ||
          !stats[STATS.SHADOW] ||
          !stats[STATS.WITS]
        ) {
          reject("Stats are required");
        } else if (!assets[0] || !assets[1] || !assets[2]) {
          reject("Assets are required");
        } else {
          createFirebaseCharacter(
            name,
            stats as StatsMap,
            assets as [StoredAsset, StoredAsset, StoredAsset]
          )
            .then((id) => {
              resolve(id);
            })
            .catch((err) => {
              reject(err);
            });
        }
      }),

    resetState: () => {
      set({
        ...getState(),
        ...defaultState,
      });
    },
  })
);
