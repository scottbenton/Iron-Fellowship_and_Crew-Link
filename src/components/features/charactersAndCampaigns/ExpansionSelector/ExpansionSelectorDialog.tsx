import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { DialogTitleWithCloseButton } from "components/shared/DialogTitleWithCloseButton";
import { useEffect, useState } from "react";
import { ExpansionSelector } from "./ExpansionSelector";
import { useStore } from "stores/store";

export interface ExpansionSelectorDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ExpansionSelectorDialog(props: ExpansionSelectorDialogProps) {
  const { open, onClose } = props;

  const characterId = useStore(
    (store) => store.characters.currentCharacter.currentCharacterId
  );
  const campaignId = useStore(
    (store) => store.campaigns.currentCampaign.currentCampaignId
  );

  const characterHomebrewIds = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.expansionIds
  );
  const campaignHomebrewIds = useStore(
    (store) => store.campaigns.currentCampaign.currentCampaign?.expansionIds
  );

  const [enabledExpansions, setEnabledExpansions] = useState<
    Record<string, boolean>
  >({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const defaultExpansions: Record<string, boolean> = {};

    if (campaignId) {
      campaignHomebrewIds?.forEach((homebrewId) => {
        defaultExpansions[homebrewId] = true;
      });
    } else if (characterId) {
      characterHomebrewIds?.forEach((homebrewId) => {
        defaultExpansions[homebrewId] = true;
      });
    }

    setEnabledExpansions(defaultExpansions);
  }, [characterId, campaignId, characterHomebrewIds, campaignHomebrewIds]);

  const toggleEnableExpansion = (expansionId: string, enabled: boolean) => {
    setEnabledExpansions((prev) => ({ ...prev, [expansionId]: enabled }));
  };

  const updateCurrentCharacter = useStore(
    (store) => store.characters.currentCharacter.updateCurrentCharacter
  );
  const updateCurrentCampaign = useStore(
    (store) => store.campaigns.currentCampaign.updateCampaign
  );

  const handleSave = () => {
    setLoading(true);
    const expansionIds = Object.keys(enabledExpansions).filter(
      (expansionId) => enabledExpansions[expansionId]
    );

    if (campaignId) {
      updateCurrentCampaign({ expansionIds })
        .then(() => {
          onClose();
        })
        .catch(() => {})
        .finally(() => {
          setLoading(false);
        });
    } else if (characterId) {
      updateCurrentCharacter({ expansionIds })
        .then(() => {
          onClose();
        })
        .catch(() => {})
        .finally(() => {
          setLoading(false);
        });
    } else {
      onClose();
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth={"xs"} fullWidth>
      <DialogTitleWithCloseButton onClose={onClose}>
        Expansions & Homebrew
      </DialogTitleWithCloseButton>
      <DialogContent>
        <ExpansionSelector
          enabledExpansionMap={enabledExpansions}
          toggleEnableExpansion={toggleEnableExpansion}
        />
      </DialogContent>
      <DialogActions>
        <Button color={"inherit"} onClick={() => onClose()} disabled={loading}>
          Cancel
        </Button>
        <Button variant={"contained"} disabled={loading} onClick={handleSave}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
