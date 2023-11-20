import { Card, useMediaQuery, useTheme } from "@mui/material";
import { MovesSection } from "components/features/charactersAndCampaigns/MovesSection";
import { useEffect } from "react";
import { useState } from "react";
import { StoredCampaign } from "types/Campaign.type";
import { CharacterSection } from "./CharacterSection";
import { TracksSection } from "./TracksSection";
import { OracleSection } from "components/features/charactersAndCampaigns/OracleSection";
import { CampaignNotesSection } from "./CampaignNotesSection";
import { SettingsSection } from "./SettingsSection";
import { WorldSection } from "./WorldSection";
import { LocationsSection } from "components/features/worlds/Locations";
import { useSearchParams } from "react-router-dom";
import {
  StyledTabs,
  StyledTab,
  ContainedTabPanel,
} from "components/shared/StyledTabs";
import { NPCSection } from "components/features/worlds/NPCSection";
import { LoreSection } from "components/features/worlds/Lore";
import { useGameSystem } from "hooks/useGameSystem";
import { GAME_SYSTEMS } from "types/GameSystems.type";
import { SectorSection } from "components/features/worlds/SectorSection";

enum TABS {
  MOVES = "moves",
  CHARACTERS = "characters",
  TRACKS = "tracks",
  ORACLE = "oracle",
  NOTES = "notes",
  SETTINGS = "settings",
  WORLD = "world",
  SECTORS = "sectors",
  LOCATIONS = "locations",
  NPCS = "npcs",
  LORE = "lore",
}

export interface TabsSectionProps {
  campaign: StoredCampaign;
}

export function TabsSection(props: TabsSectionProps) {
  const { campaign } = props;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const shouldShowSectors =
    useGameSystem().gameSystem === GAME_SYSTEMS.STARFORGED;

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTab, setSelectedTab] = useState<TABS>(
    (searchParams.get("tab") as TABS) ?? TABS.CHARACTERS
  );
  const handleTabChange = (tab: TABS) => {
    setSelectedTab(tab);
    setSearchParams({ tab });
  };

  useEffect(() => {
    if (
      !isMobile &&
      (selectedTab === TABS.MOVES || selectedTab === TABS.ORACLE)
    ) {
      setSelectedTab(TABS.CHARACTERS);
    }
  }, [selectedTab, isMobile]);

  return (
    <Card
      variant={"outlined"}
      sx={(theme) => ({
        height: "100%",
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
        {isMobile && <StyledTab label={"Moves"} value={TABS.MOVES} />}
        {isMobile && <StyledTab label="Oracle" value={TABS.ORACLE} />}
        <StyledTab label="Characters" value={TABS.CHARACTERS} />
        <StyledTab label="Tracks" value={TABS.TRACKS} />
        <StyledTab label="Notes" value={TABS.NOTES} />
        <StyledTab label="World" value={TABS.WORLD} />
        {shouldShowSectors ? (
          <StyledTab label="Sectors" value={TABS.SECTORS} />
        ) : (
          <StyledTab label="Locations" value={TABS.LOCATIONS} />
        )}
        <StyledTab label="NPCs" value={TABS.NPCS} />
        <StyledTab label="Lore" value={TABS.LORE} />
        <StyledTab label="Settings" value={TABS.SETTINGS} />
      </StyledTabs>
      <ContainedTabPanel isVisible={selectedTab === TABS.MOVES}>
        <MovesSection />
      </ContainedTabPanel>
      <ContainedTabPanel isVisible={selectedTab === TABS.ORACLE}>
        <OracleSection />
      </ContainedTabPanel>
      <ContainedTabPanel
        isVisible={selectedTab === TABS.CHARACTERS}
        greyBackground
      >
        <CharacterSection />
      </ContainedTabPanel>
      <ContainedTabPanel isVisible={selectedTab === TABS.TRACKS}>
        <TracksSection supply={campaign.supply} />
      </ContainedTabPanel>
      <ContainedTabPanel isVisible={selectedTab === TABS.ORACLE}>
        <OracleSection />
      </ContainedTabPanel>
      <ContainedTabPanel isVisible={selectedTab === TABS.NOTES}>
        <CampaignNotesSection />
      </ContainedTabPanel>
      <ContainedTabPanel isVisible={selectedTab === TABS.WORLD}>
        <WorldSection />
      </ContainedTabPanel>
      {shouldShowSectors ? (
        <ContainedTabPanel
          isVisible={selectedTab === TABS.SECTORS}
          greyBackground={campaign.worldId ? true : false}
        >
          <SectorSection
            showHiddenTag
            openNPCTab={() => setSelectedTab(TABS.NPCS)}
          />
        </ContainedTabPanel>
      ) : (
        <ContainedTabPanel
          isVisible={selectedTab === TABS.LOCATIONS}
          greyBackground={campaign.worldId ? true : false}
        >
          <LocationsSection
            showHiddenTag
            openNPCTab={() => setSelectedTab(TABS.NPCS)}
          />
        </ContainedTabPanel>
      )}
      <ContainedTabPanel
        isVisible={selectedTab === TABS.NPCS}
        greyBackground={campaign.worldId ? true : false}
      >
        <NPCSection showHiddenTag />
      </ContainedTabPanel>
      <ContainedTabPanel
        isVisible={selectedTab === TABS.LORE}
        greyBackground={campaign.worldId ? true : false}
      >
        <LoreSection showHiddenTag />
      </ContainedTabPanel>
      <ContainedTabPanel isVisible={selectedTab === TABS.SETTINGS}>
        <SettingsSection />
      </ContainedTabPanel>
    </Card>
  );
}
