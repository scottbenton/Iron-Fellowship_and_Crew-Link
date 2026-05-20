import { ILocationConfig } from "config/locations.config";
import { IconColors } from "types/Icon.type";
import { getSectorRegion } from "./forgeLocations";

export function constructSettlementConfig(
  isPlanetSide: boolean
): ILocationConfig {
  return {
    defaultIcon: isPlanetSide
      ? {
          key: "GiByzantinTemple",
          color: IconColors.Grey,
        }
      : {
          key: "GiDefenseSatellite",
          color: IconColors.White,
        },
    name: {
      oracleIds: ["starforged/oracles/settlements/name"],
    },
    gmFields: [
      {
        key: "settlementLocation",
        label: "Location",
        type: "oracle",
        oracleId: "starforged/oracles/settlements/location",
      },
      {
        key: "settlementFirstLook",
        label: "First Look",
        type: "oracle",
        oracleId: "starforged/oracles/settlements/first_look",
      },
      {
        key: "settlementInitialContact",
        label: "Initial Contact",
        type: "oracle",
        oracleId: "starforged/oracles/settlements/initial_contact",
      },
      {
        key: "settlementAuthority",
        label: "Authority",
        type: "oracle",
        oracleId: "starforged/oracles/settlements/authority",
      },
      {
        key: "settlementProjects",
        label: "Projects",
        type: "oracle",
        oracleId: "starforged/oracles/settlements/projects",
      },
      {
        key: "settlementTrouble",
        label: "Trouble",
        type: "oracle",
        oracleId: "starforged/oracles/settlements/trouble",
      },
      (locationId) => {
        const region = getSectorRegion(locationId);
        return {
          key: "settlementPopulation",
          label: "Population",
          type: "oracle",
          oracleId: region
            ? "starforged/oracles/settlements/population/" + region
            : undefined,
        };
      },
    ],
    createLocation: async (rollOracleTable) => {
      const name = await rollOracleTable(
        "starforged/oracles/settlements/name",
        false
      );
      return name?.result
        ? {
            name: name.result,
          }
        : {};
    },
  };
}
