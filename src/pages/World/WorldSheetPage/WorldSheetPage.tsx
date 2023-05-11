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
import { PageBanner } from "components/Layout/PageBanner";
import { WorldSheet } from "components/WorldSheet";
import { useSnackbar } from "hooks/useSnackbar";
import { useConfirm } from "material-ui-confirm";
import { useAuth } from "providers/AuthProvider";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCampaignStore } from "stores/campaigns.store";
import { useCharacterStore } from "stores/character.store";
import { useWorld } from "./hooks/useWorld";
import { useState } from "react";
import { LocationsSection } from "components/Locations";
import { useListenToLocations } from "api/worlds/locations/listenToLocations";
import { BreakContainer } from "components/BreakContainer";
import { WORLD_ROUTES, constructWorldPath } from "../routes";
import { PageContent, PageHeader } from "components/Layout";
import { StyledTab, StyledTabs } from "components/StyledTabs";
import DeleteIcon from "@mui/icons-material/Delete";

export enum TABS {
  DETAILS = "details",
  LOCATIONS = "locations",
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

  const { locations } = useListenToLocations(worldOwnerId, worldId);
  const [openLocationId, setOpenLocationId] = useState<string>();

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
          </StyledTabs>
        </BreakContainer>
        {selectedTab === TABS.DETAILS && (
          <WorldSheet worldId={worldId} world={world} canEdit={canEdit} />
        )}
        {selectedTab === TABS.LOCATIONS && (
          <BreakContainer>
            <LocationsSection
              locations={locations}
              openLocationId={openLocationId}
              setOpenLocationId={setOpenLocationId}
              worldOwnerId={worldOwnerId}
              worldId={worldId}
              emphasizeButton
              showHiddenTag
            />
          </BreakContainer>
        )}
      </PageContent>
    </>
  );
}
