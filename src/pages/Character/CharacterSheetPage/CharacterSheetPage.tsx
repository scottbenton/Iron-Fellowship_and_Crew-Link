import { Box, Button, Grid, Hidden, LinearProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { EmptyState } from "components/EmptyState/EmptyState";
import { MovesSection } from "components/MovesSection";
import { TabsSection } from "./components/TabsSection";
import { TracksSection } from "./components/TracksSection";
import { CharacterHeader } from "./components/CharacterHeader";
import { CHARACTER_ROUTES, characterPaths } from "../routes";
import { PageContent, PageHeader } from "components/Layout";
import { Head } from "providers/HeadProvider/Head";
import { useStore } from "stores/store";
import { useSyncStore } from "./hooks/useSyncStore";
import { useEffect, useState } from "react";

export function CharacterSheetPage() {
  useSyncStore();
  const loading = useStore((store) => store.characters.loading);
  const character = useStore(
    (store) => store.characters.currentCharacter.currentCharacter
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

  if (loading || (!character && syncLoading)) {
    return <LinearProgress />;
  }

  if (!character) {
    return (
      <EmptyState
        title={"Character not Found"}
        message={"Please try again from the character selection page"}
        imageSrc={"/assets/nature.svg"}
        callToAction={
          <Button
            component={Link}
            to={characterPaths[CHARACTER_ROUTES.SELECT]}
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
        title={character.name}
        description={`${character.name}'s character sheet`}
      />
      <PageHeader />
      <PageContent viewHeight isPaper>
        <CharacterHeader />
        <Grid
          container
          spacing={2}
          display={"flex"}
          sx={(theme) => ({
            pt: 2,
            [theme.breakpoints.up("md")]: {
              overflow: "hidden",
              height: "100%",
            },
          })}
        >
          <Hidden mdDown>
            <Grid
              item
              xs={12}
              md={4}
              lg={3}
              sx={(theme) => ({
                [theme.breakpoints.up("md")]: {
                  height: "100%",
                },
              })}
            >
              <MovesSection />
            </Grid>
          </Hidden>
          <Grid
            item
            xs={12}
            md={8}
            lg={9}
            sx={(theme) => ({
              [theme.breakpoints.up("md")]: {
                height: "100%",
              },
            })}
          >
            <Box display={"flex"} height={"100%"} flexDirection={"column"}>
              <TracksSection />
              <TabsSection />
            </Box>
          </Grid>
        </Grid>
      </PageContent>
    </>
  );
}
