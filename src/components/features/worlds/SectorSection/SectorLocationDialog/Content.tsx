import { StarforgedLocation } from "types/LocationStarforged.type";
import { SECTOR_HEX_TYPES } from "../hexTypes";
import { PlanetContent } from "./PlanetContent";
import { StarContent } from "./StarContent";
import { SettlementContent } from "./SettlementContent";
import { DerelictContent } from "./DerelictContent";
import { VaultContent } from "./VaultContent";
import { OtherContent } from "./OtherContent";

export interface ContentProps {
  locationId: string;
  location: StarforgedLocation;
  showGMFields?: boolean;
  showGMTips?: boolean;
}

export function Content(props: ContentProps) {
  const { locationId, location, showGMFields, showGMTips } = props;
  const { type } = location;

  switch (type) {
    case SECTOR_HEX_TYPES.PLANET:
      return (
        <PlanetContent
          locationId={locationId}
          location={location}
          showGMFields={showGMFields}
          showGMTips={showGMTips}
        />
      );
    case SECTOR_HEX_TYPES.STAR:
      return <StarContent locationId={locationId} location={location} />;
    case SECTOR_HEX_TYPES.SETTLEMENT:
      return (
        <SettlementContent
          locationId={locationId}
          location={location}
          showGMFields={showGMFields}
          showGMTips={showGMTips}
        />
      );
    case SECTOR_HEX_TYPES.DERELICT:
      return (
        <DerelictContent
          locationId={locationId}
          location={location}
          showGMFields={showGMFields}
          showGMTips={showGMTips}
        />
      );
    case SECTOR_HEX_TYPES.VAULT:
      return (
        <VaultContent
          locationId={locationId}
          location={location}
          showGMFields={showGMFields}
          showGMTips={showGMTips}
        />
      );
    case SECTOR_HEX_TYPES.OTHER:
      return <OtherContent locationId={locationId} location={location} />;
    default:
      return null;
  }
}
