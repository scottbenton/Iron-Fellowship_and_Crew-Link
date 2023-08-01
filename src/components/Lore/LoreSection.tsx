import {
  Box,
  Button,
  Grid,
  Hidden,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import AddLoreIcon from "@mui/icons-material/Book";
import { OpenLore } from "./OpenLore";
import { WorldStoreProperties } from "stores/world.slice";
import { useFilterLore } from "./useFilterLore";
import { useAuth } from "providers/AuthProvider";
import { WorldEmptyState } from "components/WorldEmptyState";
import { useCreateLore } from "api/worlds/lore/createLore";
import { FilterBar } from "components/FilterBar";
import { LoreItem } from "./LoreItem";
import { useCanUploadWorldImages } from "hooks/featureFlags/useCanUploadWorldImages";
import { StoreApi, UseBoundStore } from "zustand";

export interface LoreSectionProps {
  worldOwnerId?: string;
  worldId?: string;
  isSinglePlayer?: boolean;
  showHiddenTag?: boolean;
  useStore: UseBoundStore<StoreApi<WorldStoreProperties>>;
}

export function LoreSection(props: LoreSectionProps) {
  const { worldOwnerId, worldId, isSinglePlayer, showHiddenTag, useStore } =
    props;

  const isWorldOwner = useAuth().user?.uid === worldOwnerId;

  const {
    lore,
    openLoreId,
    setOpenLoreId,
    doAnyDocsHaveImages,
    search,
    setSearch,
  } = useStore((store) => ({
    lore: store.lore,
    openLoreId: store.openLoreId,
    setOpenLoreId: store.setOpenLoreId,
    doAnyDocsHaveImages: store.doAnyDocsHaveImages,
    search: store.loreSearch,
    setSearch: store.setLoreSearch,
  }));

  const userCanUploadImages = useCanUploadWorldImages() ?? false;
  const canShowImages = doAnyDocsHaveImages || userCanUploadImages;

  const { createLore, loading: createLoreLoading } = useCreateLore();

  const tags = new Set<string>();
  Object.values(lore).forEach((loreItem) => {
    loreItem.tags?.forEach((tag) => tags.add(tag));
  });

  const { filteredLoreIds, sortedLoreIds } = useFilterLore(lore, search);

  if (!worldId || !worldOwnerId) {
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
                <ListItemButton
                  key={loreId}
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
              ))}
            </List>
          </Box>
        </Hidden>

        <OpenLore
          worldId={worldId}
          worldOwnerId={worldOwnerId}
          lore={openLore}
          loreId={openLoreId}
          closeLore={() => setOpenLoreId(undefined)}
          isWorldOwnerPremium={canShowImages}
          isSinglePlayer={isSinglePlayer}
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
            onClick={() =>
              createLore(worldId)
                .catch(() => {})
                .then((loreId) => {
                  if (loreId) {
                    setOpenLoreId(loreId);
                  }
                })
            }
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
              canUseImages={canShowImages}
              showHiddenTag={showHiddenTag}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
