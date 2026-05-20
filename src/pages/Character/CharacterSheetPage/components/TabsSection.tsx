import { Card } from "@mui/material";
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
import { useUpdateQueryStringValueWithoutNavigation } from "hooks/useUpdateQueryStringValueWithoutNavigation";
import { useGameSystemValue } from "hooks/useGameSystemValue";
import { useCampaignType } from "hooks/useCampaignType";
import { useNewMaps } from "hooks/featureFlags/useNewMaps";
import { useIsMobile } from "hooks/useIsMobile";

enum TABS {
  MOVES = "moves",
  ASSETS = "assets",
  ORACLE = "oracle",
  TRACKS = "tracks",
  NOTES = "notes",
  WORLD = "world",
  LOCATIONS = "location",
  SECTORS = "sectors",
  NPCS = "npcs",
  LORE = "lore",
  IMPACTS = "impacts",
}

export function TabsSection() {
  const isMobile = useIsMobile();

  const impactsLabel = useGameSystemValue({
    [GAME_SYSTEMS.IRONSWORN]: "Debilities",
    [GAME_SYSTEMS.STARFORGED]: "Impacts",
  });

  const [searchParams] = useSearchParams();
  const [selectedTab, setSelectedTab] = useState<TABS>(
    (searchParams.get("tab") as TABS) ?? TABS.ASSETS
  );
  const handleTabChange = (tab: TABS) => {
    setSelectedTab(tab);
  };

  useUpdateQueryStringValueWithoutNavigation("tab", selectedTab);

  const showNewLocations = useNewMaps();
  const shouldShowSectors =
    useGameSystem().gameSystem === GAME_SYSTEMS.STARFORGED && !showNewLocations;

  const isInCampaign = useStore(
    (store) => !!store.characters.currentCharacter.currentCharacter?.campaignId
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

  const { showGuideTips } = useCampaignType();

  return (
    <Card
      variant={"outlined"}
      sx={{
        borderRadius: { xs: 0, md: 1 },
        borderWidth: { xs: 0, md: 1 },
        borderTopWidth: { xs: 1 },
        mx: { xs: -2, sm: -3, md: 0 },
        flexGrow: 1,
        mt: 2,
        display: "flex",
        flexDirection: "column",
      }}
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
        <StyledTab label={impactsLabel} value={TABS.IMPACTS} />
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
            showHiddenTag={showGuideTips}
            openNPCTab={() => setSelectedTab(TABS.NPCS)}
          />
        </ContainedTabPanel>
      ) : (
        <ContainedTabPanel
          isVisible={selectedTab === TABS.LOCATIONS}
          greyBackground={worldExists}
        >
          <LocationsSection
            showHiddenTag
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
          showHiddenTag={showGuideTips}
        />
      </ContainedTabPanel>
      <ContainedTabPanel
        isVisible={selectedTab === TABS.LORE}
        greyBackground={worldExists}
      >
        <LoreSection
          isSinglePlayer={!isInCampaign}
          showHiddenTag={showGuideTips}
        />
      </ContainedTabPanel>
      <ContainedTabPanel isVisible={selectedTab === TABS.IMPACTS}>
        <CharacterSection />
      </ContainedTabPanel>
    </Card>
  );
}
