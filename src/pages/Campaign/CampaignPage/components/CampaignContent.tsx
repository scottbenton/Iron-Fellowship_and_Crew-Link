import { Card } from "@mui/material";
import {
  ContainedTabPanel,
  StyledTab,
  StyledTabs,
} from "components/shared/StyledTabs";
import { useCampaignType } from "hooks/useCampaignType";
import { useUpdateQueryStringValueWithoutNavigation } from "hooks/useUpdateQueryStringValueWithoutNavigation";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CharacterTab, NotesTab, TracksTab, WorldTab } from "./Tabs";
import { useStore } from "stores/store";
import { NPCSection } from "components/features/worlds/NPCSection";
import { LoreSection } from "components/features/worlds/Lore";
import { LocationsSection } from "components/features/worlds/Locations";

enum CampaignTabs {
  Characters = "characters",
  Tracks = "tracks",
  Notes = "notes",
  World = "world",
  Locations = "locations",
  NPCs = "ncps",
  Lore = "lore",
}

export interface CampaignContentProps {
  openInviteDialog: () => void;
}

export function CampaignContent(props: CampaignContentProps) {
  const { openInviteDialog } = props;
  const { showGuidedPlayerView, showGuideTips } = useCampaignType();

  const [searchParams] = useSearchParams();
  const [selectedTab, setSelectedTab] = useState<CampaignTabs>(
    (searchParams.get("tab") as CampaignTabs) ?? CampaignTabs.Characters
  );
  useUpdateQueryStringValueWithoutNavigation("tab", selectedTab);
  const handleTabChange = (tab: CampaignTabs) => {
    setSelectedTab(tab);
  };

  const hasWorld = useStore(
    (store) => !!store.campaigns.currentCampaign.currentCampaign?.worldId
  );

  return (
    <Card
      variant={"outlined"}
      sx={{
        borderWidth: { xs: 0, md: 1 },
        borderTopWidth: { xs: 1 },
        mx: { xs: -2, sm: -3, md: 0 },
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <StyledTabs
        value={selectedTab}
        onChange={(evt, value) => handleTabChange(value)}
        sx={(theme) => ({
          borderTopRightRadius: theme.shape.borderRadius,
          borderTopLeftRadius: theme.shape.borderRadius,
        })}
      >
        <StyledTab label="Characters" value={CampaignTabs.Characters} />
        <StyledTab label="Tracks" value={CampaignTabs.Tracks} />
        {!showGuidedPlayerView && (
          <StyledTab label="Notes" value={CampaignTabs.Notes} />
        )}
        <StyledTab label="World" value={CampaignTabs.World} />
        <StyledTab label="Locations" value={CampaignTabs.Locations} />
        <StyledTab label="NPCs" value={CampaignTabs.NPCs} />
        <StyledTab label="Lore" value={CampaignTabs.Lore} />
      </StyledTabs>
      <ContainedTabPanel isVisible={selectedTab === CampaignTabs.Characters}>
        <CharacterTab openInviteDialog={openInviteDialog} />
      </ContainedTabPanel>
      <ContainedTabPanel isVisible={selectedTab === CampaignTabs.Tracks}>
        <TracksTab />
      </ContainedTabPanel>
      <ContainedTabPanel
        excludePadding
        isVisible={selectedTab === CampaignTabs.Notes}
      >
        <NotesTab />
      </ContainedTabPanel>
      <ContainedTabPanel isVisible={selectedTab === CampaignTabs.World}>
        <WorldTab />
      </ContainedTabPanel>
      <ContainedTabPanel
        isVisible={selectedTab === CampaignTabs.Locations}
        greyBackground={hasWorld}
      >
        <LocationsSection
          showHiddenTag
          openNPCTab={() => setSelectedTab(CampaignTabs.NPCs)}
        />
      </ContainedTabPanel>
      <ContainedTabPanel
        isVisible={selectedTab === CampaignTabs.NPCs}
        greyBackground={hasWorld}
      >
        <NPCSection showHiddenTag={showGuideTips} />
      </ContainedTabPanel>
      <ContainedTabPanel
        isVisible={selectedTab === CampaignTabs.Lore}
        greyBackground={hasWorld}
      >
        <LoreSection showHiddenTag={showGuideTips} />
      </ContainedTabPanel>
    </Card>
  );
}
