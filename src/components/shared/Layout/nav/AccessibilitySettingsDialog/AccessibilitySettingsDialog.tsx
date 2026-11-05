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
import { useHide3dDice } from "hooks/useHide3dDice";
import { AUTH_STATE } from "stores/auth/auth.slice.type";

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

  const isLoggedIn = useStore(
    (store) => store.auth.status === AUTH_STATE.AUTHENTICATED
  );
  const hide3dDice = useHide3dDice();
  const updateUserDoc = useStore((store) => store.auth.updateUserDoc);

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
          {isLoggedIn && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={!hide3dDice}
                  onChange={(evt, value) =>
                    updateUserDoc({ hide3dDice: !value })
                  }
                />
              }
              label={"Show animated 3D dice when rolling?"}
              sx={{ textTransform: "capitalize", marginRight: 3 }}
            />
          )}
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
