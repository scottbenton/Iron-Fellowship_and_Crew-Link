import { StoredRules } from "types/HomebrewCollection.type";

export interface SpecialTracksProps {
  homebrewId: string;
  specialTracks: StoredRules["special_tracks"];
}

export function SpecialTracks(props: SpecialTracksProps) {
  const { homebrewId, specialTracks } = props;
  // TODO - Waiting on rsek's potential XP changes before implementation
  console.debug(homebrewId, specialTracks);
  return <>Special Tracks</>;
}
