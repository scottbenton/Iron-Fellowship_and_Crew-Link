import { Box, Typography } from "@mui/material";
import { StatComponent } from "components/features/characters/StatComponent";
import { useStore } from "stores/store";

export function CharacterStats() {
  const stats = useStore((store) => store.rules.stats);
  const statValues = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.stats ?? {}
  );

  return (
    <Box mt={2}>
      <Typography
        fontFamily={(theme) => theme.fontFamilyTitle}
        variant={"h6"}
        color={"text.secondary"}
      >
        Stats
      </Typography>
      <Box display={"flex"} flexWrap={"wrap"} gap={1}>
        {Object.entries(stats).map(([statKey, stat]) => (
          <StatComponent
            key={statKey}
            label={stat.label}
            value={statValues?.[statKey] ?? 0}
            sx={{ width: 65 }}
          />
        ))}
      </Box>
    </Box>
  );
}
