import { DebilityCategories } from "types/Debilities.type";

export const debilities: DebilityCategories[] = [
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
