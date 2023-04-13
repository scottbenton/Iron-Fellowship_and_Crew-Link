import { Box, Button, LinearProgress, Typography } from "@mui/material";
import { useUpdateCampaignWorld } from "api/campaign/updateCampaignWorld";
import { useUpdateCharacterWorld } from "api/characters/updateCharacterWorld";
import { useDeleteWorld } from "api/worlds/deleteWorld";
import { PageBanner } from "components/Layout/PageBanner";
import { WorldSheet } from "components/WorldSheet";
import { useSnackbar } from "hooks/useSnackbar";
import { useConfirm } from "material-ui-confirm";
import { useAuth } from "providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import { paths, ROUTES } from "routes";
import { useCampaignStore } from "stores/campaigns.store";
import { useCharacterStore } from "stores/character.store";
import { useWorld } from "./hooks/useWorld";

export function WorldSheetPage() {
  const { worldId, world, canEdit, isLoading } = useWorld();

  const { error } = useSnackbar();
  const confirm = useConfirm();
  const uid = useAuth().user?.uid;

  const navigate = useNavigate();

  const characters = useCharacterStore((store) => store.characters);
  const { updateCharacterWorld } = useUpdateCharacterWorld();
  const campaigns = useCampaignStore((store) => store.campaigns);
  const { updateCampaignWorld } = useUpdateCampaignWorld();

  const { deleteWorld } = useDeleteWorld();

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
                navigate(paths[ROUTES.WORLD_SELECT]);
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
      <PageBanner>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          position={"relative"}
          width={"100%"}
          zIndex={20}
          sx={(theme) => ({
            mt: 5,
            [theme.breakpoints.up("sm")]: {
              mt: 7,
            },
          })}
          color={"white"}
        >
          <Typography
            variant={"h4"}
            fontFamily={(theme) => theme.fontFamilyTitle}
          >
            {world.name}
          </Typography>
          <Button color={"inherit"} onClick={() => handleDeleteClick()}>
            Delete World
          </Button>
        </Box>
      </PageBanner>
      <WorldSheet worldId={worldId} world={world} canEdit={canEdit} />
    </>
  );
}
