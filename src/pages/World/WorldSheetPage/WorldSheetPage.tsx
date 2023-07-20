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
import { useDeleteWorld } from "api/worlds/deleteWorld";
import { WorldSheet } from "components/WorldSheet";
import { useSnackbar } from "hooks/useSnackbar";
import { useConfirm } from "material-ui-confirm";
import { useAuth } from "providers/AuthProvider";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCampaignStore } from "stores/campaigns.store";
import { useCharacterStore } from "stores/character.store";
import { useWorld } from "./hooks/useWorld";
import { useEffect, useState } from "react";
import { LocationsSection } from "components/Locations";
import { useWorldSheetListenToLocations } from "api/worlds/locations/listenToLocations";
import { BreakContainer } from "components/BreakContainer";
import { WORLD_ROUTES, constructWorldPath } from "../routes";
import { PageContent, PageHeader } from "components/Layout";
import { StyledTab, StyledTabs } from "components/StyledTabs";
import DeleteIcon from "@mui/icons-material/Delete";
import { NPCSection } from "components/NPCSection";
import { useWorldSheetStore } from "./worldSheet.store";
import { useWorldSheetListenToNPCs } from "api/worlds/npcs/listenToNPCs";
import { useWorldSheetListenToLore } from "api/worlds/lore/listenToLore";
import { LoreSection } from "components/Lore";
import { Head } from "providers/HeadProvider/Head";

export enum TABS {
  DETAILS = "details",
  LOCATIONS = "locations",
  NPCS = "npcs",
  LORE = "lore",
}

export function WorldSheetPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTab, setSelectedTab] = useState<TABS>(
    (searchParams.get("tab") as TABS) ?? TABS.DETAILS
  );
  const handleTabChange = (tab: TABS) => {
    setSelectedTab(tab);
    setSearchParams({ tab });
  };
  const { worldOwnerId, worldId, world, canEdit, isLoading } = useWorld();

  const { error } = useSnackbar();
  const confirm = useConfirm();
  const uid = useAuth().user?.uid;

  const navigate = useNavigate();

  const characters = useCharacterStore((store) => store.characters);
  const { updateCharacterWorld } = useUpdateCharacterWorld();
  const campaigns = useCampaignStore((store) => store.campaigns);
  const { updateCampaignWorld } = useUpdateCampaignWorld();

  const { deleteWorld } = useDeleteWorld();

  const doAnyDocsHaveImages = useWorldSheetStore(
    (store) => store.doAnyDocsHaveImages
  );

  useWorldSheetListenToLocations(worldOwnerId, worldId);
  const locations = useWorldSheetStore((store) => store.locations);
  const openLocationId = useWorldSheetStore((store) => store.openLocationId);
  const setOpenLocationId = useWorldSheetStore(
    (store) => store.setOpenLocationId
  );

  useWorldSheetListenToNPCs(worldOwnerId, worldId);
  const npcs = useWorldSheetStore((store) => store.npcs);
  const openNPCId = useWorldSheetStore((store) => store.openNPCId);
  const setOpenNPCId = useWorldSheetStore((store) => store.setOpenNPCId);

  useWorldSheetListenToLore(worldOwnerId, worldId);
  const lore = useWorldSheetStore((store) => store.lore);
  const openLoreId = useWorldSheetStore((store) => store.openLoreId);
  const setOpenLoreId = useWorldSheetStore((store) => store.setOpenLoreId);

  const resetState = useWorldSheetStore((store) => store.resetState);

  useEffect(() => {
    return () => {
      resetState();
    };
  }, []);

  if (isLoading) {
    return <LinearProgress />;
  }

  if (!world || !worldId || !worldOwnerId) {
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
          if (
            campaigns[campaignId].worldId === worldId &&
            campaigns[campaignId].gmId === uid
          ) {
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
            <LocationsSection
              doAnyDocsHaveImages={doAnyDocsHaveImages}
              locations={locations}
              openLocationId={openLocationId}
              setOpenLocationId={setOpenLocationId}
              worldOwnerId={worldOwnerId}
              worldId={worldId}
              showHiddenTag
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
            <NPCSection
              doAnyDocsHaveImages={doAnyDocsHaveImages}
              worldOwnerId={worldOwnerId}
              worldId={worldId}
              locations={locations}
              npcs={npcs}
              openNPCId={openNPCId}
              setOpenNPCId={setOpenNPCId}
              showHiddenTag
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
              doAnyDocsHaveImages={doAnyDocsHaveImages}
              worldOwnerId={worldOwnerId}
              worldId={worldId}
              lore={lore}
              openLoreId={openLoreId}
              setOpenLoreId={setOpenLoreId}
              showHiddenTag
            />
          </BreakContainer>
        )}
      </PageContent>
    </>
  );
}
