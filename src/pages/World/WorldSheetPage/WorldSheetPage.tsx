import { Button, LinearProgress } from "@mui/material";
import { WorldSheet } from "components/WorldSheet";
import { useSnackbar } from "providers/SnackbarProvider/useSnackbar";
import { useConfirm } from "material-ui-confirm";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSyncStore } from "./hooks/useSyncStore";
import { useState } from "react";
import { LocationsSection } from "components/Locations";
import { BreakContainer } from "components/BreakContainer";
import { WORLD_ROUTES, constructWorldPath } from "../routes";
import { PageContent, PageHeader } from "components/Layout";
import { StyledTab, StyledTabs } from "components/StyledTabs";
import DeleteIcon from "@mui/icons-material/Delete";
import { NPCSection } from "components/NPCSection";
import { Head } from "providers/HeadProvider/Head";
import { useStore } from "stores/store";
import { useListenToLocations } from "stores/world/currentWorld/locations/useListenToLocations";
import { useListenToNPCs } from "stores/world/currentWorld/npcs/useListenToNPCs";
import { useListenToLoreDocuments } from "stores/world/currentWorld/lore/useListenToLoreDocuments";
import { LoreSection } from "components/Lore";

export enum TABS {
  DETAILS = "details",
  LOCATIONS = "locations",
  NPCS = "npcs",
  LORE = "lore",
}

export function WorldSheetPage() {
  useSyncStore();
  useListenToLocations();
  useListenToNPCs();
  useListenToLoreDocuments();

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTab, setSelectedTab] = useState<TABS>(
    (searchParams.get("tab") as TABS) ?? TABS.DETAILS
  );
  const handleTabChange = (tab: TABS) => {
    setSelectedTab(tab);
    setSearchParams({ tab });
  };

  const worldId = useStore((store) => store.worlds.currentWorld.currentWorldId);
  const world = useStore((store) => store.worlds.currentWorld.currentWorld);
  const canEdit = useStore(
    (store) =>
      store.worlds.currentWorld.currentWorld?.ownerIds.includes(
        store.auth.uid
      ) ?? false
  );
  const isLoading = useStore((store) => store.worlds.loading);

  const { error } = useSnackbar();
  const confirm = useConfirm();
  const uid = useStore((store) => store.auth.uid);

  const navigate = useNavigate();
  const deleteWorld = useStore((store) => store.worlds.deleteWorld);

  if (isLoading) {
    return <LinearProgress />;
  }

  if (!world || !worldId) {
    return null;
  }

  const handleDeleteClick = () => {
    confirm({
      title: `Delete ${world.name}`,
      description:
        "Are you sure you want to delete this world? It will be deleted from ALL of your characters and campaigns. This cannot be undone.",
      confirmationText: "Delete",
      confirmationButtonProps: {
        variant: "contained",
        color: "error",
      },
    })
      .then(() => {
        deleteWorld(worldId)
          .then(() => {
            navigate(constructWorldPath(WORLD_ROUTES.SELECT));
          })
          .catch(() => {});
      })
      .catch(() => {});
  };

  return (
    <>
      <Head title={world.name} description={`World page for ${world.name}`} />
      <PageHeader
        label={world.name}
        actions={
          <Button
            color={"inherit"}
            variant={"outlined"}
            onClick={() => handleDeleteClick()}
            endIcon={<DeleteIcon />}
          >
            Delete World
          </Button>
        }
      />
      <PageContent isPaper>
        <BreakContainer>
          <StyledTabs
            value={selectedTab}
            onChange={(evt, value) => handleTabChange(value)}
            indicatorColor="secondary"
            centered
            variant={"standard"}
          >
            <StyledTab value={TABS.DETAILS} label={"World Details"} />
            <StyledTab value={TABS.LOCATIONS} label={"Locations"} />
            <StyledTab value={TABS.NPCS} label={"NPCs"} />
            <StyledTab value={TABS.LORE} label={"Lore"} />
          </StyledTabs>
        </BreakContainer>
        {selectedTab === TABS.DETAILS && <WorldSheet canEdit={canEdit} />}
        {selectedTab === TABS.LOCATIONS && (
          <BreakContainer
            sx={(theme) => ({
              backgroundColor: theme.palette.background.default,
              flexGrow: 1,
            })}
          >
            <LocationsSection
              showHiddenTag
              openNPCTab={() => setSelectedTab(TABS.NPCS)}
            />
          </BreakContainer>
        )}
        {selectedTab === TABS.NPCS && (
          <BreakContainer
            sx={(theme) => ({
              backgroundColor: theme.palette.background.default,
              flexGrow: 1,
            })}
          >
            <NPCSection showHiddenTag />
          </BreakContainer>
        )}
        {selectedTab === TABS.LORE && (
          <BreakContainer
            sx={(theme) => ({
              backgroundColor: theme.palette.background.default,
              flexGrow: 1,
            })}
          >
            <LoreSection showHiddenTag />
          </BreakContainer>
        )}
      </PageContent>
    </>
  );
}
