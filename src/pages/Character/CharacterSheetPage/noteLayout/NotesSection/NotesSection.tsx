import { Box } from "@mui/material";
import {
  ContainedTabPanel,
  StyledTab,
  StyledTabs,
} from "components/shared/StyledTabs";
import { useUpdateQueryStringValueWithoutNavigation } from "hooks/useUpdateQueryStringValueWithoutNavigation";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { WorldSection } from "../../Tabs/WorldSection";
import { LocationsSection } from "components/features/worlds/Locations";
import { NPCSection } from "components/features/worlds/NPCSection";
import { LoreSection } from "components/features/worlds/Lore";
import { NoteTab } from "../../Tabs/NoteTab";

enum NoteTabs {
  Notes = "notes",
  World = "world",
  Locations = "locations",
  NPCs = "npcs",
  Lore = "lore",
}

export function NotesSection() {
  const [searchParams] = useSearchParams();

  const [currentTab, setCurrentTab] = useState(
    (searchParams.get("noteTab") as NoteTabs) ?? NoteTabs.Notes
  );
  useUpdateQueryStringValueWithoutNavigation("noteTab", currentTab);
  return (
    <Box px={2} display={"flex"} flexDirection={"column"} overflow={"hidden"}>
      <Box>
        <StyledTabs
          centered
          variant={"standard"}
          value={currentTab}
          onChange={(evt, value) => setCurrentTab(value)}
          removeBackgroundColor
        >
          <StyledTab label={"Notes"} value={NoteTabs.Notes} />
          <StyledTab label={"World"} value={NoteTabs.World} />
          <StyledTab label={"Locations"} value={NoteTabs.Locations} />
          <StyledTab label={"NPCs"} value={NoteTabs.NPCs} />
          <StyledTab label={"Lore"} value={NoteTabs.Lore} />
        </StyledTabs>
      </Box>
      <Box
        flexGrow={1}
        display={"flex"}
        flexDirection={"column"}
        overflow={"auto"}
      >
        <ContainedTabPanel isVisible={currentTab === NoteTabs.Notes}>
          <NoteTab />
        </ContainedTabPanel>
        <ContainedTabPanel isVisible={currentTab === NoteTabs.World}>
          <WorldSection />
        </ContainedTabPanel>
        <ContainedTabPanel isVisible={currentTab === NoteTabs.Locations}>
          <LocationsSection
            openNPCTab={() => setCurrentTab(NoteTabs.NPCs)}
            hideSidebar
          />
        </ContainedTabPanel>
        <ContainedTabPanel isVisible={currentTab === NoteTabs.NPCs}>
          <NPCSection hideSidebar />
        </ContainedTabPanel>
        <ContainedTabPanel isVisible={currentTab === NoteTabs.Lore}>
          <LoreSection hideSidebar />
        </ContainedTabPanel>
      </Box>
    </Box>
  );
}
