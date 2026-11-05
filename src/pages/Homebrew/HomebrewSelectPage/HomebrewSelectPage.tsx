import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardActionArea,
  LinearProgress,
  Typography,
} from "@mui/material";
import { PageContent, PageHeader } from "components/shared/Layout";
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
  const sortedHomebrewIds = useStore(
    (store) => store.homebrew.sortedHomebrewCollectionIds
  );
  const homebrewCollections = useStore((store) => store.homebrew.collections);
  const homebrewLoading = useStore((store) => store.homebrew.loading);
  const errorMessage = useStore((store) => store.homebrew.error);

  const [createExpansionDialogOpen, setCreateExpansionDialogOpen] =
    useState(false);

  const collectionIds = Object.values(homebrewCollections).map(
    (collection) => collection.base?.id
  );

  if (homebrewLoading) {
    return <LinearProgress />;
  }

  return (
    <>
      <PageHeader
        label={"Your Homebrew Library"}
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
            {sortedHomebrewIds.map((collectionKey) => (
              <Box
                component={"li"}
                gridColumn={{
                  xs: "span 12",
                  sm: "span 6",
                  md: "span 4",
                }}
                key={collectionKey}
              >
                <Card sx={{ height: "100%" }}>
                  <CardActionArea
                    LinkComponent={LinkComponent}
                    href={constructHomebrewEditorPath(collectionKey)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 2,
                      height: "100%",
                    }}
                  >
                    <Box>
                      <Typography variant={"h6"} component={"p"}>
                        {homebrewCollections[collectionKey].base?.title ||
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
          aria-label={"Create a Collection"}
        >
          <CollectionCreateIcon />
        </FooterFab>
      </Box>
    </>
  );
}
