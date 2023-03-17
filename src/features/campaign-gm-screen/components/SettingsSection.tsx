import { Stack } from "@mui/material";
import { useCampaignGMScreenShowOrHideCustomMove } from "api/campaign/settings/showOrHideCustomMove copy";
import { useCampaignGMScreenShowOrHideCustomOracle } from "api/campaign/settings/showOrHideCustomOracle";
import { CustomMovesSection } from "components/CustomMovesSection";
import { CustomOracleSection } from "components/CustomOraclesSection";
import { useCampaignGMScreenStore } from "features/campaign-gm-screen/campaignGMScreen.store";

export function SettingsSection() {
  const customMoves = useCampaignGMScreenStore((store) => store.customMoves);
  const customOracles = useCampaignGMScreenStore(
    (store) => store.customOracles
  );

  const hiddenMoves = useCampaignGMScreenStore(
    (store) => store.campaignSettings?.hiddenCustomMoveIds
  );
  const { showOrHideCustomMove } = useCampaignGMScreenShowOrHideCustomMove();

  const hiddenOracles = useCampaignGMScreenStore(
    (store) => store.campaignSettings?.hiddenCustomOraclesIds
  );
  const { showOrHideCustomOracle } =
    useCampaignGMScreenShowOrHideCustomOracle();

  return (
    <Stack spacing={3} sx={{ pb: 2 }}>
      <CustomMovesSection
        customMoves={customMoves}
        hiddenMoveIds={hiddenMoves}
        showOrHideCustomMove={showOrHideCustomMove}
      />
      <CustomOracleSection
        customOracles={customOracles}
        hiddenOracleIds={hiddenOracles}
        showOrHideCustomOracle={showOrHideCustomOracle}
      />
    </Stack>
  );
}
