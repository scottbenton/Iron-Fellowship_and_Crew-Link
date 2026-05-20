import ironswornClassicIdMap from "@datasworn/ironsworn-classic/migration/0.1.0/id_map.json";
import ironswornClassicDelveIdMap from "@datasworn/ironsworn-classic-delve/migration/0.1.0/id_map.json";
import starforgedIdMap from "@datasworn/starforged/migration/0.1.0/id_map.json";

export const idMap: Record<string, string | null> = {
  ...ironswornClassicIdMap,
  ...ironswornClassicDelveIdMap,
  ...starforgedIdMap,
};
