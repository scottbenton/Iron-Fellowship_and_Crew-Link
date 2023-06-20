import { Card, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useCharacterSheetStore } from "../characterSheet.store";
import { useAuth } from "providers/AuthProvider";
import { MovesSection } from "components/MovesSection";
import { AssetsSection } from "../Tabs/AssetsSection";
import { OracleSection } from "components/OracleSection";
import { ProgressTrackSection } from "../Tabs/ProgressTrackSection";
import { TRACK_TYPES } from "types/Track.type";
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

enum TABS {
  MOVES = "moves",
  ASSETS = "assets",
  ORACLE = "oracle",
  VOWS = "vows",
  JOURNEYS = "journeys",
  FRAYS = "frays",
  CHARACTER = "character",
  NOTES = "notes",
  WORLD = "world",
  LOCATIONS = "location",
  NPCS = "npcs",
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

  const characterId = useCharacterSheetStore(
    (store) => store.characterId ?? ""
  );

  const isSinglePlayer = useCharacterSheetStore((store) => !store.campaignId);
  const worldId = useCharacterSheetStore((store) =>
    store.campaignId ? store.campaign?.worldId : store.character?.worldId
  );
  const worldOwnerId = useCharacterSheetStore((store) =>
    store.campaignId ? store.campaign?.gmId : uid
  );

  const locations = useCharacterSheetStore((store) => store.locations);
  const openLocationId = useCharacterSheetStore(
    (store) => store.openLocationId
  );
  const setOpenLocationId = useCharacterSheetStore(
    (store) => store.setOpenLocationId
  );

  const npcs = useCharacterSheetStore((store) => store.npcs);
  const openNPCId = useCharacterSheetStore((store) => store.openNPCId);
  const setOpenNPCId = useCharacterSheetStore((store) => store.setOpenNPCId);

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
        {!isInCampaign && <StyledTab label="Oracle" value={TABS.ORACLE} />}
        <StyledTab label="Vows" value={TABS.VOWS} />
        <StyledTab label="Combat" value={TABS.FRAYS} />
        <StyledTab label="Journeys" value={TABS.JOURNEYS} />
        <StyledTab label="Notes" value={TABS.NOTES} />
        <StyledTab label={"World"} value={TABS.WORLD} />
        <StyledTab label={"Locations"} value={TABS.LOCATIONS} />
        {/* <StyledTab label={"NPCs"} value={TABS.NPCS} /> */}
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
      <ContainedTabPanel isVisible={selectedTab === TABS.VOWS}>
        <ProgressTrackSection
          type={TRACK_TYPES.VOW}
          typeLabel={"Vow"}
          showPersonalIfInCampaign
        />
      </ContainedTabPanel>
      <ContainedTabPanel isVisible={selectedTab === TABS.FRAYS}>
        <ProgressTrackSection
          type={TRACK_TYPES.FRAY}
          typeLabel={"Combat Track"}
        />
      </ContainedTabPanel>
      <ContainedTabPanel isVisible={selectedTab === TABS.JOURNEYS}>
        <ProgressTrackSection
          type={TRACK_TYPES.JOURNEY}
          typeLabel={"Journey"}
        />
      </ContainedTabPanel>
      <ContainedTabPanel isVisible={selectedTab === TABS.NOTES}>
        <NotesSection />
      </ContainedTabPanel>
      <ContainedTabPanel isVisible={selectedTab === TABS.WORLD}>
        <WorldSection />
      </ContainedTabPanel>
      <ContainedTabPanel
        isVisible={selectedTab === TABS.LOCATIONS}
        greyBackground={
          true || (!openLocationId && worldId && worldOwnerId) ? true : false
        }
      >
        <LocationsSection
          worldId={worldId}
          worldOwnerId={worldOwnerId}
          isCharacterSheet
          isSinglePlayer={isSinglePlayer}
          locations={locations}
          openLocationId={openLocationId}
          setOpenLocationId={setOpenLocationId}
          showHiddenTag={worldOwnerId === uid}
        />
      </ContainedTabPanel>
      <ContainedTabPanel
        isVisible={selectedTab === TABS.NPCS}
        greyBackground={
          true || (!openLocationId && worldId && worldOwnerId) ? true : false
        }
      >
        <NPCSection
          worldId={worldId ?? ""}
          worldOwnerId={worldOwnerId ?? ""}
          npcs={npcs}
          locations={locations}
          openNPCId={openNPCId}
          setOpenNPCId={setOpenNPCId}
        />
      </ContainedTabPanel>
      <ContainedTabPanel isVisible={selectedTab === TABS.CHARACTER}>
        <CharacterSection />
      </ContainedTabPanel>
      {/* 
          {selectedTab === TABS.NOTES && <NotesSection />}
          {selectedTab === TABS.WORLD && <WorldSection />}
          {selectedTab === TABS.LOCATIONS && (
            <LocationsSection
              worldId={worldId}
              worldOwnerId={worldOwnerId}
              isCharacterSheet
              isSinglePlayer={isSinglePlayer}
              locations={locations}
              openLocationId={openLocationId}
              setOpenLocationId={setOpenLocationId}
            />
          )}
          {selectedTab === TABS.CHARACTER && <CharacterSection />} */}
    </Card>
  );
}
