import SpentIcon from "@mui/icons-material/RadioButtonChecked";
import EarnedIcon from "@mui/icons-material/HighlightOff";
import EmptyIcon from "@mui/icons-material/RadioButtonUnchecked";
import { useStore } from "stores/store";
import { Box, Typography } from "@mui/material";
import { ProgressTrack } from "components/features/ProgressTrack";

const totalExp = 30;
export interface IronswornTracksProps {
  characterId: string;
}

export function IronswornTracks(props: IronswornTracksProps) {
  const { characterId } = props;
  const xp = useStore(
    (store) =>
      store.campaigns.currentCampaign.characters.characterMap[characterId]
        .experience
  );
  const spentExp = xp?.spent ?? 0;
  const earnedExp = xp?.earned ?? 0;

  const bondValue = useStore(
    (store) =>
      store.campaigns.currentCampaign.characters.characterMap[characterId]
        .bonds ?? 0
  );

  return (
    <Box>
      <Typography fontFamily={(theme) => theme.fontFamilyTitle}>
        Experience
      </Typography>
      <Box display={"flex"} flexWrap={"wrap"}>
        <Box mr={2}>
          {new Array(spentExp).fill(undefined).map((key, index) => (
            <SpentIcon key={index} color={"action"} fontSize={"small"} />
          ))}
          {new Array(earnedExp - spentExp).fill(undefined).map((key, index) => (
            <EarnedIcon key={index} color={"action"} fontSize={"small"} />
          ))}
          {new Array(totalExp - earnedExp).fill(undefined).map((key, index) => (
            <EmptyIcon key={index} color={"action"} fontSize={"small"} />
          ))}
        </Box>
      </Box>
      <Typography fontFamily={(theme) => theme.fontFamilyTitle} sx={{ mt: 2 }}>
        Bonds
      </Typography>
      <ProgressTrack value={bondValue} max={40} />
    </Box>
  );
}
