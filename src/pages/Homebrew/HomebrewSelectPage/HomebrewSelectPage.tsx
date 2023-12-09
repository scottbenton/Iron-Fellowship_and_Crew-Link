import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardActionArea,
  Typography,
} from "@mui/material";
import { PageContent, PageHeader } from "components/shared/Layout";
import { useNewCustomContentPage } from "hooks/featureFlags/useNewCustomContentPage";
import OpenIcon from "@mui/icons-material/ChevronRight";
import { useStore } from "stores/store";
import CollectionCreateIcon from "@mui/icons-material/CreateNewFolder";
import { useState } from "react";
import { CreateExpansionDialog } from "./CreateExpansionDialog";
import { LinkComponent } from "components/shared/LinkComponent";
import { constructHomebrewEditorPath } from "../routes";
import { EmptyState } from "components/shared/EmptyState";
import { FooterFab } from "components/shared/Layout/FooterFab";

export function HomebrewSelectPage() {
  const showPage = useNewCustomContentPage();

  const homebrewCollections = useStore((store) => store.homebrew.collections);
  // const homebrewLoading = useStore((store) => store.homebrew.loading);
  const errorMessage = useStore((store) => store.homebrew.error);

  const [createExpansionDialogOpen, setCreateExpansionDialogOpen] =
    useState(false);

  if (!showPage) {
    return null;
  }

  const collectionKeys = Object.keys(homebrewCollections).sort((k1, k2) =>
    (homebrewCollections[k1].title ?? "Unnamed Collection")?.localeCompare(
      homebrewCollections[k2].title ?? "Unnamed Collection"
    )
  );

  const collectionIds = Object.values(homebrewCollections).map(
    (collection) => collection.id
  );

  return (
    <>
      <PageHeader
        label={"Your Homebrew Collections"}
        actions={
          <Button
            variant={"contained"}
            color={"primary"}
            endIcon={<CollectionCreateIcon />}
            onClick={() => setCreateExpansionDialogOpen(true)}
          >
            Create a Collection
          </Button>
        }
      />
      <PageContent
        isPaper={
          !homebrewCollections || Object.keys(homebrewCollections).length === 0
        }
      >
        <CreateExpansionDialog
          open={createExpansionDialogOpen}
          onClose={() => setCreateExpansionDialogOpen(false)}
          ids={collectionIds}
        />
        {errorMessage && (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {errorMessage}
          </Alert>
        )}
        {!homebrewCollections ||
        Object.keys(homebrewCollections).length === 0 ? (
          <EmptyState
            showImage
            title={"Create a Homebrew Collection"}
            message={
              "Collections allow you to organize your homebrew for different games."
            }
            callToAction={
              <Button
                variant={"contained"}
                endIcon={<CollectionCreateIcon />}
                onClick={() => setCreateExpansionDialogOpen(true)}
              >
                Create a Collection
              </Button>
            }
          />
        ) : (
          <Box
            component={"ul"}
            display={"grid"}
            gridTemplateColumns={"repeat(12, 1fr)"}
            gap={2}
            pl={0}
            my={0}
            sx={{ listStyle: "none" }}
          >
            {collectionKeys.map((collectionKey) => (
              <Box
                component={"li"}
                gridColumn={{
                  xs: "span 12",
                  sm: "span 6",
                  md: "span 4",
                }}
                key={collectionKey}
              >
                <Card>
                  <CardActionArea
                    LinkComponent={LinkComponent}
                    href={constructHomebrewEditorPath(collectionKey)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 2,
                    }}
                  >
                    <Box>
                      <Typography variant={"h6"} component={"p"}>
                        {homebrewCollections[collectionKey].title ??
                          "Unnamed Collection"}
                      </Typography>
                    </Box>
                    <OpenIcon color={"action"} />
                  </CardActionArea>
                </Card>
              </Box>
            ))}
          </Box>
        )}
      </PageContent>
      <Box display={{ xs: "block", sm: "none" }}>
        <Box height={80} />
        <FooterFab
          onClick={() => setCreateExpansionDialogOpen(true)}
          color={"primary"}
        >
          <CollectionCreateIcon aria-label={"Create a Collection"} />
        </FooterFab>
      </Box>
    </>
  );
}
