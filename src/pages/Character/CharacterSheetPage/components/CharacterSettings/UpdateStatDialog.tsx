import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  capitalize,
} from "@mui/material";
import { DialogTitleWithCloseButton } from "components/shared/DialogTitleWithCloseButton";
import { NumberField } from "components/shared/NumberField";
import { useState } from "react";
import { useStore } from "stores/store";
export interface UpdateStatDialogProps {
  open: boolean;
  onClose: () => void;
}

export function UpdateStatDialog(props: UpdateStatDialogProps) {
  const { open, onClose } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitleWithCloseButton onClose={onClose}>
        Update Character Stats
      </DialogTitleWithCloseButton>
      <UpdateStatDialogContents onClose={onClose} />
    </Dialog>
  );
}

function UpdateStatDialogContents(props: { onClose: () => void }) {
  const { onClose } = props;

  const [isLoading, setIsLoading] = useState(false);

  const stats = useStore((store) => store.rules.stats);
  const characterStats = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.stats
  );

  const updateCharacter = useStore(
    (store) => store.characters.currentCharacter.updateCurrentCharacter
  );

  const [statValues, setStatValues] = useState<
    Record<string, number | undefined>
  >({ ...characterStats });
  const updateCharacterStat = (stat: string, value?: number) => {
    setStatValues((prevValues) => ({
      ...prevValues,
      [stat]: value,
    }));
  };

  const handleSave = () => {
    setIsLoading(true);

    const newStats: Record<string, number> = {};

    Object.keys(stats).forEach((statKey) => {
      newStats[statKey] = statValues[statKey] ?? 0;
    });

    updateCharacter({
      stats: newStats,
    })
      .then(() => {
        onClose();
      })
      .catch(() => {});
  };

  if (!characterStats) {
    return null;
  }

  return (
    <>
      <DialogTitleWithCloseButton onClose={onClose}>
        Update Character Stats
      </DialogTitleWithCloseButton>
      <DialogContent>
        {Object.keys(stats).map((statKey) => (
          <NumberField
            key={statKey}
            label={capitalize(stats[statKey].label)}
            value={statValues[statKey] ?? 0}
            onChange={(value) => updateCharacterStat(statKey, value)}
            sx={{ mt: 2 }}
            helperText={stats[statKey].description}
            fullWidth
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button color={"inherit"} onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant={"contained"} onClick={handleSave} disabled={isLoading}>
          Save Changes
        </Button>
      </DialogActions>
    </>
  );
}
