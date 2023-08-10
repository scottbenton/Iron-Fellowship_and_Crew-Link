import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { CharacterList } from "components/CharacterList/CharacterList";
import { Link } from "react-router-dom";
import { constructCharacterCreateInCampaignUrl } from "pages/Character/routes";
import { useStore } from "stores/store";
import { useState } from "react";

export interface AddCharacterDialogProps {
  open: boolean;
  handleClose: () => void;
  campaignId: string;
}

export function AddCharacterDialog(props: AddCharacterDialogProps) {
  const { open, handleClose, campaignId } = props;

  const characters = useStore((store) => store.characters.characterMap);
  const isLoading = useStore((store) => store.characters.loading);

  const addCharacterToCampaign = useStore(
    (store) => store.campaigns.currentCampaign.addCharacter
  );
  const [addCharacterLoading, setAddCharacterLoading] = useState(false);

  const addCharacter = (characterId: string) => {
    setAddCharacterLoading(true);
    addCharacterToCampaign(characterId).finally(() => {
      setAddCharacterLoading(false);
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
        <IconButton
          onClick={() => handleClose()}
          disabled={addCharacterLoading}
          sx={{ ml: 2 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {Object.keys(characters).length > 0 && (
          <Typography
            sx={{ mb: 1 }}
            color={(theme) => theme.palette.text.secondary}
          >
            Add an existing character
          </Typography>
        )}
        {!isLoading && (
          <CharacterList
            characters={characters}
            maxColumns={1}
            actions={(characterId) => (
              <Button
                disabled={
                  !!characters[characterId].campaignId || addCharacterLoading
                }
                onClick={() => addCharacter(characterId)}
              >
                {characters[characterId].campaignId ? "Selected" : "Select"}
              </Button>
            )}
          />
        )}
        {Object.keys(characters).length > 0 && (
          <Divider sx={{ my: 3 }}>OR</Divider>
        )}
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          mt={2}
        >
          <Button
            variant={"contained"}
            component={Link}
            to={constructCharacterCreateInCampaignUrl(campaignId)}
            disabled={addCharacterLoading}
          >
            Create New Character
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
