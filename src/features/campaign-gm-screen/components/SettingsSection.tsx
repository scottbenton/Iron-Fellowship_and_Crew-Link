import { Stack } from "@mui/material";
import { CustomMovesSection } from "./CustomMovesSection";

export function SettingsSection() {
  return (
    <Stack spacing={2} sx={{ pb: 2 }}>
      <CustomMovesSection />
    </Stack>
  );
}
