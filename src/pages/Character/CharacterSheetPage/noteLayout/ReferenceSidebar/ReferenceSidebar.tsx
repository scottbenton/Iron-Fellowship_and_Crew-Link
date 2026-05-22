import { Box } from "@mui/material";
import { MovesSection } from "components/features/charactersAndCampaigns/MovesSection";
import { OracleSection } from "components/features/charactersAndCampaigns/OracleSection";
import { DarkStyledTab, DarkStyledTabs } from "components/shared/StyledTabs";
import { useCampaignType } from "hooks/useCampaignType";
import { useUpdateQueryStringValueWithoutNavigation } from "hooks/useUpdateQueryStringValueWithoutNavigation";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

enum SidebarTabs {
  Moves = "moves",
  Oracles = "oracles",
}

export function ReferenceSidebar() {
  const [searchParams] = useSearchParams();

  const [currentTab, setCurrentTab] = useState(
    (searchParams.get("referenceTab") as SidebarTabs) ?? SidebarTabs.Moves
  );
  useUpdateQueryStringValueWithoutNavigation("referenceTab", currentTab);

  const shouldShowOracles = !useCampaignType().showGuidedPlayerView;
  return (
    <Box height={"100%"} display={"flex"} flexDirection={"column"} >
      {shouldShowOracles && (
        <div>
          <DarkStyledTabs
            value={currentTab}
            onChange={(evt, value) => setCurrentTab(value)}
          >
            <DarkStyledTab label={"Moves"} value={SidebarTabs.Moves} />
            <DarkStyledTab label={"Oracles"} value={SidebarTabs.Oracles} />
          </DarkStyledTabs>
        </div>
      )}
      <Box
        sx={
          !shouldShowOracles || currentTab === SidebarTabs.Moves
            ? { overflow: "auto", display: "flex", flexDirection: "column" }
            : { display: "none" }
        }
      >
        <MovesSection shouldExpandLocally />
      </Box>
      <Box
        sx={
          shouldShowOracles && currentTab === SidebarTabs.Oracles
            ? { overflow: "auto", display: "flex", flexDirection: "column" }
            : { display: "none" }
        }
      >
        <OracleSection />
      </Box>
    </Box>
  );
}
