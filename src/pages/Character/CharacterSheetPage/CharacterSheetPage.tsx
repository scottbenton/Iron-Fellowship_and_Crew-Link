import { Button, LinearProgress } from "@mui/material";
import { EmptyState } from "components/shared/EmptyState/EmptyState";
import { TabsSection } from "./components/TabsSection";
import { TracksSection } from "./components/TracksSection";
import { CharacterHeader } from "./components/CharacterHeader";
import { CHARACTER_ROUTES, constructCharacterPath } from "../routes";
import { PageContent, PageHeader } from "components/shared/Layout";
import { Head } from "providers/HeadProvider/Head";
import { useStore } from "stores/store";
import { useSyncStore } from "./hooks/useSyncStore";
import { useEffect, useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { SectionWithSidebar } from "components/shared/Layout/SectionWithSidebar";
import { useIsMobile } from "hooks/useIsMobile";
import { StatsSectionMobile } from "./components/StatsSectionMobile";
import { LinkComponent } from "components/shared/LinkComponent";

export function CharacterSheetPage() {
  useSyncStore();
  const loading = useStore((store) => store.characters.loading);
  const isCharacterLoaded = useStore(
    (store) => !!store.characters.currentCharacter.currentCharacter
  );
  const characterName = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.name
  );

  const isMobile = useIsMobile();

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
        isPaper
        sx={(theme) => ({
          bgcolor:
            theme.palette.mode === "light" && isMobile
              ? "background.paperInlay"
              : undefined,
        })}
      >
        <CharacterHeader />
        {!isMobile ? (
          <SectionWithSidebar
            sidebar={<Sidebar />}
            mainContent={
              <>
                <TracksSection />
                <TabsSection />
              </>
            }
          />
        ) : (
          <>
            <StatsSectionMobile />
            <TracksSection />
            <TabsSection />
          </>
        )}
      </PageContent>
    </>
  );
}
