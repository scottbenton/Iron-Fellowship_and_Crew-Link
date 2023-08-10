import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { useUpdateWorldTruth } from "api/worlds/updateWorldTruth";
import { DialogTitleWithCloseButton } from "components/DialogTitleWithCloseButton";
import { TruthChooser } from "components/TruthChooser";
import { TruthClassic } from "dataforged";
import { getCustomTruthId } from "pages/World/WorldCreatePage/worldCreate.store";
import { useState } from "react";
import { Truth, TRUTH_IDS } from "types/World.type";
import { useStore } from "stores/store";

export interface TruthDialogSelectorProps {
  open: boolean;
  handleClose: () => void;
  truthId: TRUTH_IDS;
  truth: TruthClassic;
  storedTruth: Truth;
  selectTruthOption: (truth: Truth) => void;
}

export function TruthDialogSelector(props: TruthDialogSelectorProps) {
  const { open, handleClose, truth, storedTruth, truthId, selectTruthOption } =
    props;

  const [selectedOptionId, setSelectedOptionId] = useState(storedTruth.id);

  const [customDescription, setCustomDescription] = useState<string>(
    storedTruth.customTruth?.Description ?? ""
  );
  const [customQuestStarter, setCustomQuestStarter] = useState<string>(
    storedTruth.customTruth?.["Quest starter"] ?? ""
  );

  const updateWorldTruth = useStore(
    (store) => store.worlds.currentWorld.updateCurrentWorldTruth
  );

  const handleSave = () => {
    let updatedTruth: Truth;
    if (selectedOptionId === getCustomTruthId(truthId)) {
      updatedTruth = {
        id: selectedOptionId,
        customTruth: {
          $id: selectedOptionId,
          Description: customDescription,
          "Quest starter": customQuestStarter,
        },
      };
    } else {
      updatedTruth = {
        id: selectedOptionId,
      };
    }
    selectTruthOption(updatedTruth);

    updateWorldTruth(truthId, updatedTruth)
      .then(() => {
        handleClose();
      })
      .catch(() => {});
  };

  return (
    <Dialog open={open} onClose={() => handleClose()}>
      <DialogTitleWithCloseButton onClose={() => handleClose()}>
        Edit {truth.Title.Standard}
      </DialogTitleWithCloseButton>
      <DialogContent>
        <TruthChooser
          truthId={truthId}
          selectedTruthOptionId={selectedOptionId}
          selectTruthOption={(id) => setSelectedOptionId(id)}
          customDescription={customDescription}
          changeCustomTruthDescription={setCustomDescription}
          customTruthQuestStarter={customQuestStarter}
          changeCustomTruthQuestStarter={setCustomQuestStarter}
          maxColumns={1}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose()}>Cancel</Button>
        <Button variant={"contained"} onClick={() => handleSave()}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
