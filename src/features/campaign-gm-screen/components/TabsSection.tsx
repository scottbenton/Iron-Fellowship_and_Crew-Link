import { Box, Card, Tab, Tabs, useMediaQuery, useTheme } from "@mui/material";
import { MovesSection } from "components/MovesSection/MovesSection";
import { useEffect } from "react";
import { useState } from "react";
import { StoredCampaign } from "types/Campaign.type";
import { CharacterSection } from "./CharacterSection";
import { CampaignProgressTracks } from "features/campaign-sheet/components/CampaignProgressTracks";
import { TracksSection } from "./TracksSection";
import { OracleSection } from "components/OracleSection";
import { CampaignNotesSection } from "./CampaignNotesSection";

enum TABS {
  MOVES,
  CHARACTERS,
  TRACKS,
  ORACLE,
  NOTES,
}

export interface TabsSectionProps {
  campaignId: string;
  campaign: StoredCampaign;
}

const darkBGTabs: TABS[] = [TABS.CHARACTERS];

export function TabsSection(props: TabsSectionProps) {
  const { campaignId, campaign } = props;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [selectedTab, setSelectedTab] = useState<TABS>(TABS.CHARACTERS);

  useEffect(() => {
    if (!isMobile && selectedTab === TABS.MOVES) {
      setSelectedTab(TABS.CHARACTERS);
    }
  }, [selectedTab, isMobile]);

  return (
    <Card
      variant={"outlined"}
      sx={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={selectedTab}
          onChange={(evt, value) => setSelectedTab(value)}
          variant={"scrollable"}
          scrollButtons={"auto"}
        >
          {isMobile && <Tab label={"Moves"} value={TABS.MOVES} />}
          <Tab label="Characters" value={TABS.CHARACTERS} />
          <Tab label="Tracks" value={TABS.TRACKS} />
          <Tab label="Oracle" value={TABS.ORACLE} />
          <Tab label="Notes (Beta)" value={TABS.NOTES} />
        </Tabs>
      </Box>
      <Box
        flexGrow={1}
        sx={(theme) => ({
          overflowY: "auto",
          backgroundColor: darkBGTabs.includes(selectedTab)
            ? theme.palette.background.default
            : "",
        })}
      >
        {selectedTab === TABS.MOVES && <MovesSection />}
        {selectedTab === TABS.CHARACTERS && <CharacterSection />}
        {selectedTab === TABS.TRACKS && (
          <TracksSection campaignId={campaignId} supply={campaign.supply} />
        )}
        {selectedTab === TABS.ORACLE && <OracleSection />}
        {selectedTab === TABS.NOTES && (
          <CampaignNotesSection campaignId={campaignId} />
        )}
      </Box>
    </Card>
  );
}
