import { ILocationConfig } from "config/locations.config";
import { IconColors } from "types/Icon.type";
import { planetConfig } from "./planetConfig";
import { useStore } from "stores/store";
import { LocationWithGMProperties } from "stores/world/currentWorld/locations/locations.slice.type";
import { constructSettlementConfig } from "./settlementConfig";
import { derelictConfig } from "./derelictConfig";
import { vaultConfig } from "./vaultConfig";

export const forgeLocations: ILocationConfig = {
  showBasicBond: false,
  defaultIcon: {
    key: "GiRadarSweep",
    color: IconColors.Green,
  },
  locationTypeOverrides: {
    sector: {
      label: "Sector",
      hideInTools: true,
      config: {
        defaultIcon: {
          key: "GiSolarSystem",
          color: IconColors.White,
        },
        name: {
          oracleIds: [
            "starforged/oracles/space/sector_name/prefix",
            "starforged/oracles/space/sector_name/suffix",
          ],
          joinOracles: true,
        },
        sharedFields: [
          {
            label: "Region",
            key: "region",
            type: "autocomplete",
            options: ["Terminus", "Outlands", "Expanse", "Void"],
          },
        ],
        gmFields: [
          {
            label: "Sector Trouble",
            key: "sectorTrouble",
            type: "oracle",
            oracleId: "starforged/oracles/campaign_launch/sector_trouble",
          },
        ],
      },
    },
    planet: {
      label: "Planet",
      config: planetConfig,
    },
    planetsideSettlement: {
      label: "Planetside Settlement",
      config: constructSettlementConfig(true),
    },
    orbitalSettlement: {
      label: "Non-Planetary Settlement",
      config: constructSettlementConfig(false),
    },
    star: {
      label: "Star",
      config: {
        defaultIcon: {
          key: "GiPolarStar",
          color: IconColors.Yellow,
        },
        sharedFields: [
          {
            label: "Description",
            key: "starDescription",
            oracleId: "starforged/oracles/space/stellar_object",
            type: "oracle",
          },
        ],
        createLocation: async (rollOracleTable) => {
          const description = await rollOracleTable(
            "starforged/oracles/space/stellar_object",
            false
          );
          return {
            fields: {
              starDescription: description?.result ?? "",
            },
          };
        },
      },
    },
    derelict: {
      label: "Derelict",
      config: derelictConfig,
    },
    vault: {
      label: "Vault",
      config: vaultConfig,
    },
  },
};

export function getSectorRegion(locationId: string): string | undefined {
  const locations =
    useStore.getState().worlds.currentWorld.currentWorldLocations.locationMap;
  let location: LocationWithGMProperties | undefined = locations[locationId];
  while (location && location.type !== "sector") {
    const parentId: string | null | undefined = location.parentLocationId;
    location = parentId ? locations[parentId] : undefined;
  }

  return location?.fields?.region?.toLocaleLowerCase();
}
