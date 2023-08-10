import { Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { StoredCampaign } from "types/Campaign.type";
import MoreIcon from "@mui/icons-material/MoreHoriz";
import { useConfirm } from "material-ui-confirm";
import { useNavigate } from "react-router-dom";
import { CAMPAIGN_ROUTES, constructCampaignPath } from "pages/Campaign/routes";
import { useStore } from "stores/store";

export interface CampaignActionsMenuProps {
  campaignId: string;
  campaign: StoredCampaign;
}

export function CampaignActionsMenu(props: CampaignActionsMenuProps) {
  const { campaignId, campaign } = props;
  const { gmIds } = campaign;

  const uid = useStore((store) => store.auth.uid);

  const confirm = useConfirm();
  const navigate = useNavigate();

  const [menuParent, setMenuParent] = useState<HTMLElement>();

  const handleMenuClose = () => {
    setMenuParent(undefined);
  };

  const updateCampaignGM = useStore(
    (store) => store.campaigns.currentCampaign.updateCampaignGM
  );

  const removeCurrentGM = () => {
    updateCampaignGM(uid, true)
      .then(() => {
        handleMenuClose();
      })
      .catch(() => {});
  };

  const deleteCampaign = useStore(
    (store) => store.campaigns.currentCampaign.deleteCampaign
  );
  const handleDeleteCampaign = () => {
    confirm({
      title: "End Campaign",
      description:
        "Are you sure you want to end your campaign? This will also remove your current characters from the campaign",
      confirmationText: "End",
      confirmationButtonProps: {
        variant: "contained",
        color: "error",
      },
    }).then(() => {
      deleteCampaign()
        .then(() => {
          handleMenuClose();
        })
        .catch(() => {});
    });
  };

  const leaveCampaign = useStore(
    (store) => store.campaigns.currentCampaign.leaveCampaign
  );
  const handleLeaveCampaign = () => {
    confirm({
      title: "Leave Campaign",
      description: "Are you sure you want to leave this campaign?",
      confirmationText: "Leave",
      confirmationButtonProps: {
        variant: "contained",
        color: "error",
      },
    })
      .then(() => {
        leaveCampaign()
          .then(() => {
            handleMenuClose();
            navigate(constructCampaignPath(CAMPAIGN_ROUTES.SELECT));
          })
          .catch(() => {});
      })
      .catch(() => {});
  };

  const isGm = !!uid && (gmIds?.includes(uid) ?? false);

  return (
    <>
      <Button
        color={"inherit"}
        endIcon={<MoreIcon />}
        onClick={(evt) => setMenuParent(evt.currentTarget)}
      >
        More
      </Button>
      <Menu anchorEl={menuParent} open={!!menuParent} onClose={handleMenuClose}>
        {isGm && (
          <MenuItem onClick={() => removeCurrentGM()}>Step Down as GM</MenuItem>
        )}
        {campaign.users.length > 1 && (
          <MenuItem onClick={() => handleLeaveCampaign()}>
            Leave Campaign
          </MenuItem>
        )}
        {isGm && (
          <MenuItem onClick={() => handleDeleteCampaign()}>
            End Campaign
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
