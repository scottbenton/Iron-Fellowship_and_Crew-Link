import {
  Box,
  Button,
  Divider,
  Grid,
  LinearProgress,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { CharacterList } from "../../components/CharacterList/CharacterList";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { PageBanner } from "../../components/Layout/PageBanner";
import { supplyTrack } from "../../data/defaultTracks";
import { useAuth } from "../../hooks/useAuth";
import { useSnackbar } from "../../hooks/useSnackbar";
import {
  constructCampaignJoinUrl,
  constructCharacterSheetUrl,
  paths,
  ROUTES,
} from "../../routes";
import { useCampaignStore } from "../../stores/campaigns.store";
import { Track } from "../character-sheet/components/Track";
import { AddCharacterDialog } from "./components/AddCharacterDialog";
import { CampaignProgressTracks } from "./components/CampaignProgressTracks";
import { useCampaignCharacters } from "./hooks/useCampaignCharacters";

export function CampaignSheetPage() {
  const { campaignId } = useParams();
  const uid = useAuth().user?.uid;

  const { error, success } = useSnackbar();
  const navigate = useNavigate();

  const campaigns = useCampaignStore((store) => store.campaigns);
  const loading = useCampaignStore((store) => store.loading);
  const removeCharacter = useCampaignStore(
    (store) => store.removeCharacterFromCampaign
  );

  const [addCharacterDialogOpen, setAddCharacterDialogOpen] =
    useState<boolean>(false);
  const updateCampaignSupply = useCampaignStore(
    (store) => store.updateCampaignSupply
  );

  const campaignCharacters = useCampaignCharacters(campaignId);

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
      <PageBanner>{campaign.name}</PageBanner>
      <Box
        mt={3}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Typography
          variant={"h6"}
          fontFamily={(theme) => theme.fontFamilyTitle}
          color={(theme) => theme.palette.primary.light}
        >
          Characters
        </Typography>
        <div>
          <Button variant={"outlined"} onClick={() => copyLinkToClipboard()}>
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
      </Box>
      <Divider sx={{ mt: 1, mb: 3 }} />
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
                onClick={() => removeCharacter(campaignId, characterId, uid)}
              >
                Remove from Campaign
              </Button>
            </>
          ) : (
            <></>
          )
        }
      />
      <Box mt={4}>
        <Typography
          variant={"h6"}
          fontFamily={(theme) => theme.fontFamilyTitle}
          color={(theme) => theme.palette.primary.light}
        >
          Shared Tracks
        </Typography>
        <Divider sx={{ mt: 1 }} />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={3} sx={{ mt: 2 }}>
          <Track
            label={"Supply"}
            min={supplyTrack.min}
            max={supplyTrack.max}
            value={campaign.supply}
            onChange={(newValue) => updateCampaignSupply(campaignId, newValue)}
          />
        </Grid>
        <Grid item xs={0} sm={6} md={8} lg={9} />

        <CampaignProgressTracks campaignId={campaignId} />
      </Grid>
      <AddCharacterDialog
        open={addCharacterDialogOpen}
        handleClose={() => setAddCharacterDialogOpen(false)}
        campaignId={campaignId}
      />
    </>
  );
}
