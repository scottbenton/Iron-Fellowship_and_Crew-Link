import ironswornClassicIdMap from "@datasworn-community/ironsworn-classic/migration/0.1.0/id_map.json";
import ironswornClassicDelveIdMap from "@datasworn-community/ironsworn-classic-delve/migration/0.1.0/id_map.json";
import starforgedIdMap from "@datasworn-community/starforged/migration/0.1.0/id_map.json";

export const idMap: Record<string, string | null> = {
  ...ironswornClassicIdMap,
  ...ironswornClassicDelveIdMap,
  ...starforgedIdMap,
};
