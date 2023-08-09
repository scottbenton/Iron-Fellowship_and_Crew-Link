import {
  Box,
  Button,
  LinearProgress,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useUpdateCampaignWorld } from "api/campaign/updateCampaignWorld";
import { useUpdateCharacterWorld } from "api/characters/updateCharacterWorld";
import { WorldSheet } from "components/WorldSheet";
import { useSnackbar } from "providers/SnackbarProvider/useSnackbar";
import { useConfirm } from "material-ui-confirm";
import { useAuth } from "providers/AuthProvider";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCampaignStore } from "stores/campaigns.store";
import { useCharacterStore } from "stores/character.store";
import { useSyncStore } from "./hooks/useSyncStore";
import { useEffect, useState } from "react";
import { LocationsSection } from "components/Locations";
import { BreakContainer } from "components/BreakContainer";
import { WORLD_ROUTES, constructWorldPath } from "../routes";
import { PageContent, PageHeader } from "components/Layout";
import { StyledTab, StyledTabs } from "components/StyledTabs";
import DeleteIcon from "@mui/icons-material/Delete";
import { NPCSection } from "components/NPCSection";
import { useWorldSheetStore } from "./worldSheet.store";
import { LoreSection } from "components/Lore";
import { Head } from "providers/HeadProvider/Head";
import { useStore } from "stores/store";
import { useListenToLocations } from "stores/world/useListenToLocations";

export enum TABS {
  DETAILS = "details",
  LOCATIONS = "locations",
  NPCS = "npcs",
  LORE = "lore",
}

export function WorldSheetPage() {
  useSyncStore();
  useListenToLocations();

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
  const uid = useAuth().user?.uid;

  const navigate = useNavigate();

  const characters = useCharacterStore((store) => store.characters);
  const { updateCharacterWorld } = useUpdateCharacterWorld();
  const campaigns = useCampaignStore((store) => store.campaigns);
  const { updateCampaignWorld } = useUpdateCampaignWorld();

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
        let promises: Promise<boolean>[] = [];
        Object.keys(characters).forEach((characterId) => {
          if (characters[characterId].worldId === worldId) {
            promises.push(updateCharacterWorld({ uid, characterId }));
          }
        });
        Object.keys(campaigns).forEach((campaignId) => {
          if (campaigns[campaignId].worldId === worldId) {
            promises.push(updateCampaignWorld(campaignId, undefined));
          }
        });

        Promise.all(promises)
          .then(() => {
            deleteWorld(worldId)
              .then(() => {
                navigate(constructWorldPath(WORLD_ROUTES.SELECT));
              })
              .catch((e) => {
                error("Failed to delete world");
              });
          })
          .catch((e) => {
            error("Failed to remove world from campaigns and characters.");
          });
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
        {selectedTab === TABS.DETAILS && (
          <WorldSheet worldId={worldId} world={world} canEdit={canEdit} />
        )}
        {selectedTab === TABS.LOCATIONS && (
          <BreakContainer
            sx={(theme) => ({
              backgroundColor: theme.palette.background.default,
              flexGrow: 1,
            })}
          >
            <LocationsSection showHiddenTag />
          </BreakContainer>
        )}
        {selectedTab === TABS.NPCS && (
          <BreakContainer
            sx={(theme) => ({
              backgroundColor: theme.palette.background.default,
              flexGrow: 1,
            })}
          >
            <NPCSection
              worldOwnerId={""}
              worldId={worldId}
              showHiddenTag
              useStore={useWorldSheetStore}
            />
          </BreakContainer>
        )}
        {selectedTab === TABS.LORE && (
          <BreakContainer
            sx={(theme) => ({
              backgroundColor: theme.palette.background.default,
              flexGrow: 1,
            })}
          >
            <LoreSection
              worldOwnerId={""}
              worldId={worldId}
              showHiddenTag
              useStore={useWorldSheetStore}
            />
          </BreakContainer>
        )}
      </PageContent>
    </>
  );
}
