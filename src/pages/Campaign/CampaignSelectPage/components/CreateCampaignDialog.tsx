import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate } from "react-router-dom";
import { CAMPAIGN_ROUTES, constructCampaignSheetPath } from "../../routes";
import { useStore } from "stores/store";
import { CampaignType } from "api-calls/campaign/_campaign.type";
import { CampaignTypeChooser } from "components/features/campaigns/CampaignTypeChooser";

export interface CreateCampaignDialogProps {
  open: boolean;
  handleClose: () => void;
}

export function CreateCampaignDialog(props: CreateCampaignDialogProps) {
  const { open, handleClose } = props;
  const navigate = useNavigate();

  const createCampaign = useStore((store) => store.campaigns.createCampaign);
  const [loading, setLoading] = useState(false);
  const [label, setLabel] = useState<string>("");
  const [type, setType] = useState<CampaignType>(CampaignType.Guided);

  const handleCreate = () => {
    setLoading(true);
    createCampaign(label, type)
      .then((campaignId) => {
        navigate(constructCampaignSheetPath(campaignId, CAMPAIGN_ROUTES.SHEET));
      })
      .catch(() => {
        handleClose();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Dialog open={open} onClose={() => handleClose} maxWidth={"sm"} fullWidth>
      <DialogTitle>Create a Campaign</DialogTitle>
      <DialogContent>
        <TextField
          label={"Campaign Name"}
          value={label}
          onChange={(evt) => setLabel(evt.target.value)}
          sx={{ mt: 1 }}
        />
        <Typography
          variant={"subtitle1"}
          component={"p"}
          display={"block"}
          sx={{ mt: 2, mb: 1 }}
        >
          Campaign Type
        </Typography>
        <CampaignTypeChooser type={type} onChange={setType} />
      </DialogContent>
      <DialogActions>
        <Button
          color={"inherit"}
          disabled={loading}
          onClick={() => handleClose()}
        >
          Cancel
        </Button>
        <LoadingButton
          endIcon={<SaveIcon />}
          loading={loading}
          loadingPosition={"end"}
          variant={"contained"}
          onClick={() => handleCreate()}
        >
          Create
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
