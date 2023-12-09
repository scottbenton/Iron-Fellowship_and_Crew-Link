import { Card, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { AssetsSection } from "../Tabs/AssetsSection";
import { NotesSection } from "../Tabs/NotesSection";
import { WorldSection } from "../Tabs/WorldSection";
import { LocationsSection } from "components/features/worlds/Locations";
import { CharacterSection } from "../Tabs/CharacterSection";
import { useSearchParams } from "react-router-dom";
import {
  StyledTabs,
  StyledTab,
  ContainedTabPanel,
} from "components/shared/StyledTabs";
import { NPCSection } from "components/features/worlds/NPCSection";
import { LoreSection } from "components/features/worlds/Lore";
import { TracksSection } from "../Tabs/TracksSection";
import { useStore } from "stores/store";
import { SectorSection } from "components/features/worlds/SectorSection";
import { useGameSystem } from "hooks/useGameSystem";
import { GAME_SYSTEMS } from "types/GameSystems.type";

enum TABS {
  MOVES = "moves",
  ASSETS = "assets",
  ORACLE = "oracle",
  TRACKS = "tracks",
  CHARACTER = "character",
  NOTES = "notes",
  WORLD = "world",
  LOCATIONS = "location",
  SECTORS = "sectors",
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

  const shouldShowSectors =
    useGameSystem().gameSystem === GAME_SYSTEMS.STARFORGED;

  const isInCampaign = useStore(
    (store) => !!store.characters.currentCharacter.currentCharacter?.campaignId
  );

  const isWorldOwner = useStore((store) =>
    store.worlds.currentWorld.currentWorld?.ownerIds.includes(store.auth.uid)
  );

  const worldExists = useStore(
    (store) => !!store.worlds.currentWorld.currentWorld
  );

  useEffect(() => {
    if (
      !isMobile &&
      (selectedTab === TABS.MOVES || selectedTab === TABS.ORACLE)
    ) {
      setSelectedTab(TABS.ASSETS);
    }
  }, [selectedTab, isMobile]);

  return (
    <Card
      variant={"outlined"}
      sx={(theme) => ({
        flexGrow: 1,
        mt: 2,
        display: "flex",
        flexDirection: "column",
        [theme.breakpoints.down("sm")]: {
          mx: -2,
        },
      })}
    >
      <StyledTabs
        value={selectedTab}
        onChange={(evt, value) => handleTabChange(value)}
      >
        <StyledTab label="Assets" value={TABS.ASSETS} />
        <StyledTab label="Tracks" value={TABS.TRACKS} />
        <StyledTab label="Notes" value={TABS.NOTES} />
        <StyledTab label={"World"} value={TABS.WORLD} />
        {shouldShowSectors ? (
          <StyledTab label={"Sectors"} value={TABS.SECTORS} />
        ) : (
          <StyledTab label={"Locations"} value={TABS.LOCATIONS} />
        )}
        <StyledTab label={"NPCs"} value={TABS.NPCS} />
        <StyledTab label={"Lore"} value={TABS.LORE} />
        <StyledTab label="Character" value={TABS.CHARACTER} />
      </StyledTabs>
      <ContainedTabPanel isVisible={selectedTab === TABS.ASSETS} greyBackground>
        <AssetsSection />
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
      {shouldShowSectors ? (
        <ContainedTabPanel
          greyBackground={worldExists}
          isVisible={selectedTab === TABS.SECTORS}
        >
          <SectorSection
            showHiddenTag={isWorldOwner && isInCampaign}
            openNPCTab={() => setSelectedTab(TABS.NPCS)}
          />
        </ContainedTabPanel>
      ) : (
        <ContainedTabPanel
          isVisible={selectedTab === TABS.LOCATIONS}
          greyBackground={worldExists}
        >
          <LocationsSection
            isSinglePlayer={!isInCampaign}
            showHiddenTag={isWorldOwner && isInCampaign}
            openNPCTab={() => setSelectedTab(TABS.NPCS)}
          />
        </ContainedTabPanel>
      )}
      <ContainedTabPanel
        isVisible={selectedTab === TABS.NPCS}
        greyBackground={worldExists}
      >
        <NPCSection
          isSinglePlayer={!isInCampaign}
          showHiddenTag={isWorldOwner && isInCampaign}
        />
      </ContainedTabPanel>
      <ContainedTabPanel
        isVisible={selectedTab === TABS.LORE}
        greyBackground={worldExists}
      >
        <LoreSection
          isSinglePlayer={!isInCampaign}
          showHiddenTag={isWorldOwner && isInCampaign}
        />
      </ContainedTabPanel>
      <ContainedTabPanel isVisible={selectedTab === TABS.CHARACTER}>
        <CharacterSection />
      </ContainedTabPanel>
    </Card>
  );
}
