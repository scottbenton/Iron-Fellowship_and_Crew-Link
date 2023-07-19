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
import { useSearchParams } from "react-router-dom";
import {
  StyledTabs,
  StyledTab,
  ContainedTabPanel,
} from "components/StyledTabs";
import { NPCSection } from "components/NPCSection";
import { LoreSection } from "components/Lore";

enum TABS {
  MOVES = "moves",
  CHARACTERS = "characters",
  TRACKS = "tracks",
  ORACLE = "oracle",
  NOTES = "notes",
  SETTINGS = "settings",
  WORLD = "world",
  LOCATIONS = "locations",
  NPCS = "npcs",
  LORE = "lore",
}

export interface TabsSectionProps {
  campaignId: string;
  campaign: StoredCampaign;
}

export function TabsSection(props: TabsSectionProps) {
  const { campaignId, campaign } = props;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTab, setSelectedTab] = useState<TABS>(
    (searchParams.get("tab") as TABS) ?? TABS.CHARACTERS
  );
  const handleTabChange = (tab: TABS) => {
    setSelectedTab(tab);
    setSearchParams({ tab });
  };

  useEffect(() => {
    if (!isMobile && selectedTab === TABS.MOVES) {
      setSelectedTab(TABS.CHARACTERS);
    }
  }, [selectedTab, isMobile]);

  const doAnyDocsHaveImages = useCampaignGMScreenStore(
    (store) => store.doAnyDocsHaveImages
  );

  const locations = useCampaignGMScreenStore((store) => store.locations);
  const openLocationId = useCampaignGMScreenStore(
    (store) => store.openLocationId
  );
  const setOpenLocationId = useCampaignGMScreenStore(
    (store) => store.setOpenLocationId
  );

  const npcs = useCampaignGMScreenStore((store) => store.npcs);
  const openNPCId = useCampaignGMScreenStore((store) => store.openNPCId);
  const setOpenNPCId = useCampaignGMScreenStore((store) => store.setOpenNPCId);

  const lore = useCampaignGMScreenStore((store) => store.lore);
  const openLoreId = useCampaignGMScreenStore((store) => store.openLoreId);
  const setOpenLoreId = useCampaignGMScreenStore(
    (store) => store.setOpenLoreId
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
      <StyledTabs
        value={selectedTab}
        onChange={(evt, value) => handleTabChange(value)}
      >
        {isMobile && <StyledTab label={"Moves"} value={TABS.MOVES} />}
        <StyledTab label="Characters" value={TABS.CHARACTERS} />
        <StyledTab label="Tracks" value={TABS.TRACKS} />
        <StyledTab label="Oracle" value={TABS.ORACLE} />
        <StyledTab label="Notes" value={TABS.NOTES} />
        <StyledTab label="World" value={TABS.WORLD} />
        <StyledTab label="Locations" value={TABS.LOCATIONS} />
        <StyledTab label="NPCs" value={TABS.NPCS} />
        <StyledTab label="Lore" value={TABS.LORE} />
        <StyledTab label="Settings" value={TABS.SETTINGS} />
      </StyledTabs>
      <ContainedTabPanel isVisible={selectedTab === TABS.MOVES}>
        <MovesSection />
      </ContainedTabPanel>
      <ContainedTabPanel
        isVisible={selectedTab === TABS.CHARACTERS}
        greyBackground
      >
        <CharacterSection />
      </ContainedTabPanel>
      <ContainedTabPanel isVisible={selectedTab === TABS.TRACKS}>
        <TracksSection campaignId={campaignId} supply={campaign.supply} />
      </ContainedTabPanel>
      <ContainedTabPanel isVisible={selectedTab === TABS.ORACLE}>
        <OracleSection />
      </ContainedTabPanel>
      <ContainedTabPanel isVisible={selectedTab === TABS.NOTES}>
        <CampaignNotesSection campaignId={campaignId} />
      </ContainedTabPanel>

      <ContainedTabPanel isVisible={selectedTab === TABS.WORLD}>
        <WorldSection />
      </ContainedTabPanel>
      <ContainedTabPanel
        isVisible={selectedTab === TABS.LOCATIONS}
        greyBackground={worldId && worldOwnerId ? true : false}
      >
        <LocationsSection
          doAnyDocsHaveImages={doAnyDocsHaveImages}
          worldOwnerId={worldOwnerId}
          worldId={worldId}
          locations={locations}
          openLocationId={openLocationId}
          setOpenLocationId={setOpenLocationId}
          showHiddenTag
        />
      </ContainedTabPanel>
      <ContainedTabPanel
        isVisible={selectedTab === TABS.NPCS}
        greyBackground={worldId && worldOwnerId ? true : false}
      >
        <NPCSection
          doAnyDocsHaveImages={doAnyDocsHaveImages}
          worldOwnerId={worldOwnerId ?? ""}
          worldId={worldId ?? ""}
          locations={locations}
          npcs={npcs}
          openNPCId={openNPCId}
          setOpenNPCId={setOpenNPCId}
          showHiddenTag
        />
      </ContainedTabPanel>
      <ContainedTabPanel
        isVisible={selectedTab === TABS.LORE}
        greyBackground={worldId && worldOwnerId ? true : false}
      >
        <LoreSection
          doAnyDocsHaveImages={doAnyDocsHaveImages}
          worldOwnerId={worldOwnerId ?? ""}
          worldId={worldId ?? ""}
          lore={lore}
          openLoreId={openLoreId}
          setOpenLoreId={setOpenLoreId}
          showHiddenTag
        />
      </ContainedTabPanel>
      <ContainedTabPanel isVisible={selectedTab === TABS.SETTINGS}>
        <SettingsSection />
      </ContainedTabPanel>
    </Card>
  );
}
