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
import { useCharacterStore } from "../../stores/character.store";
import AddCharacterIcon from "@mui/icons-material/PersonAdd";

import { useConfirm } from "material-ui-confirm";
import {
  CHARACTER_ROUTES,
  constructCharacterPath,
  constructCharacterSheetPath,
} from "./routes";
import { PageHeader } from "components/Layout/PageHeader";
import { PageContent } from "components/Layout";

export function CharacterSelectPage() {
  const characters = useCharacterStore((store) => store.characters);
  const loading = useCharacterStore((store) => store.loading);

  const { error } = useSnackbar();

  const handleDelete = (characterId: string) => {
    deleteCharacter(characterId).catch((e) => {
      error("Error deleting your character.");
    });
  };

  const confirm = useConfirm();

  const handleClick = (characterId: string) => {
    confirm({
      title: "Delete Character",
      description: `Are you sure you want to delete ${characters[characterId].name}?`,
      confirmationText: "Delete",
      confirmationButtonProps: {
        variant: "contained",
        color: "error",
      },
    })
      .then(() => {
        handleDelete(characterId);
      })
      .catch(() => {});
  };

  if (loading) {
    return (
      <LinearProgress
        sx={{
          width: "100vw",
          position: "absolute",
          left: 0,
        }}
        color={"secondary"}
      />
    );
  }

  return (
    <>
      <PageHeader
        label={"Your Characters"}
        actions={
          <Hidden smDown>
            <Button
              component={Link}
              to={constructCharacterPath(CHARACTER_ROUTES.CREATE)}
              variant={"contained"}
              color={"secondary"}
              endIcon={<AddCharacterIcon />}
            >
              Create a Character
            </Button>
          </Hidden>
        }
      />
      <PageContent
        isPaper={!characters || Object.keys(characters).length === 0}
      >
        {!characters || Object.keys(characters).length === 0 ? (
          <EmptyState
            imageSrc="/assets/nature.svg"
            title={"Create your First Character"}
            message={
              "Get started on your journey with our digital character sheet"
            }
            callToAction={
              <Button
                component={Link}
                to={constructCharacterPath(CHARACTER_ROUTES.CREATE)}
                variant={"contained"}
                endIcon={<AddCharacterIcon />}
              >
                Create a Character
              </Button>
            }
          />
        ) : (
          <>
            <CharacterList
              characters={characters}
              actions={(characterId) => (
                <>
                  <Button
                    color={"primary"}
                    component={Link}
                    to={constructCharacterSheetPath(characterId)}
                  >
                    View
                  </Button>
                  <Button
                    color={"error"}
                    onClick={() => handleClick(characterId)}
                  >
                    Delete
                  </Button>
                </>
              )}
              raised
            />
            <Hidden smUp>
              <Box height={80} />
            </Hidden>
            <Hidden smUp>
              <Fab
                component={Link}
                to={constructCharacterPath(CHARACTER_ROUTES.CREATE)}
                color={"secondary"}
                sx={(theme) => ({
                  position: "fixed",
                  bottom: theme.spacing(9),
                  right: theme.spacing(2),
                })}
              >
                <AddCharacterIcon />
              </Fab>
            </Hidden>
          </>
        )}
      </PageContent>
    </>
  );
}
