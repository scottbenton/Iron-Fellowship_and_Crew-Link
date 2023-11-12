import { Card } from "@mui/material";
import { MovesSection } from "components/features/charactersAndCampaigns/MovesSection";
import { OracleSection } from "components/features/charactersAndCampaigns/OracleSection";
import { DarkStyledTabs, DarkStyledTab } from "components/shared/StyledTabs";
import { useState } from "react";

export enum SIDEBAR_TABS {
  MOVES = "moves",
  ORACLES = "oracles",
}

export function Sidebar() {
  const [currentTab, setCurrentTab] = useState(SIDEBAR_TABS.MOVES);
  // Logic for showing oracles
  /**   {(!isInCampaign || isGM) && (
          <StyledTab label="Oracle" value={TABS.ORACLE} />
        )}
   */

  return (
    <Card
      variant={"outlined"}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div>
        <DarkStyledTabs
          value={currentTab}
          onChange={(evt, value) => setCurrentTab(value)}
        >
          <DarkStyledTab label={"Moves"} value={SIDEBAR_TABS.MOVES} />
          <DarkStyledTab label={"Oracles"} value={SIDEBAR_TABS.ORACLES} />
        </DarkStyledTabs>
      </div>
      {currentTab === SIDEBAR_TABS.MOVES && <MovesSection />}
      {currentTab === SIDEBAR_TABS.ORACLES && <OracleSection />}
    </Card>
  );
}
