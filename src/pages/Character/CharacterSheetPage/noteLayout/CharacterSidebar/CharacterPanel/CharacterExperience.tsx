import { Box } from "@mui/material";
import { MobileStatTrack } from "pages/Character/CharacterSheetPage/components/MobileStatTrack";
import { useStore } from "stores/store";

export function CharacterExperience() {
  const experience = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.experience
  );
  const updateCharacter = useStore(
    (store) => store.characters.currentCharacter.updateCurrentCharacter
  );

  const earned = experience?.earned ?? 0;
  const spent = experience?.spent ?? 0;

  const availableXP = earned - spent;

  return (
    <Box mt={3} display={"flex"}>
      <MobileStatTrack
        label={"Experience"}
        min={0}
        max={100}
        value={availableXP}
        disableRoll
        ignoreAdds={true}
        onChange={(newValue) => {
          if (newValue > availableXP) {
            return updateCharacter({
              "experience.earned": earned + 1,
            });
          } else {
            return updateCharacter({
              "experience.spent": spent + 1,
            });
          }
        }}
      />
    </Box>
  );
}
