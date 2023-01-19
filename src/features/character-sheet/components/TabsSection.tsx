import { Box, Card, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { TRACK_TYPES } from "../../../types/Track.type";
import { AssetsSection } from "./AssetsSection";
import { ProgressTrackSection } from "./ProgressTrackSection";

enum TABS {
  ASSETS,
  VOWS,
  JOURNEYS,
  FRAYS,
}

export function TabsSection() {
  const [selectedTab, setSelectedTab] = useState<TABS>(TABS.ASSETS);
  return (
    <Card
      variant={"outlined"}
      sx={{ flexGrow: 1, mt: 2, display: "flex", flexDirection: "column" }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={selectedTab}
          onChange={(evt, value) => setSelectedTab(value)}
        >
          <Tab label="Assets" value={TABS.ASSETS} />
          <Tab label="Vows" value={TABS.VOWS} />
          <Tab label="Combat" value={TABS.FRAYS} />
          <Tab label="Journeys" value={TABS.JOURNEYS} />
        </Tabs>
      </Box>
      <Box
        flexGrow={1}
        overflow={"auto"}
        bgcolor={(theme) =>
          selectedTab === TABS.ASSETS ? theme.palette.grey[100] : undefined
        }
      >
        {selectedTab === TABS.ASSETS && <AssetsSection />}
        {selectedTab === TABS.VOWS && (
          <ProgressTrackSection
            type={TRACK_TYPES.VOW}
            typeLabel={"Vow"}
            showPersonalIfInCampaign
          />
        )}
        {selectedTab === TABS.FRAYS && (
          <ProgressTrackSection
            type={TRACK_TYPES.FRAY}
            typeLabel={"Combat Track"}
          />
        )}

        {selectedTab === TABS.JOURNEYS && (
          <ProgressTrackSection
            type={TRACK_TYPES.JOURNEY}
            typeLabel={"Journey"}
          />
        )}
      </Box>
    </Card>
  );
}
