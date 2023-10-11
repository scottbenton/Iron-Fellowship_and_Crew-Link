import { Grid } from "@mui/material";
import { CustomTrack } from "components/features/charactersAndCampaigns/CustomTrack";
import { useStore } from "stores/store";
import { CUSTOM_TRACK_SIZE } from "types/CustomTrackSettings.type";

const getMdSize = (size: CUSTOM_TRACK_SIZE): number => {
  switch (size) {
    case CUSTOM_TRACK_SIZE.SMALL:
      return 4;
    case CUSTOM_TRACK_SIZE.MEDIUM:
      return 6;
    case CUSTOM_TRACK_SIZE.LARGE:
      return 12;
  }
};

export function CustomTracks() {
  const customTracks = useStore((store) => store.settings.customTracks);

  const customTrackValues = useStore(
    (store) =>
      store.characters.currentCharacter.currentCharacter?.customTracks ?? {}
  );
  const updateCharacter = useStore(
    (store) => store.characters.currentCharacter.updateCurrentCharacter
  );

  const updateTrackValue = (label: string, index: number) => {
    updateCharacter({
      [`customTracks.${label}`]: index,
    }).catch(() => {});
  };

  return (
    <>
      {customTracks.map((customTrack) => (
        <Grid
          item
          xs={12}
          md={getMdSize(customTrack.size)}
          key={customTrack.label}
        >
          <CustomTrack
            value={customTrackValues[customTrack.label] ?? -1}
            onChange={(index) => updateTrackValue(customTrack.label, index)}
            customTrack={customTrack}
          />
        </Grid>
      ))}
    </>
  );
}
