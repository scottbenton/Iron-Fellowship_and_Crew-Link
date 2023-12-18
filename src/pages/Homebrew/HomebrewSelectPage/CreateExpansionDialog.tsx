import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
} from "@mui/material";
import { DialogTitleWithCloseButton } from "components/shared/DialogTitleWithCloseButton";
import { dataswornVersion } from "config/datasworn.config";
import { convertIdPart } from "functions/dataswornIdEncoder";
import { useGameSystemValue } from "hooks/useGameSystemValue";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "stores/store";
import { GAME_SYSTEMS } from "types/GameSystems.type";
import { constructHomebrewEditorPath } from "../routes";

export interface CreateExpansionDialogProps {
  open: boolean;
  onClose: () => void;
  ids: string[];
}

export function CreateExpansionDialog(props: CreateExpansionDialogProps) {
  const { open, onClose, ids } = props;

  const navigate = useNavigate();

  const [collectionName, setCollectionName] = useState("");
  const [error, setError] = useState<string>();

  const uid = useStore((store) => store.auth.uid);
  const baseRuleset = useGameSystemValue({
    [GAME_SYSTEMS.IRONSWORN]: "classic",
    [GAME_SYSTEMS.STARFORGED]: "starforged",
  });

  const createExpansion = useStore((store) => store.homebrew.createExpansion);

  const handleCreate = () => {
    let idSlug: string = "";
    try {
      idSlug = convertIdPart(collectionName);
    } catch (e) {
      console.error(e);
      setError(
        "Failed to convert name to an id. Make sure you have at least three letters in your collection name."
      );
      return;
    }
    if (ids.includes(idSlug)) {
      setError(`ID ${idSlug} is already taken. Please change the package name`);
      return;
    }
    createExpansion({
      id: idSlug,
      datasworn_version: dataswornVersion,
      package_type: "expansion",
      ruleset: baseRuleset,
      creatorUid: uid,
      uids: [uid],
      title: collectionName,
    })
      .then((id) => {
        onClose();
        navigate(constructHomebrewEditorPath(id));
      })
      .catch(() => {});
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitleWithCloseButton onClose={onClose}>
        Create Expansion Collection
      </DialogTitleWithCloseButton>
      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          sx={{ mt: 1 }}
          label={"Collection Name"}
          value={collectionName}
          onChange={(evt) => setCollectionName(evt.currentTarget.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button color={"inherit"} onClick={onClose}>
          Cancel
        </Button>
        <Button variant={"contained"} onClick={handleCreate}>
          Create Expansion
        </Button>
      </DialogActions>
    </Dialog>
  );
}
