import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
} from "@mui/material";
import { DialogTitleWithCloseButton } from "components/shared/DialogTitleWithCloseButton";
import { useStore } from "stores/store";

export interface AccessibilitySettingsDialogProps {
  open?: boolean;
  onClose: () => void;
}

export function AccessibilitySettingsDialog(
  props: AccessibilitySettingsDialogProps
) {
  const { open, onClose } = props;

  const accessibilitySettings = useStore(
    (store) => store.accessibilitySettings.settings
  );

  const updateSettings = useStore(
    (store) => store.accessibilitySettings.updateSettings
  );

  return (
    <Dialog open={open ?? false} onClose={onClose}>
      <DialogTitleWithCloseButton onClose={onClose}>
        Accessibility Settings
      </DialogTitleWithCloseButton>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={accessibilitySettings.verboseRollResults ?? false}
                onChange={(evt, value) =>
                  updateSettings({ verboseRollResults: value }).catch(() => {})
                }
              />
            }
            label={"Announce rolls and modifiers when rolling?"}
            sx={{ textTransform: "capitalize", marginRight: 3 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant={"contained"} onClick={onClose}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
