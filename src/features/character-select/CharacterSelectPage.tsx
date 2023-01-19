import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  Grid,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { deleteCharacter } from "../../api/deleteCharacter";
import { CharacterList } from "../../components/CharacterList/CharacterList";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { getHueFromString } from "../../functions/getHueFromString";
import { useSnackbar } from "../../hooks/useSnackbar";
import { constructCharacterSheetUrl, paths, ROUTES } from "../../routes";
import { useCharacterStore } from "../../stores/character.store";

export function CharacterSelectPage() {
  const characters = useCharacterStore((store) => store.characters);
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
          >
            <Typography
              variant={"h5"}
              fontFamily={(theme) => theme.fontFamilyTitle}
            >
              Your Characters
            </Typography>
            <Button
              component={Link}
              to={paths[ROUTES.CHARACTER_CREATE]}
              variant={"contained"}
            >
              Create a Character
            </Button>
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
        </>
      )}
    </>
  );
}
