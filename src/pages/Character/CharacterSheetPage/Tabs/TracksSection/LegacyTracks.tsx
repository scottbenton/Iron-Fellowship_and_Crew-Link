import { SectionHeading } from "components/shared/SectionHeading";
import { LegacyTrack } from "./LegacyTrack";
import { Stack } from "@mui/material";
import { useStore } from "stores/store";

function getDataforgedKey(key: string): string {
  if (key === "quests") {
    return "quests_legacy";
  } else if (key === "bonds") {
    return "bonds_legacy";
  } else if (key === "discoveries") {
    return "discoveries_legacy";
  }
  return key;
}

export function LegacyTracks() {
  const legacyTracks = useStore(
    (store) =>
      store.characters.currentCharacter.currentCharacter?.legacyTracks ?? {}
  );

  const updateCharacter = useStore(
    (store) => store.characters.currentCharacter.updateCurrentCharacter
  );

  const updateLegacyTrackValue = (track: string, value: number) => {
    const newDataforgedKey: string = getDataforgedKey(track);
    updateCharacter({
      [`legacyTracks.${track}.value`]: value,
      [`specialTracks.${newDataforgedKey}.value`]: value,
    }).catch(() => {});
  };

  const updateLegacyTrackExperienceChecked = (
    track: string,
    index: number,
    checked: boolean
  ) => {
    updateCharacter({
      [`legacyTracks.${track}.spentExperience.${index}`]: checked,
    }).catch(() => {});
  };

  const updateLegacyTrackIsLegacy = (track: string, checked: boolean) => {
    updateCharacter({
      [`legacyTracks.${track}.isLegacy`]: checked,
      [`legacyTracks.${track}.spentExperience`]: {},
      [`legacyTracks.${track}.value`]: 0,
    }).catch(() => {});
  };

  return (
    <>
      <SectionHeading label={"Legacy Tracks"} />
      <Stack spacing={2} px={2} sx={{ overflowX: "auto" }}>
        <LegacyTrack
          label={"Quests"}
          value={legacyTracks.quests?.value ?? 0}
          checkedExperience={legacyTracks.quests?.spentExperience ?? {}}
          onValueChange={(value) => updateLegacyTrackValue("quests", value)}
          onExperienceChecked={(index, checked) =>
            updateLegacyTrackExperienceChecked("quests", index, checked)
          }
          isLegacy={legacyTracks.quests?.isLegacy ?? false}
          onIsLegacyChecked={(checked) =>
            updateLegacyTrackIsLegacy("quests", checked)
          }
        />
        <LegacyTrack
          label={"Bonds"}
          value={legacyTracks.bonds?.value ?? 0}
          checkedExperience={legacyTracks.bonds?.spentExperience ?? {}}
          onValueChange={(value) => updateLegacyTrackValue("bonds", value)}
          onExperienceChecked={(index, checked) =>
            updateLegacyTrackExperienceChecked("bonds", index, checked)
          }
          isLegacy={legacyTracks.bonds?.isLegacy ?? false}
          onIsLegacyChecked={(checked) =>
            updateLegacyTrackIsLegacy("bonds", checked)
          }
        />
        <LegacyTrack
          label={"Discoveries"}
          value={legacyTracks.discoveries?.value ?? 0}
          checkedExperience={legacyTracks.discoveries?.spentExperience ?? {}}
          onValueChange={(value) =>
            updateLegacyTrackValue("discoveries", value)
          }
          onExperienceChecked={(index, checked) =>
            updateLegacyTrackExperienceChecked("discoveries", index, checked)
          }
          isLegacy={legacyTracks.discoveries?.isLegacy ?? false}
          onIsLegacyChecked={(checked) =>
            updateLegacyTrackIsLegacy("discoveries", checked)
          }
        />
      </Stack>
    </>
  );
}
