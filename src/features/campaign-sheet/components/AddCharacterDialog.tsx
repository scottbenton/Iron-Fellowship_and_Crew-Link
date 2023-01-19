import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { CharacterList } from "../../../components/CharacterList/CharacterList";
import { useCharacterStore } from "../../../stores/character.store";
import { useCampaignStore } from "../../../stores/campaigns.store";

export interface AddCharacterDialogProps {
  open: boolean;
  handleClose: () => void;
  campaignId: string;
}

export function AddCharacterDialog(props: AddCharacterDialogProps) {
  const { open, handleClose, campaignId } = props;

  const characters = useCharacterStore((store) => store.characters);
  const isLoading = useCharacterStore((store) => store.loading);
  const addCharacterToCampaign = useCampaignStore(
    (store) => store.addCharacterToCampaign
  );

  const addCharacter = (characterId: string) => {
    addCharacterToCampaign(campaignId, characterId).finally(() => {
      handleClose();
    });
  };

  return (
    <Dialog open={open} onClose={() => handleClose()}>
      <DialogTitle
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <span>Add Character</span>
        <IconButton onClick={() => handleClose()} sx={{ ml: 2 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {!isLoading && (
          <CharacterList
            characters={characters}
            maxColumns={1}
            actions={(characterId) => (
              <Button
                disabled={!!characters[characterId].campaignId}
                onClick={() => addCharacter(characterId)}
              >
                {characters[characterId].campaignId ? "Selected" : "Select"}
              </Button>
            )}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
