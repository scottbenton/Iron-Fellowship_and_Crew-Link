import { Box } from "@mui/material";
import SpentIcon from "@mui/icons-material/RadioButtonChecked";
import EarnedIcon from "@mui/icons-material/HighlightOff";
import EmptyIcon from "@mui/icons-material/RadioButtonUnchecked";
import { ExperienceButtons } from "./ExperienceButtons";
import { useCharacterSheetStore } from "../characterSheet.store";
import { useCharacterSheetUpdateExperience } from "api/characters/updateExperience";

const totalExp = 30;

export function ExperienceTrack() {
  const earnedExp = useCharacterSheetStore(
    (store) => store.character?.experience?.earned ?? 0
  );
  const spentExp = useCharacterSheetStore(
    (store) => store.character?.experience?.spent ?? 0
  );

  const { updateExperience } = useCharacterSheetUpdateExperience();

  const handleEarnedExperienceChange = (proposedValue: number) => {
    if (proposedValue >= spentExp && proposedValue <= totalExp) {
      updateExperience({ value: proposedValue, type: "earned" });
    }
  };

  const handleSpentExperienceChange = (proposedValue: number) => {
    if (proposedValue >= 0 && proposedValue <= earnedExp) {
      updateExperience({ value: proposedValue, type: "spent" });
    }
  };

  return (
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
      <Box display={"flex"} flexWrap={"wrap"}>
        <ExperienceButtons
          handleAdd={() => handleEarnedExperienceChange(earnedExp + 1)}
          handleSubtract={() => handleEarnedExperienceChange(earnedExp - 1)}
          label={"Add Experience"}
        />
        <ExperienceButtons
          handleAdd={() => handleSpentExperienceChange(spentExp + 1)}
          handleSubtract={() => handleSpentExperienceChange(spentExp - 1)}
          label={"Spend Experience"}
        />
      </Box>
    </Box>
  );
}
