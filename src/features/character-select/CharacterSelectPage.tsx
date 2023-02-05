import { Box, Button, Fab, Hidden, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { deleteCharacter } from "../../api/deleteCharacter";
import { CharacterList } from "../../components/CharacterList/CharacterList";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { useSnackbar } from "../../hooks/useSnackbar";
import { constructCharacterSheetUrl, paths, ROUTES } from "../../routes";
import { useCharacterStore } from "../../stores/character.store";
import AddCharacterIcon from "@mui/icons-material/PersonAdd";
import ConfirmDeleteDialog from "../../components/ConfirmDeleteDialog";

import { useState } from "react";

export function CharacterSelectPage() {
  const characters = useCharacterStore((store) => store.characters);
  const { error } = useSnackbar();

  const handleDelete = (characterId: string) => {
    deleteCharacter(characterId).catch((e) => {
      error("Error deleting your character.");
    });
  };

  // ConfirmDeleteDialog open/close state
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {!characters || Object.keys(characters).length === 0 ? (
        <EmptyState
          imageSrc="/assets/nature.svg"
          title={"No Characters"}
          message={"Create your first character to get started"}
          callToAction={
            <Button
              component={Link}
              to={paths[ROUTES.CHARACTER_CREATE]}
              variant={"contained"}
              endIcon={<AddCharacterIcon />}
            >
              Create a Character
            </Button>
          }
        />
      ) : (
        <>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            pb={2}
          >
            <Typography
              variant={"h5"}
              fontFamily={(theme) => theme.fontFamilyTitle}
            >
              Your Characters
            </Typography>
            <Hidden smDown>
              <Button
                component={Link}
                to={paths[ROUTES.CHARACTER_CREATE]}
                variant={"contained"}
                endIcon={<AddCharacterIcon />}
              >
                Create a Character
              </Button>
            </Hidden>
          </Box>
          <CharacterList
            characters={characters}
            actions={(characterId) => (
              <>
                <Button
                  color={"primary"}
                  component={Link}
                  to={constructCharacterSheetUrl(characterId)}
                >
                  View
                </Button>
                <Button color={"error"} onClick={handleClickOpen}>
                  Delete
                </Button>
                <ConfirmDeleteDialog
                  title={"Delete Character?"}
                  handleDelete={() => handleDelete(characterId)}
                  open={open}
                  handleClose={handleClose}
                >
                  {`Are you sure you want to delete ${characters[characterId].name}?`}
                </ConfirmDeleteDialog>
              </>
            )}
          />
          <Hidden smUp>
            <Box height={80} />
          </Hidden>
          <Hidden smUp>
            <Fab
              component={Link}
              to={paths[ROUTES.CHARACTER_CREATE]}
              color={"primary"}
              sx={{
                position: "fixed",
                bottom: 16,
                right: 16,
              }}
            >
              <AddCharacterIcon />
            </Fab>
          </Hidden>
        </>
      )}
    </>
  );
}
