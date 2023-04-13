import { firebaseAuth } from "config/firebase.config";
import { truths } from "data/truths";
import { TruthOptionClassic } from "dataforged";
import produce from "immer";
import { Truth, TRUTH_IDS, World } from "types/World.type";
import { create } from "zustand";

export const getCustomTruthId = (truthId: string) => {
  return `${truthId}/custom`;
};

export interface WorldCreateStore {
  currentStep: number;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
  setCurrentStep: (stepIndex: number) => void;

  name: string;
  truths: {
    [key in TRUTH_IDS]?: Truth;
  };
  customTruths: {
    [key in TRUTH_IDS]?: TruthOptionClassic;
  };

  setName: (name: string) => void;
  selectWorldTruth: (truthId: TRUTH_IDS, id: string) => void;
  setCustomWorldTruthDescription: (
    truthId: TRUTH_IDS,
    description: string
  ) => void;
  setCustomWorldTruthQuestStarter: (
    truthId: TRUTH_IDS,
    questStarter: string
  ) => void;
  resetStore: () => void;
  stepState: { errorMessage?: string; touched: boolean }[];
  setTouched: (index: number) => void;
  validate: () => Promise<boolean>;
  getWorldFromState: () => Promise<World>;
}

const stepState = [{ touched: false }];
truths.forEach((truth) => stepState.push({ touched: false }));

const initialState = {
  currentStep: 0,
  name: "",
  truths: {},
  customTruths: {},
  stepState,
};

export const useWorldCreateStore = create<WorldCreateStore>()(
  (set, getState) => ({
    ...initialState,

    handleNextStep: () => {
      const state = getState();

      state.setTouched(state.currentStep);
      state.validate();

      set(
        produce((state: WorldCreateStore) => {
          state.currentStep++;
        })
      );
    },
    handlePreviousStep: () => {
      const state = getState();

      state.setTouched(state.currentStep);
      state.validate();

      set(
        produce((state: WorldCreateStore) => {
          state.currentStep--;
        })
      );
    },
    setCurrentStep: (stepIndex) => {
      const state = getState();

      state.setTouched(state.currentStep);
      state.validate();

      set(
        produce((state: WorldCreateStore) => {
          state.currentStep = stepIndex;
        })
      );
    },

    setName: (name: string) => {
      set(
        produce((state: WorldCreateStore) => {
          state.name = name;
        })
      );
    },
    selectWorldTruth: (truthId, id) => {
      set(
        produce((state: WorldCreateStore) => {
          state.truths[truthId] = {
            id,
          };
        })
      );
    },
    setCustomWorldTruthDescription: (truthId, description) => {
      set(
        produce((state: WorldCreateStore) => {
          if (state.customTruths[truthId]) {
            (state.customTruths[truthId] as any).Description = description;
          } else {
            state.customTruths[truthId] = {
              $id: getCustomTruthId(truthId),
              Description: description,
              "Quest starter": "",
            };
          }
        })
      );
    },
    setCustomWorldTruthQuestStarter: (truthId, questStarter) => {
      set(
        produce((state: WorldCreateStore) => {
          if (state.customTruths[truthId]) {
            (state.customTruths[truthId] as any)["Quest starter"] =
              questStarter;
          } else {
            state.customTruths[truthId] = {
              $id: getCustomTruthId(truthId),
              Description: "",
              "Quest starter": questStarter,
            };
          }
        })
      );
    },

    setTouched: (index) => {
      set(
        produce((store: WorldCreateStore) => {
          store.stepState[index].touched = true;
        })
      );
    },

    validate: async () => {
      let isValid = true;
      set(
        produce((store: WorldCreateStore) => {
          if (!store.name) {
            isValid = false;
            store.stepState[0].errorMessage = "Name is required";
          } else {
            store.stepState[0].errorMessage = undefined;
          }
          truths.forEach((truth, index) => {
            if (!store.truths[truth.$id as TRUTH_IDS]) {
              isValid = false;
              store.stepState[index + 1].errorMessage =
                "You must select an option";
            } else {
              store.stepState[index + 1].errorMessage = undefined;
            }
          });
        })
      );
      return isValid;
    },

    getWorldFromState: () =>
      new Promise<World>((resolve, reject) => {
        const state = getState();
        state
          .validate()
          .then((isValid) => {
            if (!isValid) {
              reject("Please fill out all required fields");
            } else {
              const truths: { [key in TRUTH_IDS]: Truth } = JSON.parse(
                JSON.stringify(state.truths)
              ) as {
                [key in TRUTH_IDS]: Truth;
              };

              Object.keys(truths).forEach((truthId) => {
                const typedId = truthId as TRUTH_IDS;
                if (truths[typedId].id === getCustomTruthId(typedId)) {
                  truths[typedId].customTruth = {
                    $id: getCustomTruthId(typedId),
                    Description: state.customTruths[typedId]?.Description ?? "",
                    "Quest starter":
                      state.customTruths[typedId]?.["Quest starter"] ?? "",
                  };
                }
              });

              const world: World = {
                name: state.name,
                truths: truths,
                authorId: firebaseAuth.currentUser?.uid ?? "",
              };
              resolve(world);
            }
          })
          .catch((e) => {
            console.error(e);
            reject("Validation errored out");
          });
      }),

    resetStore: () => {
      set({
        ...getState(),
        ...initialState,
      });
    },
  })
);
