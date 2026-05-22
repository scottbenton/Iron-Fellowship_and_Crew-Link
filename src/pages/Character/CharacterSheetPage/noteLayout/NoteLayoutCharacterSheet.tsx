import { useStore } from "stores/store";
import { useSyncStore } from "../hooks/useSyncStore";
import { useEffect, useState } from "react";
import { Box, Button, LinearProgress } from "@mui/material";
import { PageContent, PageHeader } from "components/shared/Layout";
import { EmptyState } from "components/shared/EmptyState";
import { LinkComponent } from "components/shared/LinkComponent";
import {
  CHARACTER_ROUTES,
  constructCharacterPath,
} from "pages/Character/routes";
import { Head } from "providers/HeadProvider/Head";
import { PageSidebar } from "./PageSidebar";
import { CharacterSidebar } from "./CharacterSidebar/CharacterSidebar";
import { ReferenceSidebar } from "./ReferenceSidebar";
import { NotesSection } from "./NotesSection";

export function NoteLayoutCharacterSheet() {
  useSyncStore();

  const loading = useStore((store) => store.characters.loading);
  const isCharacterLoaded = useStore(
    (store) => !!store.characters.currentCharacter.currentCharacter
  );
  const characterName = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.name
  );

  const [syncLoading, setSyncLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSyncLoading(false);
    }, 2 * 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  if (loading || (!isCharacterLoaded && syncLoading)) {
    return <LinearProgress />;
  }

  if (!isCharacterLoaded) {
    return (
      <>
        <PageHeader />
        <PageContent isPaper>
          <EmptyState
            title={"Character not Found"}
            message={"Please try again from the character selection page"}
            showImage
            callToAction={
              <Button
                LinkComponent={LinkComponent}
                href={constructCharacterPath(CHARACTER_ROUTES.SELECT)}
                variant={"contained"}
                size={"large"}
              >
                Character Select
              </Button>
            }
          />
        </PageContent>
      </>
    );
  }
  return (
    <>
      <Head
        title={characterName ?? ""}
        description={`${characterName ?? ""}'s character sheet`}
      />
      <PageHeader />
      <PageContent
        viewHeight
        hiddenHeader
        isPaper
        sx={{
          py: 2,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns:
              "minmax(320px, 400px) 1fr minmax(250px, 300px)",
            height: "100%",
          }}
        >
          <PageSidebar>
            <CharacterSidebar />
          </PageSidebar>
          <NotesSection />
          <PageSidebar>
            <ReferenceSidebar />
          </PageSidebar>
        </Box>
      </PageContent>
    </>
  );
}
