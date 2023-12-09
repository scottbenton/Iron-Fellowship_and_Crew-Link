import { Box } from "@mui/material";
import { PageContent, PageHeader } from "components/shared/Layout";
import { StyledTab, StyledTabs } from "components/shared/StyledTabs";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

enum TABS {
  ABOUT = "about",
  MOVES = "moves",
  ORACLES = "oracles",
  ASSETS = "assets",
  RULES = "rules",
}

export function HomebrewEditorPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTab, setSelectedTab] = useState(
    (searchParams.get("tab") as TABS) ?? TABS.ABOUT
  );

  const handleTabChange = (tab: TABS) => {
    setSelectedTab(tab);
    setSearchParams({ tab });
  };

  return (
    <>
      <PageHeader label={"Coming Soon"} />
      <PageContent isPaper sx={{ overflow: "hidden" }}>
        <Box
          sx={{
            mx: { xs: -2, sm: -3 },
          }}
        >
          <StyledTabs
            value={selectedTab}
            onChange={(evt, value) => handleTabChange(value)}
          >
            <StyledTab label={"About"} value={TABS.ABOUT} />
            <StyledTab label={"Moves"} value={TABS.MOVES} />
            <StyledTab label={"Oracles"} value={TABS.ORACLES} />
            <StyledTab label={"Assets"} value={TABS.ASSETS} />
            <StyledTab label={"Rules"} value={TABS.RULES} />
          </StyledTabs>
        </Box>
      </PageContent>
    </>
  );
}
