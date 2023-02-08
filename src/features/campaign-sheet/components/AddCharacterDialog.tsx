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
import { CharacterList } from "../../../components/CharacterList/CharacterList";
import { useCharacterStore } from "../../../stores/character.store";
import { useCampaignStore } from "../../../stores/campaigns.store";
import { Link } from "react-router-dom";
import {
  constructCharacterCreateInCampaignUrl,
  paths,
  ROUTES,
} from "../../../routes";

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
                disabled={!!characters[characterId].campaignId}
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
          >
            Create New Character
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
