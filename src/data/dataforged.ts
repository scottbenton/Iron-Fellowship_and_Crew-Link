import type { Ironsworn } from "dataforged";
import { ironsworn } from "dataforged";

export const ironswornMoveCategories = (
  (ironsworn as any).default as Ironsworn
)["Move categories"];
