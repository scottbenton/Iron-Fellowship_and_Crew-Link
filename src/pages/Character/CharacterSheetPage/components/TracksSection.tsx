import { Box, ButtonBase, Grid } from "@mui/material";
import {
  healthTrack,
  momentumTrack,
  spiritTrack,
  supplyTrack,
} from "data/defaultTracks";
import { Track } from "components/features/Track";
import ResetIcon from "@mui/icons-material/Replay";
import { useStore } from "stores/store";
import { CustomTracks } from "./CustomTracks";
import { useIsMobile } from "hooks/useIsMobile";
import { MobileStatTrack } from "./MobileStatTrack";
import { MomentumTrackMobile } from "./MomentumTrackMobile";

export type TRACK_KEYS = "health" | "spirit" | "supply" | "momentum";

export function TracksSection() {
  const numberOfActiveDebilities = useStore((store) => {
    return Object.values(
      store.characters.currentCharacter.currentCharacter?.debilities ?? {}
    ).filter((debility) => debility).length;
  });
  const isInCampaign = useStore(
    (store) => !!store.characters.currentCharacter.currentCharacter?.campaignId
  );
  const updateCampaignSupply = useStore(
    (store) => store.campaigns.currentCampaign.updateCampaignSupply
  );
  const updateCharacter = useStore(
    (store) => store.characters.currentCharacter.updateCurrentCharacter
  );

  const momentum = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.momentum ?? 0
  );

  const maxMomentum = momentumTrack.max - numberOfActiveDebilities;

  let momentumResetValue = momentumTrack.startingValue;

  if (numberOfActiveDebilities >= 2) {
    momentumResetValue = 0;
  } else if (numberOfActiveDebilities === 1) {
    momentumResetValue = 1;
  }

  const health = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.health ?? 0
  );
  const spirit = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.spirit ?? 0
  );
  const supply = useStore(
    (store) =>
      (store.characters.currentCharacter.currentCharacter?.campaignId
        ? store.campaigns.currentCampaign.currentCampaign?.supply
        : store.characters.currentCharacter.currentCharacter?.supply) ?? 0
  );

  const updateTrackValue = (track: TRACK_KEYS, newValue: number) => {
    if (track === "supply" && isInCampaign) {
      return updateCampaignSupply(newValue);
    } else {
      return updateCharacter({
        [track]: newValue,
        [`conditionMeters.${track}`]: newValue,
      });
    }
  };

  const isMobile = useIsMobile();

  return (
    <Grid
      container
      spacing={isMobile ? 1 : 2}
      sx={isMobile ? { mt: 0 } : undefined}
    >
      {isMobile ? (
        <>
          <Grid item xs={6}>
            <MobileStatTrack
              label={"Health"}
              value={health}
              onChange={(newValue) => updateTrackValue("health", newValue)}
              min={healthTrack.min}
              max={healthTrack.max}
            />
          </Grid>
          <Grid item xs={6}>
            <MobileStatTrack
              label={"Spirit"}
              value={spirit}
              onChange={(newValue) => updateTrackValue("spirit", newValue)}
              min={spiritTrack.min}
              max={spiritTrack.max}
            />
          </Grid>
          <Grid item xs={6}>
            <MobileStatTrack
              label={"Supply"}
              value={supply}
              onChange={(newValue) => updateTrackValue("supply", newValue)}
              min={supplyTrack.min}
              max={supplyTrack.max}
            />
          </Grid>
          <Grid item xs={6}>
            <MomentumTrackMobile
              value={momentum}
              onChange={(newValue) => updateTrackValue("momentum", newValue)}
              min={momentumTrack.min}
              max={maxMomentum ?? momentumTrack.max}
              resetValue={momentumResetValue ?? momentumTrack.startingValue}
            />
          </Grid>
        </>
      ) : (
        <>
          <Grid item xs={12} md={4}>
            <Track
              label={"Health"}
              value={health}
              onChange={(newValue) => updateTrackValue("health", newValue)}
              min={healthTrack.min}
              max={healthTrack.max}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Track
              label={"Spirit"}
              value={spirit}
              onChange={(newValue) => updateTrackValue("spirit", newValue)}
              min={spiritTrack.min}
              max={spiritTrack.max}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Track
              label={"Supply"}
              value={supply}
              onChange={(newValue) => updateTrackValue("supply", newValue)}
              min={supplyTrack.min}
              max={supplyTrack.max}
            />
          </Grid>
          <Grid item xs={12}>
            <Box display={"flex"}>
              <Track
                label={"Momentum"}
                value={momentum}
                onChange={(newValue) => updateTrackValue("momentum", newValue)}
                min={momentumTrack.min}
                max={maxMomentum ?? momentumTrack.max}
                sx={{ flexGrow: 1 }}
              />
              <ButtonBase
                sx={(theme) => ({
                  backgroundColor: theme.palette.darkGrey.main,
                  color: theme.palette.darkGrey.contrastText,
                  borderRadius: `${theme.shape.borderRadius}px`,
                  ml: 0.25,

                  "&:hover": {
                    backgroundColor: theme.palette.darkGrey.dark,
                  },
                })}
                onClick={() =>
                  updateTrackValue(
                    "momentum",
                    momentumResetValue ?? momentumTrack.startingValue
                  )
                }
              >
                <ResetIcon />
              </ButtonBase>
            </Box>
          </Grid>
        </>
      )}

      <CustomTracks />
    </Grid>
  );
}
