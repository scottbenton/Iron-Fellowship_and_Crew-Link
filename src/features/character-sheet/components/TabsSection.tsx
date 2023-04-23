import { Box, Card, Tab, Tabs, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { TRACK_TYPES } from "../../../types/Track.type";
import { AssetsSection } from "./AssetsSection";
import { ProgressTrackSection } from "./ProgressTrackSection";
import { CharacterSection } from "./CharacterSection";
import { MovesSection } from "components/MovesSection";
import { useCharacterSheetStore } from "../characterSheet.store";
import { OracleSection } from "components/OracleSection";
import { NotesSection } from "./NotesSection";
import { WorldSection } from "./WorldSection";
import { LocationsSection } from "components/Locations";
import { useAuth } from "providers/AuthProvider";

enum TABS {
  MOVES,
  ASSETS,
  ORACLE,
  VOWS,
  JOURNEYS,
  FRAYS,
  CHARACTER,
  NOTES,
  WORLD,
  LOCATIONS,
}

export function TabsSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [selectedTab, setSelectedTab] = useState<TABS>(TABS.ASSETS);

  const isInCampaign = useCharacterSheetStore(
    (store) => !!store.character?.campaignId
  );

  const uid = useAuth().user?.uid;

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
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={selectedTab}
          onChange={(evt, value) => setSelectedTab(value)}
          variant={"scrollable"}
          scrollButtons={"auto"}
        >
          {isMobile && <Tab label={"Moves"} value={TABS.MOVES} />}
          <Tab label="Assets" value={TABS.ASSETS} />
          {!isInCampaign && <Tab label="Oracle" value={TABS.ORACLE} />}
          <Tab label="Vows" value={TABS.VOWS} />
          <Tab label="Combat" value={TABS.FRAYS} />
          <Tab label="Journeys" value={TABS.JOURNEYS} />
          <Tab label="Notes (Beta)" value={TABS.NOTES} />
          <Tab label={"World"} value={TABS.WORLD} />
          <Tab label={"Locations"} value={TABS.LOCATIONS} />
          <Tab label="Character" value={TABS.CHARACTER} />
        </Tabs>
      </Box>
      <Box
        flexGrow={1}
        overflow={"auto"}
        bgcolor={(theme) =>
          selectedTab === TABS.ASSETS ? theme.palette.grey[100] : undefined
        }
      >
        {selectedTab === TABS.MOVES && <MovesSection />}
        {selectedTab === TABS.ASSETS && <AssetsSection />}
        {selectedTab === TABS.ORACLE && <OracleSection />}
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
        {selectedTab === TABS.CHARACTER && <CharacterSection />}
      </Box>
    </Card>
  );
}
