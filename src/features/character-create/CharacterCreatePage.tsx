import { Divider, Stack, TextField } from "@mui/material";
import { NameSection } from "./components/NameSection";
import { StatsSection } from "./components/StatsSection";

export function CharacterCreatePage() {
  // Name
  // Stats
  // Health - auto set
  // Spirit - auto set
  // Supply - auto set
  // Momentum - auto set

  return (
    <Stack spacing={2}>
      <NameSection />
      <Divider />
      <StatsSection />
    </Stack>
  );
}
