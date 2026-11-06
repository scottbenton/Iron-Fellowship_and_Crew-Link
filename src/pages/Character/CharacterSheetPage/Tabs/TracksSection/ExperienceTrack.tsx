import { Box } from "@mui/material";
import SpentIcon from "@mui/icons-material/RadioButtonChecked";
import EarnedIcon from "@mui/icons-material/HighlightOff";
import EmptyIcon from "@mui/icons-material/RadioButtonUnchecked";
import { ExperienceButtons } from "./ExperienceButtons";
import { useStore } from "stores/store";
import { getExperienceValueText } from "functions/trackValueText";

const defaultTotalExp = 30;

export function ExperienceTrack() {
  const earnedExp = useStore(
    (store) =>
      store.characters.currentCharacter.currentCharacter?.experience?.earned ??
      0
  );
  const spentExp = useStore(
    (store) =>
      store.characters.currentCharacter.currentCharacter?.experience?.spent ?? 0
  );
  const updateCharacter = useStore(
    (store) => store.characters.currentCharacter.updateCurrentCharacter
  );

  const updateExperience = (type: "earned" | "spent", value: number) => {
    updateCharacter({ [`experience.${type}`]: value }).catch(() => {});
  };

  const announce = useStore((store) => store.appState.announce);

  // The +/- buttons keep focus and the track is icons, so say what changed.
  const handleEarnedExperienceChange = (proposedValue: number) => {
    if (proposedValue >= spentExp) {
      updateExperience("earned", proposedValue);
      announce(getExperienceValueText(proposedValue, spentExp));
    } else {
      announce("Earned experience cannot be less than spent experience");
    }
  };

  const handleSpentExperienceChange = (proposedValue: number) => {
    if (proposedValue >= 0 && proposedValue <= earnedExp) {
      updateExperience("spent", proposedValue);
      announce(getExperienceValueText(earnedExp, proposedValue));
    } else if (proposedValue < 0) {
      announce("Spent experience is already 0");
    } else {
      announce("There is no unspent experience to spend");
    }
  };

  return (
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
        {new Array(Math.max(defaultTotalExp, earnedExp) - earnedExp)
          .fill(undefined)
          .map((key, index) => (
            <EmptyIcon key={index} color={"action"} fontSize={"small"} />
          ))}
      </Box>
      <Box display={"flex"} flexWrap={"wrap"}>
        <ExperienceButtons
          handleAdd={() => handleEarnedExperienceChange(earnedExp + 1)}
          handleSubtract={() => handleEarnedExperienceChange(earnedExp - 1)}
          label={"Add Experience"}
          addLabel={"Add 1 Earned Experience"}
          subtractLabel={"Remove 1 Earned Experience"}
        />
        <ExperienceButtons
          handleAdd={() => handleSpentExperienceChange(spentExp + 1)}
          handleSubtract={() => handleSpentExperienceChange(spentExp - 1)}
          label={"Spend Experience"}
          addLabel={"Add 1 Spent Experience"}
          subtractLabel={"Remove 1 Spent Experience"}
        />
      </Box>
    </Box>
  );
}
