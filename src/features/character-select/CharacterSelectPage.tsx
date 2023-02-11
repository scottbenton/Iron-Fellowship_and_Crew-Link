import {
  Box,
  Button,
  Fab,
  Hidden,
  LinearProgress,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { deleteCharacter } from "../../api/characters/deleteCharacter";
import { CharacterList } from "../../components/CharacterList/CharacterList";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { useSnackbar } from "../../hooks/useSnackbar";
import { constructCharacterSheetUrl, paths, ROUTES } from "../../routes";
import { useCharacterStore } from "../../stores/character.store";
import AddCharacterIcon from "@mui/icons-material/PersonAdd";

export function CharacterSelectPage() {
  const characters = useCharacterStore((store) => store.characters);
  const loading = useCharacterStore((store) => store.loading);

  const { error } = useSnackbar();

  const handleDelete = (characterId: string) => {
    const shouldDelete = confirm(
      `Are you sure you want to delete ${characters[characterId].name}?`
    );
    if (shouldDelete) {
      deleteCharacter(characterId).catch((e) => {
        error("Error deleting your character.");
      });
    }
  };

  if (loading) {
    return (
      <LinearProgress
        sx={{
          width: "100vw",
          position: "absolute",
          left: 0,
          marginTop: -3,
        }}
      />
    );
  }

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
                <Button
                  color={"error"}
                  onClick={() => handleDelete(characterId)}
                >
                  Delete
                </Button>
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
