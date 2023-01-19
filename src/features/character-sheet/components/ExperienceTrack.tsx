import { Box } from "@mui/material";
import SpentIcon from "@mui/icons-material/RadioButtonChecked";
import EarnedIcon from "@mui/icons-material/HighlightOff";
import EmptyIcon from "@mui/icons-material/RadioButtonUnchecked";
import { ExperienceButtons } from "./ExperienceButtons";
import { useCharacterSheetStore } from "../characterSheet.store";

const totalExp = 30;

export function ExperienceTrack() {
  const earnedExp = useCharacterSheetStore(
    (store) => store.character?.experience?.earned ?? 0
  );
  const spentExp = useCharacterSheetStore(
    (store) => store.character?.experience?.spent ?? 0
  );

  const updateExperience = useCharacterSheetStore(
    (store) => store.updateExperience
  );

  const handleEarnedExperienceChange = (proposedValue: number) => {
    console.debug(proposedValue);
    if (proposedValue >= spentExp && proposedValue <= totalExp) {
      console.debug("updating");
      updateExperience(proposedValue, "earned");
    }
  };

  const handleSpentExperienceChange = (proposedValue: number) => {
    if (proposedValue >= 0 && proposedValue <= earnedExp) {
      updateExperience(proposedValue, "spent");
    }
  };

  return (
    <Box display={"flex"} flexWrap={"wrap"}>
      <Box width={24 * 15} mr={2}>
        {new Array(spentExp).fill(undefined).map((key, index) => (
          <SpentIcon key={index} color={"action"} />
        ))}
        {new Array(earnedExp - spentExp).fill(undefined).map((key, index) => (
          <EarnedIcon key={index} color={"action"} />
        ))}
        {new Array(totalExp - earnedExp).fill(undefined).map((key, index) => (
          <EmptyIcon key={index} color={"action"} />
        ))}
      </Box>
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-between"}
      >
        <ExperienceButtons
          handleAdd={() => handleEarnedExperienceChange(earnedExp + 1)}
          handleSubtract={() => handleEarnedExperienceChange(earnedExp - 1)}
          label={"Add Exp"}
        />
        <ExperienceButtons
          handleAdd={() => handleSpentExperienceChange(spentExp + 1)}
          handleSubtract={() => handleSpentExperienceChange(spentExp - 1)}
          label={"Spend Exp"}
        />
      </Box>
    </Box>
  );
}
