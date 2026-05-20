import { LocationWithGMProperties } from "stores/world/currentWorld/locations/locations.slice.type";
import { RequiredIconDefinition } from "types/Icon.type";
import { ironlandsLocationConfig } from "./locations/ironlandsLocations";
import { forgeLocations } from "./locations/forgeLocations";
import { OracleTableRoll } from "types/DieRolls.type";
import { Location } from "types/Locations.type";

interface BaseFieldConfig {
  key: string;
  type: "oracle" | "autocomplete" | "section-title";
  fullWidth?: boolean;
}

interface OracleFieldConfig extends BaseFieldConfig {
  key: string;
  label: string;
  type: "oracle";
  oracleId?: string;
}

interface AutocompleteFieldConfig extends BaseFieldConfig {
  key: string;
  label: string;
  type: "autocomplete";
  options: string[];
}

interface SectionTitleFieldConfig extends BaseFieldConfig {
  type: "section-title";
  label: string;
}

export interface NameConfig {
  oracleIds: (string | string[])[];
  joinOracles?: boolean;
}

export type FieldConfigsWithoutFunctions =
  | OracleFieldConfig
  | AutocompleteFieldConfig
  | SectionTitleFieldConfig;

export type FieldConfig =
  | FieldConfigsWithoutFunctions
  | ((
      locationId: string,
      location: LocationWithGMProperties
    ) => FieldConfigsWithoutFunctions);

export interface ILocationConfig {
  name?:
    | NameConfig
    | ((
        locationId: string,
        location: LocationWithGMProperties
      ) => NameConfig | undefined);
  sharedFields?: FieldConfig[];
  gmFields?: FieldConfig[];
  showBasicBond?: boolean;
  locationTypeOverrides?: Record<
    string,
    {
      label: string;
      hideInTools?: boolean;
      config: ILocationConfig;
    }
  >;
  defaultIcon: RequiredIconDefinition;
  createLocation?: (
    rollOracleTable: (
      oracleId: string,
      showSnackbar?: boolean,
      gmsOnly?: boolean
    ) => Promise<OracleTableRoll | undefined>
  ) => Promise<Partial<Location>>;
}

export const locationConfigs: Record<string, ILocationConfig | undefined> = {
  ironlands: ironlandsLocationConfig,
  forge: forgeLocations,
};
