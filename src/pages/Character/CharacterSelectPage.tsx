import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Fab,
  Hidden,
  LinearProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import { CharacterList } from "../../components/CharacterList/CharacterList";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import AddCharacterIcon from "@mui/icons-material/PersonAdd";

import { useConfirm } from "material-ui-confirm";
import {
  CHARACTER_ROUTES,
  constructCharacterPath,
  constructCharacterSheetPath,
} from "./routes";
import { PageHeader } from "components/Layout/PageHeader";
import { PageContent } from "components/Layout";
import { Head } from "providers/HeadProvider/Head";
import { useStore } from "stores/store";

export function CharacterSelectPage() {
  const characters = useStore((store) => store.characters.characterMap);
  const isLoading = useStore((store) => store.characters.loading);
  const errorMessage = useStore((store) => store.characters.error);
  const deleteCharacter = useStore((store) => store.characters.deleteCharacter);

  const confirm = useConfirm();

  const handleDeleteCharacter = (characterId: string) => {
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
        deleteCharacter(characterId).catch(() => {});
      })
      .catch(() => {});
  };

  if (isLoading) {
    return <LinearProgress color={"primary"} />;
  }

  return (
    <>
      <Head
        title={"Your Characters"}
        description={"A list of your characters in Iron Fellowship"}
      />
      <PageHeader
        label={"Your Characters"}
        actions={
          <Hidden smDown>
            <Button
              component={Link}
              to={constructCharacterPath(CHARACTER_ROUTES.CREATE)}
              variant={"contained"}
              color={"primary"}
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
        {errorMessage && (
          <Alert severity={"error"} sx={{ mb: 4 }}>
            <AlertTitle>Error Loading Characters</AlertTitle>
            {errorMessage}
          </Alert>
        )}
        {!characters || Object.keys(characters).length === 0 ? (
          <EmptyState
            imageSrc="/assets/nature.svg"
            title={"Create your First Character"}
            message={"Get started on your journey by creating a new character."}
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
              linkToCharacterSheet
              raised
            />
            <Hidden smUp>
              <Box height={80} />
            </Hidden>
            <Hidden smUp>
              <Fab
                component={Link}
                to={constructCharacterPath(CHARACTER_ROUTES.CREATE)}
                color={"primary"}
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
