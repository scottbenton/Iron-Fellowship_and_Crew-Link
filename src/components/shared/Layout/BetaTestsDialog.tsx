import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  LinearProgress,
  Stack,
  Switch,
} from "@mui/material";
import { DialogTitleWithCloseButton } from "../DialogTitleWithCloseButton";
import { activeFeatureFlags } from "hooks/featureFlags/activeFeatureFlags";
import { EmptyState } from "../EmptyState";
import { useEffect, useRef, useState } from "react";
import { useStore } from "stores/store";

export interface BetaTestsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function BetaTestsDialog(props: BetaTestsDialogProps) {
  const { open, onClose } = props;

  const updateBetaTests = useStore((store) => store.appState.updateBetaTests);

  const [testStates, setTestStates] = useState<Record<string, boolean>>();
  const initialTestStates = useRef<Record<string, boolean>>();

  useEffect(() => {
    const forcedGroups: { [groupName: string]: boolean } = JSON.parse(
      localStorage.getItem("forcedGroups") ?? "{}"
    );
    setTestStates(forcedGroups);
    initialTestStates.current = forcedGroups;
  }, []);

  const handleTestChange = (testId: string, value: boolean) => {
    setTestStates((prev) => ({
      ...prev,
      [testId]: value,
    }));
  };

  const handleSave = () => {
    if (testStates !== initialTestStates.current && testStates !== undefined) {
      updateBetaTests(testStates);
      onClose();
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitleWithCloseButton onClose={onClose}>
        Beta Tests
      </DialogTitleWithCloseButton>
      <DialogContent>
        {activeFeatureFlags.length === 0 ? (
          <EmptyState message="There are no active beta tests at this time" />
        ) : testStates === undefined ? (
          <LinearProgress />
        ) : (
          <Stack spacing={2} sx={{ mt: 1 }}>
            {activeFeatureFlags.map((flagConfig) => (
              <FormControlLabel
                key={flagConfig.testId}
                control={
                  <Switch
                    checked={testStates[flagConfig.testId] ?? false}
                    onChange={(evt, checked) =>
                      handleTestChange(flagConfig.testId, checked)
                    }
                  />
                }
                label={flagConfig.label}
              />
            ))}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button color={"inherit"} onClick={onClose}>
          Cancel
        </Button>
        <Button variant={"contained"} color={"primary"} onClick={handleSave}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
