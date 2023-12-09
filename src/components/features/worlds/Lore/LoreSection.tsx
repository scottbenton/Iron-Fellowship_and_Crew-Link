import {
  Box,
  Button,
  Grid,
  Hidden,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import AddLoreIcon from "@mui/icons-material/Book";
import { OpenLore } from "./OpenLore";
import { useFilterLore } from "./useFilterLore";
import { WorldEmptyState } from "components/features/worlds/WorldEmptyState";
import { FilterBar } from "components/features/worlds/FilterBar";
import { LoreItem } from "./LoreItem";
import { useStore } from "stores/store";
import { useState } from "react";

export interface LoreSectionProps {
  isSinglePlayer?: boolean;
  showHiddenTag?: boolean;
}

export function LoreSection(props: LoreSectionProps) {
  const { isSinglePlayer, showHiddenTag } = props;

  const worldId = useStore((store) => store.worlds.currentWorld.currentWorldId);
  const isWorldOwner = useStore(
    (store) =>
      store.worlds.currentWorld.currentWorld?.ownerIds?.includes(
        store.auth.uid
      ) ?? false
  );

  const lore = useStore(
    (store) => store.worlds.currentWorld.currentWorldLore.loreMap
  );
  const openLoreId = useStore(
    (store) => store.worlds.currentWorld.currentWorldLore.openLoreId
  );
  const setOpenLoreId = useStore(
    (store) => store.worlds.currentWorld.currentWorldLore.setOpenLoreId
  );
  const search = useStore(
    (store) => store.worlds.currentWorld.currentWorldLore.loreSearch
  );
  const setSearch = useStore(
    (store) => store.worlds.currentWorld.currentWorldLore.setLoreSearch
  );

  const [createLoreLoading, setCreateLoreLoading] = useState(false);
  const createLore = useStore(
    (store) => store.worlds.currentWorld.currentWorldLore.createLore
  );

  const handleCreateLore = () => {
    setCreateLoreLoading(true);
    createLore()
      .then((loreId) => setOpenLoreId(loreId))
      .catch(() => {})
      .finally(() => {
        setCreateLoreLoading(false);
      });
  };

  const tags = new Set<string>();
  Object.values(lore).forEach((loreItem) => {
    loreItem.tags?.forEach((tag) => tags.add(tag));
  });

  const { filteredLoreIds, sortedLoreIds } = useFilterLore(lore, search);

  if (!worldId) {
    return (
      <WorldEmptyState isMultiplayer={!isSinglePlayer} isGM={isWorldOwner} />
    );
  }

  const openLore = openLoreId && lore[openLoreId];

  if (openLoreId && openLore) {
    return (
      <Box
        display={"flex"}
        alignItems={"stretch"}
        maxHeight={"100%"}
        height={"100%"}
      >
        <Hidden smDown>
          <Box overflow={"auto"} flexGrow={1} minWidth={200} maxWidth={400}>
            <List>
              {sortedLoreIds.map((loreId) => (
                <ListItem key={loreId} disablePadding>
                  <ListItemButton
                    selected={loreId === openLoreId}
                    onClick={() => setOpenLoreId(loreId)}
                  >
                    <ListItemText
                      primary={lore[loreId].name}
                      secondary={
                        !isSinglePlayer &&
                        isWorldOwner &&
                        (!lore[loreId].sharedWithPlayers ? "Hidden" : "Shared")
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Hidden>

        <OpenLore
          worldId={worldId}
          lore={openLore}
          loreId={openLoreId}
          closeLore={() => setOpenLoreId(undefined)}
          tagList={[...tags.values()]}
        />
      </Box>
    );
  }

  return (
    <>
      <FilterBar
        action={
          <Button
            variant={"contained"}
            endIcon={<AddLoreIcon />}
            onClick={handleCreateLore}
            disabled={createLoreLoading}
            sx={{ flexShrink: 0 }}
          >
            Add Lore Doc
          </Button>
        }
        search={search}
        setSearch={setSearch}
        searchPlaceholder={"Search by title or tags"}
      />
      <Grid
        container
        spacing={2}
        sx={{
          p: 2,
        }}
      >
        {filteredLoreIds.map((loreId) => (
          <Grid item xs={12} md={6} lg={4} key={loreId}>
            <LoreItem
              lore={lore[loreId]}
              openLore={() => setOpenLoreId(loreId)}
              showHiddenTag={showHiddenTag}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
