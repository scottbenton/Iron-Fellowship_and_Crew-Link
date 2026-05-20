import { CharacterConditionMeters } from "./CharacterConditionMeters";
import { CharacterDetails } from "./CharacterDetails";
import { CharacterExperience } from "./CharacterExperience";
import { CharacterStats } from "./CharacterStats";
import { Debilities } from "./Debilities";
import { LegacyTracks } from "./LegacyTracks";
import { Box } from "@mui/material";

export function CharacterPanel() {
  return (
    <Box pl={2} >
      <CharacterDetails />
      <CharacterStats />
      <CharacterConditionMeters />
      <Debilities />
      <LegacyTracks />
      <CharacterExperience />
    </Box>
  );
}
