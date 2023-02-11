import { IconButton, Menu, MenuItem } from "@mui/material";
import { useAuth } from "hooks/useAuth";
import { useState } from "react";
import { StoredCampaign } from "types/Campaign.type";
import MoreIcon from "@mui/icons-material/MoreHoriz";
import { useUpdateCampaignGM } from "api/campaign/updateCampaignGM";
import { useDeleteCampaign } from "api/campaign/deleteCampaign";
import { useConfirm } from "material-ui-confirm";

export interface CampaignActionsMenuProps {
  campaignId: string;
  campaign: StoredCampaign;
}

export function CampaignActionsMenu(props: CampaignActionsMenuProps) {
  const { campaignId, campaign } = props;
  const { gmId } = campaign;
  const uid = useAuth().user?.uid;
  const confirm = useConfirm();

  const [menuParent, setMenuParent] = useState<HTMLElement>();

  const handleMenuClose = () => {
    setMenuParent(undefined);
  };

  const { updateCampaignGM } = useUpdateCampaignGM();
  const removeCurrentGM = () => {
    updateCampaignGM({ campaignId: campaignId, gmId: undefined })
      .then(() => {
        handleMenuClose();
      })
      .catch(() => {});
  };

  const { deleteCampaign } = useDeleteCampaign();
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
      deleteCampaign({ campaignId, characters: campaign.characters })
        .then(() => {
          handleMenuClose();
        })
        .catch();
    });
  };

  if (uid && uid !== gmId) {
    return null;
  }
  return (
    <>
      <IconButton
        color={"inherit"}
        sx={{
          borderWidth: 1,
          borderColor: "inherit",
          borderStyle: "solid",
        }}
        onClick={(evt) => setMenuParent(evt.currentTarget)}
      >
        <MoreIcon />
      </IconButton>
      <Menu anchorEl={menuParent} open={!!menuParent} onClose={handleMenuClose}>
        <MenuItem onClick={() => removeCurrentGM()}>Step Down as GM</MenuItem>
        <MenuItem onClick={() => handleDeleteCampaign()}>End Campaign</MenuItem>
      </Menu>
    </>
  );
}
