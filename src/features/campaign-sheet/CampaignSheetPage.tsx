import { Box, Button, LinearProgress, Typography } from "@mui/material";
import { useUpdateCampaignGM } from "api/campaign/updateCampaignGM";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useRemoveCharacterFromCampaign } from "../../api/campaign/removeCharacterFromCampaign";
import { useUpdateCampaignSupply } from "../../api/campaign/updateCampaignSupply";
import { useListenToCampaignCharacters } from "../../api/characters/listenToCampaignCharacters";
import { CharacterList } from "../../components/CharacterList/CharacterList";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { PageBanner } from "../../components/Layout/PageBanner";
import { SectionHeading } from "../../components/SectionHeading";
import { supplyTrack } from "../../data/defaultTracks";
import { useAuth } from "../../hooks/useAuth";
import { useSnackbar } from "../../hooks/useSnackbar";
import {
  constructCampaignGMScreenUrl,
  constructCampaignJoinUrl,
  constructCharacterSheetUrl,
  paths,
  ROUTES,
} from "../../routes";
import { useCampaignStore } from "../../stores/campaigns.store";
import { Track } from "../../components/Track";
import { AddCharacterDialog } from "./components/AddCharacterDialog";
import { CampaignProgressTracks } from "./components/CampaignProgressTracks";
import { useUserDoc } from "api/user/getUserDoc";
import { CampaignActionsMenu } from "./components/CampaignActionsMenu";
import { AddCustomMoveDialog } from "./components/AddCustomMoveDialog";
import CampaignCustomMovesList from "./components/CampaignCustomMovesList";

export function CampaignSheetPage() {
  const { campaignId } = useParams();
  const uid = useAuth().user?.uid;

  const { error, success } = useSnackbar();
  const navigate = useNavigate();

  const campaigns = useCampaignStore((store) => store.campaigns);
  const loading = useCampaignStore((store) => store.loading);

  const { removeCharacterFromCampaign } = useRemoveCharacterFromCampaign();

  const [addCharacterDialogOpen, setAddCharacterDialogOpen] =
    useState<boolean>(false);

  const [addCustomMoveDialogOpen, setAddCustomMoveDialogOpen] =
    useState<boolean>(false);

  const { updateCampaignSupply } = useUpdateCampaignSupply();

  const campaignCharacters = useListenToCampaignCharacters(campaignId);

  const { updateCampaignGM } = useUpdateCampaignGM();

  const { user: gm } = useUserDoc(campaigns[campaignId ?? ""]?.gmId);

  useEffect(() => {
    if (!loading && (!campaignId || !campaigns[campaignId])) {
      error("You aren't a member of this campaign");
      navigate(paths[ROUTES.CAMPAIGN_SELECT]);
    }
  }, [loading, campaigns, campaignId]);

  if (loading) {
    return (
      <LinearProgress
        sx={{ width: "100vw", position: "absolute", left: 0, marginTop: -3 }}
      />
    );
  }

  if (!campaignId || !campaigns[campaignId]) {
    return null;
  }

  const campaign = campaigns[campaignId];

  const copyLinkToClipboard = () => {
    navigator.clipboard
      .writeText(window.location.origin + constructCampaignJoinUrl(campaignId))
      .then(() => {
        success("Copied Link to Clipboard");
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <>
      <PageBanner>
        <Box
          zIndex={20}
          color={"white"}
          display={"flex"}
          flexWrap={"wrap"}
          width={"100%"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Box>
            <Typography
              variant={"h4"}
              fontFamily={(theme) => theme.fontFamilyTitle}
            >
              {campaign.name}
            </Typography>

            {!campaign.gmId && (
              <Button
                onClick={() => updateCampaignGM({ campaignId, gmId: uid })}
                variant={"outlined"}
                color={"inherit"}
                sx={{ mt: 2 }}
              >
                Mark self as GM
              </Button>
            )}
            {campaign.gmId && campaign.gmId !== uid && (
              <Typography
                variant={"h6"}
                fontFamily={(theme) => theme.fontFamilyTitle}
              >
                GM: {gm?.displayName ?? "Loading..."}
              </Typography>
            )}
            {campaign.gmId && campaign.gmId === uid && (
              <Button
                component={Link}
                to={constructCampaignGMScreenUrl(campaignId)}
                variant={"outlined"}
                color={"inherit"}
                sx={{ mt: 2 }}
              >
                Open GM Screen
              </Button>
            )}
          </Box>
          <CampaignActionsMenu campaign={campaign} campaignId={campaignId} />
        </Box>
      </PageBanner>

      <SectionHeading
        label={"Characters"}
        action={
          <div>
            <Button onClick={() => copyLinkToClipboard()}>
              Copy Invite Link
            </Button>
            <Button
              variant={"contained"}
              sx={{ ml: 1 }}
              onClick={() => setAddCharacterDialogOpen(true)}
            >
              Add a Character
            </Button>
          </div>
        }
        breakContainer
        sx={{ mb: 3 }}
      />
      {campaign.characters.length === 0 && (
        <EmptyState
          imageSrc="/assets/nature.svg"
          title={"No Characters"}
          message={"Add a character to the campaign to get started"}
          callToAction={
            <Button
              variant={"contained"}
              onClick={() => setAddCharacterDialogOpen(true)}
            >
              Add a Character
            </Button>
          }
        />
      )}
      <CharacterList
        characters={campaignCharacters}
        actions={(characterId, index) =>
          campaign.characters[index]?.uid === uid ? (
            <>
              <Button
                component={Link}
                to={constructCharacterSheetUrl(characterId)}
              >
                View
              </Button>
              <Button
                color={"error"}
                onClick={() =>
                  removeCharacterFromCampaign({ campaignId, characterId })
                }
              >
                Remove from Campaign
              </Button>
            </>
          ) : (
            <></>
          )
        }
      />
      <SectionHeading label={"Supply Track"} sx={{ mt: 4 }} breakContainer />
      <Track
        sx={{ mt: 4, mb: 4, maxWidth: 400 }}
        min={supplyTrack.min}
        max={supplyTrack.max}
        value={campaign.supply}
        onChange={(newValue) =>
          updateCampaignSupply({ campaignId, supply: newValue })
        }
      />
      <CampaignProgressTracks campaignId={campaignId} />
      <AddCharacterDialog
        open={addCharacterDialogOpen}
        handleClose={() => setAddCharacterDialogOpen(false)}
        campaignId={campaignId}
      />

      <SectionHeading
        label={"Custom Moves"}
        sx={{ mt: 4 }}
        breakContainer
        action={
          <Button onClick={() => setAddCustomMoveDialogOpen(true)}>
            Add Custom Move
          </Button>
        }
      />
      <AddCustomMoveDialog
        open={addCustomMoveDialogOpen}
        setClose={() => setAddCustomMoveDialogOpen(false)}
        campaignId={campaignId}
      />
      <CampaignCustomMovesList campaignId={campaignId} />
    </>
  );
}
