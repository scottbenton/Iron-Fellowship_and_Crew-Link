import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { SectorMap } from "./SectorMap";
import { DebouncedOracleInput } from "components/shared/DebouncedOracleInput";
import { useStore } from "stores/store";
import CloseIcon from "@mui/icons-material/Close";
import { ItemHeader } from "../ItemHeader";
import { useState } from "react";
import { SECTOR_TABS } from "stores/world/currentWorld/sector/sector.slice.type";
import { REGIONS } from "types/Sector.type";
import { SectorRegionAutocomplete } from "./SectorRegionAutocomplete";

interface OpenSectorProps {
  sectorId: string;
}

export function OpenSector(props: OpenSectorProps) {
  const { sectorId } = props;

  const sector = useStore(
    (store) => store.worlds.currentWorld.currentWorldSectors.sectors[sectorId]
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

  return (
    <Box>
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
      <SectorMap map={sector.map} />
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
        </Grid>
        <Tabs
          value={openTab}
          onChange={(evt, value) => setOpenTab(value)}
          sx={{ px: 2, mt: 2 }}
        >
          <Tab label={"Locations"} value={SECTOR_TABS.LOCATIONS} />
          <Tab label={"Notes"} value={SECTOR_TABS.NOTES} />
        </Tabs>
      </Box>
    </Box>
  );
}
