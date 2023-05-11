import { Button, Dialog, DialogContent, Typography } from "@mui/material";
import { useUpdateCampaignGM } from "api/campaign/updateCampaignGM";
import { useUserDoc } from "api/user/getUserDoc";
import { useAuth } from "providers/AuthProvider";
import { Link } from "react-router-dom";
import { StoredCampaign } from "types/Campaign.type";
import { CampaignActionsMenu } from "./CampaignActionsMenu";
import { PageHeader } from "components/Layout";
import {
  CAMPAIGN_ROUTES,
  constructCampaignSheetPath,
} from "pages/Campaign/routes";
import { useMemo, useState } from "react";
import { DialogTitleWithCloseButton } from "components/DialogTitleWithCloseButton";
import { useSnackbar } from "hooks/useSnackbar";

export interface CampaignSheetHeaderProps {
  campaign: StoredCampaign;
  campaignId: string;
}

export function CampaignSheetHeader(props: CampaignSheetHeaderProps) {
  const { campaign, campaignId } = props;

  const uid = useAuth().user?.uid;

  const { updateCampaignGM } = useUpdateCampaignGM();
  const { user: gm } = useUserDoc(campaign.gmId);

  const [inviteUsersDialogOpen, setInviteUsersDialogOpen] =
    useState<boolean>(false);

  const { success } = useSnackbar();

  const joinLink = useMemo(() => {
    return (
      window.location.origin +
      constructCampaignSheetPath(campaignId, CAMPAIGN_ROUTES.JOIN)
    );
  }, [campaignId]);

  const copyLinkToClipboard = () => {
    navigator.clipboard
      .writeText(joinLink)
      .then(() => {
        success("Copied Link to Clipboard");
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <>
      <PageHeader
        label={campaign.name}
        subLabel={gm ? `GM: ${gm.displayName}` : ""}
        actions={
          <>
            <Button
              color={"secondary"}
              variant={"contained"}
              onClick={() => setInviteUsersDialogOpen(true)}
            >
              Invite your Group
            </Button>
            {!campaign.gmId && (
              <Button
                onClick={() => updateCampaignGM({ campaignId, gmId: uid })}
                variant={"outlined"}
                color={"inherit"}
              >
                Mark self as GM
              </Button>
            )}
            {campaign.gmId && campaign.gmId === uid && (
              <Button
                component={Link}
                to={constructCampaignSheetPath(
                  campaignId,
                  CAMPAIGN_ROUTES.GM_SCREEN
                )}
                variant={"outlined"}
                color={"inherit"}
              >
                Open GM Screen
              </Button>
            )}
            <CampaignActionsMenu campaign={campaign} campaignId={campaignId} />
          </>
        }
      />
      <Dialog
        open={inviteUsersDialogOpen}
        onClose={() => setInviteUsersDialogOpen(false)}
      >
        <DialogTitleWithCloseButton
          onClose={() => setInviteUsersDialogOpen(false)}
        >
          Invite your Group
        </DialogTitleWithCloseButton>
        <DialogContent>
          <Typography>
            Other players can use the following link to join this campaign.
          </Typography>
          <Typography
            sx={(theme) => ({
              backgroundColor: theme.palette.grey[700],
              color: theme.palette.grey[200],
              px: 1,
              py: 0.25,
              borderRadius: theme.shape.borderRadius,
              my: 2,
            })}
          >
            {joinLink}
          </Typography>
          <Button onClick={() => copyLinkToClipboard()} variant={"contained"}>
            Copy Link
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
