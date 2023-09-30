import { getSystem } from "hooks/useGameSystem";
import { DebilityCategories } from "types/Debilities.type";
import { GAME_SYSTEMS, GameSystemChooser } from "types/GameSystems.type";

const ironswornDebilities: DebilityCategories[] = [
  {
    categoryName: "Conditions",
    debilities: ["wounded", "shaken", "unprepared", "encumbered"],
  },
  {
    categoryName: "Banes",
    debilities: ["maimed", "corrupted"],
  },
  {
    categoryName: "Burdens",
    debilities: ["cursed", "tormented"],
  },
];

const starforgedDebilities: DebilityCategories[] = [
  {
    categoryName: "Misfortunes",
    debilities: ["wounded", "shaken", "unprepared"],
  },
  {
    categoryName: "Lasting Effects",
    debilities: ["permanently harmed", "traumatized"],
  },
  {
    categoryName: "Burdens",
    debilities: ["doomed", "tormented", "indebted"],
  },
  {
    categoryName: "Current Vehicles",
    debilities: ["battered", "cursed"],
  },
];

const gameSystem = getSystem();
const debilityChooser: GameSystemChooser<DebilityCategories[]> = {
  [GAME_SYSTEMS.IRONSWORN]: ironswornDebilities,
  [GAME_SYSTEMS.STARFORGED]: starforgedDebilities,
};

export const debilities = debilityChooser[gameSystem];
