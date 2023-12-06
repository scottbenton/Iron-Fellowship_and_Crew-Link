import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Hidden,
  LinearProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import { CharacterList } from "../../components/features/characters/CharacterList/CharacterList";
import { EmptyState } from "../../components/shared/EmptyState/EmptyState";
import AddCharacterIcon from "@mui/icons-material/PersonAdd";
import { CHARACTER_ROUTES, constructCharacterPath } from "./routes";
import { PageHeader } from "components/shared/Layout/PageHeader";
import { PageContent } from "components/shared/Layout";
import { Head } from "providers/HeadProvider/Head";
import { useStore } from "stores/store";
import { useAppName } from "hooks/useAppName";
import { FooterFab } from "components/shared/Layout/FooterFab";
import { LinkComponent } from "components/shared/LinkComponent";

export function Component() {
  const characters = useStore((store) => store.characters.characterMap);
  const isLoading = useStore((store) => store.characters.loading);
  const errorMessage = useStore((store) => store.characters.error);
  const appName = useAppName();

  if (isLoading) {
    return <LinearProgress color={"primary"} />;
  }

  return (
    <>
      <Head
        title={"Your Characters"}
        description={`A list of your characters in ${appName}`}
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
              endIcon={<AddCharacterIcon aria-hidden />}
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
            showImage
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
              <FooterFab
                LinkComponent={LinkComponent}
                href={constructCharacterPath(CHARACTER_ROUTES.CREATE)}
                color={"primary"}
              >
                <AddCharacterIcon aria-label={"Create a Character"} />
              </FooterFab>
            </Hidden>
          </>
        )}
      </PageContent>
    </>
  );
}
