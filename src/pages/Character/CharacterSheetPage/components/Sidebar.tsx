import { Box, Card } from "@mui/material";
import { MovesSection as MovesSectionOld } from "components/features/charactersAndCampaigns/MovesSection";
import { MovesSection } from "components/features/charactersAndCampaigns/NewMovesSection";
import { OracleSection as OracleSectionOld } from "components/features/charactersAndCampaigns/OracleSection";
import { OracleSection } from "components/features/charactersAndCampaigns/NewOracleSection";
import { DarkStyledTabs, DarkStyledTab } from "components/shared/StyledTabs";
import { useState } from "react";
import { useStore } from "stores/store";
import { useNewCustomContentPage } from "hooks/featureFlags/useNewCustomContentPage";

export enum SIDEBAR_TABS {
  MOVES = "moves",
  ORACLES = "oracles",
}

export function Sidebar() {
  const [currentTab, setCurrentTab] = useState(SIDEBAR_TABS.MOVES);

  const showNewMovesAndOracles = useNewCustomContentPage();

  const shouldShowOracles = useStore((store) => {
    const currentCharacter = store.characters.currentCharacter.currentCharacter;

    if (currentCharacter) {
      return currentCharacter.campaignId
        ? store.campaigns.currentCampaign.currentCampaign?.gmIds?.includes(
            store.auth.uid
          ) ?? false
        : true;
    }
    return true;
  });

  return (
    <>
      <Card
        variant={"outlined"}
        sx={{
          minWidth: 300,
          maxHeight: "100%",
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
        }}
      >
        {shouldShowOracles && (
          <div>
            <DarkStyledTabs
              value={currentTab}
              onChange={(evt, value) => setCurrentTab(value)}
            >
              <DarkStyledTab label={"Moves"} value={SIDEBAR_TABS.MOVES} />
              <DarkStyledTab label={"Oracles"} value={SIDEBAR_TABS.ORACLES} />
            </DarkStyledTabs>
          </div>
        )}
        <Box
          sx={
            !shouldShowOracles || currentTab === SIDEBAR_TABS.MOVES
              ? { overflow: "auto", display: "flex", flexDirection: "column" }
              : { display: "none" }
          }
        >
          {showNewMovesAndOracles ? <MovesSection /> : <MovesSectionOld />}
        </Box>
        <Box
          sx={
            shouldShowOracles && currentTab === SIDEBAR_TABS.ORACLES
              ? { overflow: "auto", display: "flex", flexDirection: "column" }
              : { display: "none" }
          }
        >
          {showNewMovesAndOracles ? <OracleSection /> : <OracleSectionOld />}
        </Box>
      </Card>
    </>
  );
}
