import { Stack } from "@mui/material";
import { useCampaignGMScreenAddCustomMove } from "api/campaign/customMoves/addCampaignCustomMove";
import { useCampaignGMScreenRemoveCampaignCustomMove } from "api/campaign/customMoves/removeCampaignCustomMove";
import { useCampaignGMScreenUpdateCustomMove } from "api/campaign/customMoves/updateCampaignCustomMove";
import { CustomMovesSection } from "components/CustomMovesSection";
import { useCampaignGMScreenStore } from "features/campaign-gm-screen/campaignGMScreen.store";

export function SettingsSection() {
  const { addCampaignCustomMove } = useCampaignGMScreenAddCustomMove();
  const { updateCampaignCustomMove } = useCampaignGMScreenUpdateCustomMove();
  const { removeCampaignCustomMove } =
    useCampaignGMScreenRemoveCampaignCustomMove();

  const customMoves = useCampaignGMScreenStore((store) => store.customMoves);

  return (
    <Stack spacing={2} sx={{ pb: 2 }}>
      <CustomMovesSection
        createCustomMove={addCampaignCustomMove}
        customMoves={customMoves}
        updateCustomMove={updateCampaignCustomMove}
        removeCustomMove={removeCampaignCustomMove}
      />
    </Stack>
  );
}
