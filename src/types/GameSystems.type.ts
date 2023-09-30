export enum GAME_SYSTEMS {
  IRONSWORN = "ironsworn",
  STARFORGED = "starforged",
}

export type GameSystemChooser<T> = {
  [key in GAME_SYSTEMS]: T;
};
