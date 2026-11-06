import SpentIcon from "@mui/icons-material/RadioButtonChecked";
import EarnedIcon from "@mui/icons-material/HighlightOff";
import EmptyIcon from "@mui/icons-material/RadioButtonUnchecked";
import { useStore } from "stores/store";
import { Box, Stack, Typography } from "@mui/material";
import { ProgressTrack } from "components/features/ProgressTrack";
import { getExperienceValueText } from "functions/trackValueText";

const totalExp = 30;
export interface IronswornTracksProps {
  characterId: string;
}

export function IronswornTracks(props: IronswornTracksProps) {
  const { characterId } = props;

  const specialTracks = useStore((store) => store.rules.specialTracks);
  const specialTrackValues = useStore(
    (store) =>
      store.campaigns.currentCampaign.characters.characterMap[characterId]
        .specialTracks ?? {}
  );

  const xp = useStore(
    (store) =>
      store.campaigns.currentCampaign.characters.characterMap[characterId]
        .experience
  );
  const spentExp = xp?.spent ?? 0;
  const earnedExp = xp?.earned ?? 0;

  return (
    <Box>
      <Typography fontFamily={(theme) => theme.fontFamilyTitle}>
        Experience
      </Typography>
      <Box display={"flex"} flexWrap={"wrap"}>
        <Box
          mr={2}
          role={"img"}
          aria-label={getExperienceValueText(earnedExp, spentExp)}
        >
          {new Array(spentExp).fill(undefined).map((key, index) => (
            <SpentIcon key={index} color={"action"} fontSize={"small"} />
          ))}
          {new Array(earnedExp - spentExp).fill(undefined).map((key, index) => (
            <EarnedIcon key={index} color={"action"} fontSize={"small"} />
          ))}

          {new Array(Math.max(totalExp, earnedExp) - earnedExp)
            .fill(undefined)
            .map((key, index) => (
              <EmptyIcon key={index} color={"action"} fontSize={"small"} />
            ))}
        </Box>
      </Box>
      <Stack spacing={2} mt={2}>
        {Object.keys(specialTracks)
          .filter((specialTrack) => !specialTracks[specialTrack].shared)
          .map((specialTrack) => (
            <ProgressTrack
              key={specialTrack}
              label={specialTracks[specialTrack].label}
              value={specialTrackValues[specialTrack]?.value ?? 0}
              max={40}
            />
          ))}
      </Stack>
    </Box>
  );
}
