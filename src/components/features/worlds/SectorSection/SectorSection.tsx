import {
  Box,
  Button,
  Card,
  CardActionArea,
  Grid,
  Typography,
} from "@mui/material";
import { useStore } from "stores/store";
import { WorldEmptyState } from "../WorldEmptyState";
import { FilterBar } from "../FilterBar";
import { useFilterSectors } from "./useFilterSectors";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { OpenSector } from "./OpenSector";
import HiddenIcon from "@mui/icons-material/VisibilityOff";

export interface SectorSectionProps {
  isSinglePlayer?: boolean;
  showHiddenTag?: boolean;
  openNPCTab: () => void;
}

export function SectorSection(props: SectorSectionProps) {
  const { isSinglePlayer, showHiddenTag, openNPCTab } = props;

  const worldId = useStore((store) => store.worlds.currentWorld.currentWorldId);
  const isWorldOwner = useStore(
    (store) =>
      store.worlds.currentWorld.currentWorld?.ownerIds?.includes(
        store.auth.uid
      ) ?? false
  );

  const sectors = useStore(
    (store) => store.worlds.currentWorld.currentWorldSectors.sectors
  );

  const search = useStore(
    (store) => store.worlds.currentWorld.currentWorldSectors.sectorSearch
  );
  const setSearch = useStore(
    (store) => store.worlds.currentWorld.currentWorldSectors.setSectorSearch
  );

  const { filteredSectorIds } = useFilterSectors(sectors, search);

  const createSector = useStore(
    (store) => store.worlds.currentWorld.currentWorldSectors.createSector
  );
  const openSectorId = useStore(
    (store) => store.worlds.currentWorld.currentWorldSectors.openSectorId
  );
  const setOpenSectorId = useStore(
    (store) => store.worlds.currentWorld.currentWorldSectors.setOpenSectorId
  );

  const [createSectorLoading, setCreateSectorLoading] = useState(false);
  const handleCreateSector = () => {
    setCreateSectorLoading(true);
    createSector()
      .catch(() => {})
      .finally(() => {
        setCreateSectorLoading(false);
      });
  };
  if (!worldId) {
    return (
      <WorldEmptyState isMultiplayer={!isSinglePlayer} isGM={isWorldOwner} />
    );
  }

  if (openSectorId) {
    return <OpenSector sectorId={openSectorId} openNPCTab={openNPCTab} />;
  }

  return (
    <Box>
      <FilterBar
        search={search}
        searchPlaceholder={"Filter by Sector Name"}
        setSearch={setSearch}
        action={
          <Button
            variant={"contained"}
            disabled={createSectorLoading}
            sx={{ flexShrink: 0 }}
            endIcon={<AddIcon />}
            onClick={handleCreateSector}
          >
            New Sector
          </Button>
        }
      />
      <Grid container spacing={2} sx={{ p: 2 }}>
        {filteredSectorIds.map((sectorId) => (
          <Grid item xs={12} md={6} lg={4} key={sectorId}>
            <Card variant={"outlined"} sx={{ height: "100%" }}>
              <CardActionArea
                onClick={() => setOpenSectorId(sectorId)}
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  height: "100%",
                }}
              >
                <Box>
                  <Typography>{sectors[sectorId].name}</Typography>
                  <Typography color={"textSecondary"}>
                    {sectors[sectorId].region}
                  </Typography>
                </Box>
                {!sectors[sectorId].sharedWithPlayers && showHiddenTag && (
                  <HiddenIcon color={"action"} />
                )}
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
