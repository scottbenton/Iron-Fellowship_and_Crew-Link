import { Card, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useCharacterSheetStore } from "../characterSheet.store";
import { useAuth } from "providers/AuthProvider";
import { MovesSection } from "components/MovesSection";
import { AssetsSection } from "../Tabs/AssetsSection";
import { OracleSection } from "components/OracleSection";
import { NotesSection } from "../Tabs/NotesSection";
import { WorldSection } from "../Tabs/WorldSection";
import { LocationsSection } from "components/Locations";
import { CharacterSection } from "../Tabs/CharacterSection";
import { useSearchParams } from "react-router-dom";
import {
  StyledTabs,
  StyledTab,
  ContainedTabPanel,
} from "components/StyledTabs";
import { NPCSection } from "components/NPCSection";
import { LoreSection } from "components/Lore";
import { TracksSection } from "../Tabs/TracksSection";

enum TABS {
  MOVES = "moves",
  ASSETS = "assets",
  ORACLE = "oracle",
  TRACKS = "tracks",
  CHARACTER = "character",
  NOTES = "notes",
  WORLD = "world",
  LOCATIONS = "location",
  NPCS = "npcs",
  LORE = "lore",
}

export function TabsSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTab, setSelectedTab] = useState<TABS>(
    (searchParams.get("tab") as TABS) ?? TABS.ASSETS
  );
  const handleTabChange = (tab: TABS) => {
    setSelectedTab(tab);
    setSearchParams({ tab });
  };

  const isInCampaign = useCharacterSheetStore(
    (store) => !!store.character?.campaignId
  );

  const uid = useAuth().user?.uid;

  const isSinglePlayer = useCharacterSheetStore((store) => !store.campaignId);
  const isGM = useCharacterSheetStore(
    (store) => !!uid && (store.campaign?.gmIds?.includes(uid) ?? false)
  );
  const worldId = useCharacterSheetStore((store) =>
    store.campaignId ? store.campaign?.worldId : store.character?.worldId
  );
  const worldOwnerId = useCharacterSheetStore((store) => store.worldOwnerId);

  useEffect(() => {
    if (!isMobile && selectedTab === TABS.MOVES) {
      setSelectedTab(TABS.ASSETS);
    }
  }, [selectedTab, isMobile]);

  return (
    <Card
      variant={"outlined"}
      sx={{ flexGrow: 1, mt: 2, display: "flex", flexDirection: "column" }}
    >
      <StyledTabs
        value={selectedTab}
        onChange={(evt, value) => handleTabChange(value)}
      >
        {isMobile && <StyledTab label={"Moves"} value={TABS.MOVES} />}
        <StyledTab label="Assets" value={TABS.ASSETS} />
        {(!isInCampaign || isGM) && (
          <StyledTab label="Oracle" value={TABS.ORACLE} />
        )}
        <StyledTab label="Tracks" value={TABS.TRACKS} />
        <StyledTab label="Notes" value={TABS.NOTES} />
        <StyledTab label={"World"} value={TABS.WORLD} />
        <StyledTab label={"Locations"} value={TABS.LOCATIONS} />
        <StyledTab label={"NPCs"} value={TABS.NPCS} />
        <StyledTab label={"Lore"} value={TABS.LORE} />
        <StyledTab label="Character" value={TABS.CHARACTER} />
      </StyledTabs>
      <ContainedTabPanel isVisible={selectedTab === TABS.MOVES}>
        <MovesSection />
      </ContainedTabPanel>
      <ContainedTabPanel isVisible={selectedTab === TABS.ASSETS} greyBackground>
        <AssetsSection />
      </ContainedTabPanel>
      <ContainedTabPanel isVisible={selectedTab === TABS.ORACLE}>
        <OracleSection />
      </ContainedTabPanel>
      <ContainedTabPanel isVisible={selectedTab === TABS.TRACKS}>
        <TracksSection />
      </ContainedTabPanel>
      <ContainedTabPanel isVisible={selectedTab === TABS.NOTES}>
        <NotesSection />
      </ContainedTabPanel>
      <ContainedTabPanel isVisible={selectedTab === TABS.WORLD}>
        <WorldSection />
      </ContainedTabPanel>
      <ContainedTabPanel
        isVisible={selectedTab === TABS.LOCATIONS}
        greyBackground={worldId && worldOwnerId ? true : false}
      >
        <LocationsSection
          worldId={worldId}
          worldOwnerId={worldOwnerId}
          isSinglePlayer={isSinglePlayer}
          showHiddenTag={worldOwnerId === uid && !isSinglePlayer}
          useStore={useCharacterSheetStore}
        />
      </ContainedTabPanel>
      <ContainedTabPanel
        isVisible={selectedTab === TABS.NPCS}
        greyBackground={worldId && worldOwnerId ? true : false}
      >
        <NPCSection
          worldId={worldId ?? ""}
          worldOwnerId={worldOwnerId ?? ""}
          isSinglePlayer={isSinglePlayer}
          showHiddenTag={worldOwnerId === uid && !isSinglePlayer}
          useStore={useCharacterSheetStore}
        />
      </ContainedTabPanel>
      <ContainedTabPanel
        isVisible={selectedTab === TABS.LORE}
        greyBackground={worldId && worldOwnerId ? true : false}
      >
        <LoreSection
          worldId={worldId ?? ""}
          worldOwnerId={worldOwnerId ?? ""}
          isSinglePlayer={isSinglePlayer}
          showHiddenTag={worldOwnerId === uid && !isSinglePlayer}
          useStore={useCharacterSheetStore}
        />
      </ContainedTabPanel>
      <ContainedTabPanel isVisible={selectedTab === TABS.CHARACTER}>
        <CharacterSection />
      </ContainedTabPanel>
    </Card>
  );
}
