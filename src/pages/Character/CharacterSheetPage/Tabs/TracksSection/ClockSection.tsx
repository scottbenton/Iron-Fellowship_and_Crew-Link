import { Button } from "@mui/material";
import { SectionHeading } from "components/shared/SectionHeading";
import { useStore } from "stores/store";
import { TRACK_TYPES } from "types/Track.type";

export function ClockSection() {
  const isInCampaign = useStore(
    (store) => !!store.campaigns.currentCampaign.currentCampaignId
  );

  const characterClocks = useStore(
    (store) =>
      store.characters.currentCharacter.tracks.trackMap[TRACK_TYPES.CLOCK]
  );
  const addClock = useStore(
    (store) => store.characters.currentCharacter.tracks.addTrack
  );
  const updateClock = useStore(
    (store) => store.characters.currentCharacter.tracks.updateTrack
  );

  const campaignClocks = useStore(
    (store) =>
      store.campaigns.currentCampaign.tracks.trackMap[TRACK_TYPES.CLOCK]
  );
  const addCampaignClock = useStore(
    (store) => store.campaigns.currentCampaign.tracks.addTrack
  );
  const updateCampaignClock = useStore(
    (store) => store.campaigns.currentCampaign.tracks.updateTrack
  );

  return (
    <>
      <SectionHeading
        label={isInCampaign ? "Campaign Clocks" : "Clocks"}
        action={<Button color={"inherit"}>Add Clock</Button>}
      />
    </>
  );
}
