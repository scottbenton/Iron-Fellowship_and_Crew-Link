import { Box, Card, Tab, Tabs, useMediaQuery, useTheme } from "@mui/material";
import { MovesSection } from "components/MovesSection";
import { useEffect } from "react";
import { useState } from "react";
import { StoredCampaign } from "types/Campaign.type";
import { CharacterSection } from "./CharacterSection";
import { TracksSection } from "./TracksSection";
import { OracleSection } from "components/OracleSection";
import { CampaignNotesSection } from "./CampaignNotesSection";
import { SettingsSection } from "./SettingsSection";
import { WorldSection } from "./WorldSection";
import { LocationsSection } from "components/Locations";
import { useCampaignGMScreenStore } from "../campaignGMScreen.store";

enum TABS {
  MOVES,
  CHARACTERS,
  TRACKS,
  ORACLE,
  NOTES,
  SETTINGS,
  WORLD,
  LOCATIONS,
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

  const locations = useCampaignGMScreenStore((store) => store.locations);
  const openLocationId = useCampaignGMScreenStore(
    (store) => store.openLocationId
  );
  const setOpenLocationId = useCampaignGMScreenStore(
    (store) => store.setOpenLocationId
  );
  const worldOwnerId = useCampaignGMScreenStore(
    (store) => store.campaign?.gmId
  );
  const worldId = useCampaignGMScreenStore((store) => store.campaign?.worldId);

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
          <Tab label="World" value={TABS.WORLD} />
          <Tab label="Locations" value={TABS.LOCATIONS} />
          <Tab label="Settings" value={TABS.SETTINGS} />
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
        {selectedTab === TABS.WORLD && <WorldSection />}
        {selectedTab === TABS.LOCATIONS && (
          <LocationsSection
            worldOwnerId={worldOwnerId}
            worldId={worldId}
            locations={locations}
            openLocationId={openLocationId}
            setOpenLocationId={setOpenLocationId}
          />
        )}
        {selectedTab === TABS.SETTINGS && <SettingsSection />}
      </Box>
    </Card>
  );
}
