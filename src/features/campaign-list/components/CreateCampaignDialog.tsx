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
import { useCampaignStore } from "../../../stores/campaigns.store";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { useNavigate } from "react-router-dom";
import { constructCampaignSheetUrl } from "../../../routes";

export interface CreateCampaignDialogProps {
  open: boolean;
  handleClose: () => void;
}

export function CreateCampaignDialog(props: CreateCampaignDialogProps) {
  const { open, handleClose } = props;
  const { error } = useSnackbar();
  const navigate = useNavigate();

  const createCampaign = useCampaignStore((store) => store.createCampaign);

  const [loading, setLoading] = useState<boolean>(false);
  const [label, setLabel] = useState<string>("");

  const handleCreate = () => {
    setLoading(true);
    createCampaign(label)
      .then((campaignId) => {
        setLoading(false);
        navigate(constructCampaignSheetUrl(campaignId));
        // navigate to handle create
      })
      .catch(() => {
        error("Error creating campaign.");
        handleClose();
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
        <Button disabled={loading} onClick={() => handleClose()}>
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
