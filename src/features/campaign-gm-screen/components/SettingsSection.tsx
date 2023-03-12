import { Stack } from "@mui/material";
import { useCampaignGMScreenAddCustomMove } from "api/campaign/customMoves/addCampaignCustomMove";
import { useCampaignGMScreenRemoveCampaignCustomMove } from "api/campaign/customMoves/removeCampaignCustomMove";
import { useCampaignGMScreenUpdateCustomMove } from "api/campaign/customMoves/updateCampaignCustomMove";
import { CustomMovesSection } from "components/CustomMovesSection";
import { CustomOracleSection } from "components/CustomOraclesSection";
import { useCampaignGMScreenStore } from "features/campaign-gm-screen/campaignGMScreen.store";

export function SettingsSection() {
  const { addCampaignCustomMove } = useCampaignGMScreenAddCustomMove();
  const { updateCampaignCustomMove } = useCampaignGMScreenUpdateCustomMove();
  const { removeCampaignCustomMove } =
    useCampaignGMScreenRemoveCampaignCustomMove();

  const customMoves = useCampaignGMScreenStore((store) => store.customMoves);
  const customOracles = useCampaignGMScreenStore(
    (store) => store.customOracles
  );

  return (
    <Stack spacing={3} sx={{ pb: 2 }}>
      <CustomMovesSection
        customMoves={customMoves}
        createCustomMove={addCampaignCustomMove}
        updateCustomMove={updateCampaignCustomMove}
        removeCustomMove={removeCampaignCustomMove}
      />
      <CustomOracleSection customOracles={customOracles} />
    </Stack>
  );
}
