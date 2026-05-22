import { Box } from "@mui/material";
import { Notes } from "components/features/charactersAndCampaigns/Notes/Notes";
import { useIsMobile } from "hooks/useIsMobile";

export function NotesTab() {
  const isMobile = useIsMobile();

  return (
    <Box height={"100%"}>
      <Notes condensedView={isMobile} />
    </Box>
  );
}
