import { Box } from "@mui/material";
import { SectionHeading } from "components/shared/SectionHeading";
import { ExperienceTrack } from "./ExperienceTrack";
import { ProgressTrack } from "components/features/ProgressTrack";
import { useStore } from "stores/store";

export function IronswornTracks() {
  const bondValue = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.bonds ?? 0
  );
  const updateCharacter = useStore(
    (store) => store.characters.currentCharacter.updateCurrentCharacter
  );

  const updateBonds = (bonds: number) => {
    const trackName = "bonds";
    return updateCharacter({
      [`specialTracks.${trackName}.value`]: bonds,
      bonds,
    });
  };

  return (
    <>
      <SectionHeading label={"Experience"} />
      <Box px={2}>
        <ExperienceTrack />
      </Box>
      <SectionHeading label={"Bonds"} />
      <Box px={2}>
        <ProgressTrack
          value={bondValue}
          max={40}
          onValueChange={(value) => updateBonds(value)}
        />
      </Box>
    </>
  );
}
