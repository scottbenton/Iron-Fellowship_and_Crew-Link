import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate } from "react-router-dom";
import { CAMPAIGN_ROUTES, constructCampaignSheetPath } from "../../routes";
import { useStore } from "stores/store";

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

  const handleCreate = () => {
    setLoading(true);
    createCampaign(label)
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
    <Dialog open={open} onClose={() => handleClose}>
      <DialogTitle>Create a Campaign</DialogTitle>
      <DialogContent>
        <TextField
          label={"Campaign Name"}
          value={label}
          onChange={(evt) => setLabel(evt.target.value)}
          sx={{ mt: 1 }}
        />
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
