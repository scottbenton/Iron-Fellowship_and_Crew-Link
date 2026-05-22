import { ILocationConfig } from "config/locations.config";
import { LocationWithGMProperties } from "stores/world/currentWorld/locations/locations.slice.type";
import { IconColors } from "types/Icon.type";
import { getSectorRegion } from "./forgeLocations";
import { useStore } from "stores/store";
import { Location } from "types/Locations.type";

export const planetConfig: ILocationConfig = {
  defaultIcon: {
    key: "GiWorld",
    color: IconColors.Green,
  },
  name: (locationId, location) => {
    const baseSubTypeId = getBaseSubTypeId(location);
    return baseSubTypeId
      ? {
          oracleIds: [baseSubTypeId + "/name"],
        }
      : undefined;
  },
  sharedFields: [
    {
      type: "autocomplete",
      key: "planetClass",
      label: "Planet Class",
      options: [
        "Desert World",
        "Furnace World",
        "Grave World",
        "Ice World",
        "Jovian World",
        "Jungle World",
        "Ocean World",
        "Rocky World",
        "Shattered World",
        "Tainted World",
        "Vital World",
      ],
    },
    {
      type: "oracle",
      key: "planetDescription",
      label: "Description",
      oracleId: undefined,
      fullWidth: true,
    },
  ],
  gmFields: [
    (locationId, location) => {
      const baseSubTypeId = getBaseSubTypeId(location);
      return {
        key: "planetFeature",
        label: "Feature",
        type: "oracle",
        oracleId: baseSubTypeId ? baseSubTypeId + "/feature" : undefined,
        fullWidth: true,
      };
    },
    (locationId, location) => {
      const baseSubTypeId = getBaseSubTypeId(location);
      return {
        key: "planetAtmosphere",
        label: "Atmosphere",
        type: "oracle",
        oracleId: baseSubTypeId ? baseSubTypeId + "/atmosphere" : undefined,
      };
    },
    (locationId, location) => {
      const baseSubTypeId = getBaseSubTypeId(location);
      const region = getSectorRegion(locationId);
      return {
        key: "planetSettlements",
        label: "Settlements",
        type: "oracle",
        oracleId:
          baseSubTypeId && region
            ? baseSubTypeId + "/settlements/" + region
            : undefined,
      };
    },
    (locationId, location) => {
      const baseSubTypeId = getBaseSubTypeId(location);
      return {
        key: "planetLife",
        label: "Life",
        type: "oracle",
        oracleId: baseSubTypeId ? baseSubTypeId + "/life" : undefined,
      };
    },
    (locationId, location) => {
      const baseSubTypeId = getBaseSubTypeId(location);
      return {
        key: "planetObservedFromSpace",
        label: "Observed From Space",
        type: "oracle",
        oracleId: baseSubTypeId
          ? baseSubTypeId + "/observed_from_space"
          : undefined,
      };
    },
  ],
  createLocation: async (rollOracleTable) => {
    const planetClassResult = await rollOracleTable(
      "starforged/oracles/planets/class",
      false
    );
    const convertedClass =
      planetClassResult?.result?.split(" ")[0].toLocaleLowerCase() ?? "";

    const name = await rollOracleTable(
      `starforged/oracles/planets/${convertedClass}/name`,
      false
    );
    const planetClassCollectionId = convertedClass
      ? `starforged/collections/oracles/planets/${convertedClass}`
      : undefined;

    const description = planetClassCollectionId
      ? useStore.getState().rules.oracleMaps.oracleCollectionMap[
          planetClassCollectionId
        ]?.summary
      : undefined;

    const planet: Partial<Location> = {};
    if (name) {
      planet.name = name.result;
    }
    if (description) {
      planet.fields = {
        planetDescription: description,
      };
    }
    if (planetClassResult?.result) {
      planet.fields = {
        ...planet.fields,
        planetClass: planetClassResult.result,
      };
    }

    return planet;
  },
};

function getPlanetSubType(
  location: LocationWithGMProperties
): string | undefined {
  if (location.type === "planet") {
    const planetClass = location.fields?.planetClass;
    const convertedClass = planetClass?.split(" ")[0].toLocaleLowerCase();
    return convertedClass;
  }
  return undefined;
}

function getBaseSubTypeId(
  location: LocationWithGMProperties
): string | undefined {
  const subType = getPlanetSubType(location);
  return subType ? `starforged/oracles/planets/${subType}` : undefined;
}
