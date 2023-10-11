import {
  Box,
  Card,
  CardActionArea,
  Checkbox,
  FormControlLabel,
  Grid,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { SectorMap } from "./SectorMap";
import { useStore } from "stores/store";
import { ItemHeader } from "../ItemHeader";
import { SECTOR_TABS } from "stores/world/currentWorld/sector/sector.slice.type";
import { SECTOR_HEX_TYPES, SectorMap as ISectorMap } from "types/Sector.type";
import { SectorRegionAutocomplete } from "./SectorRegionAutocomplete";
import { useRoller } from "providers/DieRollProvider";
import { planetDescriptions } from "data/oracles";
import { SectorLocationCard } from "./SectorLocationCard";
import { StarforgedLocationPlanet } from "types/LocationStarforged.type";
import { SectorLocationDialog } from "./SectorLocationDialog/SectorLocationDialog";
import { useWorldPermissions } from "../useWorldPermissions";
import { RtcRichTextEditor } from "components/shared/RichTextEditor";
import { NotesSectionHeader } from "../NotesSectionHeader";

interface OpenSectorProps {
  sectorId: string;
}

export function OpenSector(props: OpenSectorProps) {
  const { sectorId } = props;

  const { rollOracleTable } = useRoller();

  const worldId = useStore(
    (store) => store.worlds.currentWorld.currentWorldId ?? ""
  );
  const sector = useStore(
    (store) => store.worlds.currentWorld.currentWorldSectors.sectors[sectorId]
  );
  const sectorLocations = useStore(
    (store) => store.worlds.currentWorld.currentWorldSectors.locations.locations
  );
  const setOpenSectorId = useStore(
    (store) => store.worlds.currentWorld.currentWorldSectors.setOpenSectorId
  );

  const updateSectorName = useStore(
    (store) => store.worlds.currentWorld.currentWorldSectors.updateName
  );

  const openTab = useStore(
    (store) => store.worlds.currentWorld.currentWorldSectors.openSectorTab
  );
  const setOpenTab = useStore(
    (store) => store.worlds.currentWorld.currentWorldSectors.setOpenSectorTab
  );

  const updateSector = useStore(
    (store) => store.worlds.currentWorld.currentWorldSectors.updateSector
  );
  const addHexToMap = useStore(
    (store) => store.worlds.currentWorld.currentWorldSectors.updateHex
  );
  const createLocation = useStore(
    (store) =>
      store.worlds.currentWorld.currentWorldSectors.locations.createLocation
  );

  const setOpenSectorLocationId = useStore(
    (store) =>
      store.worlds.currentWorld.currentWorldSectors.locations.setOpenLocationId
  );

  const handleAddHex = async (
    row: number,
    col: number,
    hexType?: SECTOR_HEX_TYPES
  ) => {
    let locationId: string | undefined = undefined;
    if (hexType === SECTOR_HEX_TYPES.STAR) {
      const description = rollOracleTable(
        "starforged/oracles/space/stellar_object",
        false
      );
      locationId = await createLocation({
        name: "New Star",
        type: SECTOR_HEX_TYPES.STAR,
        description,
      });
    } else if (hexType === SECTOR_HEX_TYPES.PLANET) {
      const planetClass = rollOracleTable(
        "starforged/oracles/planets/class",
        false
      );
      if (!planetClass) {
        return;
      }
      const convertedClass = planetClass?.split(" ")[0].toLocaleLowerCase();
      const name = rollOracleTable(
        `starforged/oracles/planets/${convertedClass}/sample_names`,
        false
      );
      const description = convertedClass
        ? planetDescriptions[convertedClass]
        : "";

      locationId = await createLocation({
        name: name ?? "New Planet",
        type: SECTOR_HEX_TYPES.PLANET,
        subType: convertedClass,
        planetClassName: planetClass,
        description,
      });
    } else if (hexType === SECTOR_HEX_TYPES.SETTLEMENT) {
      const name = rollOracleTable(
        "starforged/oracles/settlements/name",
        false
      );
      locationId = await createLocation({
        name: name ?? "New Sector",
        type: SECTOR_HEX_TYPES.SETTLEMENT,
      });
    } else if (hexType === SECTOR_HEX_TYPES.DERELICT) {
      locationId = await createLocation({
        name: "New Derelict",
        type: SECTOR_HEX_TYPES.DERELICT,
      });
    } else if (hexType === SECTOR_HEX_TYPES.VAULT) {
      locationId = await createLocation({
        name: "New Vault",
        type: SECTOR_HEX_TYPES.VAULT,
      });
    } else if (hexType === SECTOR_HEX_TYPES.OTHER) {
      locationId = await createLocation({
        name: "Unknown Location",
        type: SECTOR_HEX_TYPES.OTHER,
      });
    }

    const cell:
      | {
          type: SECTOR_HEX_TYPES;
          locationId?: string;
        }
      | undefined = hexType ? { type: hexType } : undefined;
    if (cell && locationId) {
      cell.locationId = locationId;
    }
    addHexToMap(row, col, cell).catch(() => {});
  };

  const { showGMFields, showGMTips, isSingleplayer } = useWorldPermissions();
  const notes = useStore(
    (store) => store.worlds.currentWorld.currentWorldSectors.openSectorNotes
  );
  const gmNotes = useStore(
    (store) => store.worlds.currentWorld.currentWorldSectors.openSectorGMNotes
  );
  const updateNotes = useStore(
    (store) => store.worlds.currentWorld.currentWorldSectors.updateSectorNotes
  );

  return (
    <Box>
      <SectorLocationDialog />
      <ItemHeader
        itemName={sector.name}
        updateName={(name) => updateSectorName(name).catch(() => {})}
        nameOracleIds={[
          "starforged/oracles/space/sector_name/prefix",
          "starforged/oracles/space/sector_name/suffix",
        ]}
        joinOracles
        closeItem={() => setOpenSectorId()}
      />
      <SectorMap
        map={sector.map}
        addHex={(row, col, type) =>
          handleAddHex(row, col, type).catch(() => {})
        }
      />
      <Box
        sx={(theme) => ({
          bgcolor: theme.palette.background.paper,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderWidth: 0,
          borderStyle: "solid",
          borderColor: theme.palette.divider,
        })}
      >
        <Grid container spacing={2} sx={{ px: 2, mt: 0 }}>
          <Grid item xs={12} md={6}>
            <SectorRegionAutocomplete />
          </Grid>
          {showGMFields && (
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sector.sharedWithPlayers ?? false}
                    onChange={(evt, value) =>
                      updateSector({ sharedWithPlayers: value })
                    }
                  />
                }
                label={"Visible to Players"}
                sx={{}}
              />
            </Grid>
          )}
        </Grid>
        <Tabs
          value={openTab}
          onChange={(evt, value) => setOpenTab(value)}
          sx={(theme) => ({
            px: 2,
            mt: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
          })}
        >
          <Tab label={"Locations"} value={SECTOR_TABS.LOCATIONS} />
          <Tab label={"Notes"} value={SECTOR_TABS.NOTES} />
        </Tabs>
        {openTab === SECTOR_TABS.LOCATIONS && (
          <Grid container spacing={2} sx={{ mt: 0, px: 2, pb: 2 }}>
            {Object.keys(sectorLocations)
              .sort((l1, l2) =>
                sectorLocations[l1].name.localeCompare(sectorLocations[l2].name)
              )
              .map((locationId) => (
                <Grid item xs={12} md={6} key={locationId}>
                  <SectorLocationCard
                    sectorLocation={sectorLocations[locationId]}
                    onClick={() => setOpenSectorLocationId(locationId)}
                  />
                </Grid>
              ))}
          </Grid>
        )}
        {openTab === SECTOR_TABS.NOTES && (
          <Grid container spacing={2} sx={{ mt: 0, px: 2, pb: 2 }}>
            {showGMFields && (
              <Grid item xs={12}>
                <RtcRichTextEditor
                  id={sectorId}
                  roomPrefix={`sector-private-${worldId}-`}
                  documentPassword={sectorId}
                  onSave={(sectorId, notes, isBeaconRequest) =>
                    updateNotes(sectorId, notes, true, isBeaconRequest)
                  }
                  initialValue={gmNotes}
                />
              </Grid>
            )}
            {!isSingleplayer && (
              <>
                {showGMTips && (
                  <NotesSectionHeader
                    sharedWithPlayers={sector.sharedWithPlayers}
                  />
                )}
                <Grid item xs={12}>
                  <RtcRichTextEditor
                    id={sectorId}
                    roomPrefix={`sector-public-${worldId}-`}
                    documentPassword={sectorId}
                    onSave={(sectorId, notes, isBeaconRequest) =>
                      updateNotes(sectorId, notes, false, isBeaconRequest)
                    }
                    initialValue={notes}
                  />
                </Grid>
              </>
            )}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
