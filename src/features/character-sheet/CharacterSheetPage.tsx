import { Box, Button, Grid, LinearProgress, Typography } from "@mui/material";
import { Unsubscribe } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { PageBanner } from "../../components/Layout/PageBanner";
import { paths, ROUTES } from "../../routes";
import { useCharacterStore } from "../../stores/character.store";
import { StoredAsset } from "../../types/Asset.type";
import { getAssets } from "./api/getAssets";
import { MovesSection } from "./components/MovesSection";
import { StatComponent } from "./components/StatComponent";
import { StatsSection } from "./components/StatsSection";
import { TabsSection } from "./components/TabsSection";
import { TracksSection } from "./components/TracksSection";

export function CharacterSheetPage() {
  const { characterId } = useParams();
  const characters = useCharacterStore((store) => store.characters);
  const loading = useCharacterStore((store) => store.loading);

  const [assets, setAssets] = useState<StoredAsset[]>();

  useEffect(() => {
    let unsubscribe: Unsubscribe | undefined;
    if (characterId) {
      unsubscribe = getAssets(
        characterId,
        (newAssets) => setAssets(newAssets),
        (error) => console.error(error)
      );
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [characterId]);

  if (loading)
    return (
      <LinearProgress
        sx={{ width: "100vw", position: "absolute", left: 0, marginTop: -3 }}
      />
    );

  const character = characters[characterId || ""];

  if (!character || !characterId) {
    return (
      <EmptyState
        title={"Character not Found"}
        message={"Please try again from the character selection page"}
        imageSrc={"/assets/nature.svg"}
        callToAction={
          <Button
            component={Link}
            to={paths[ROUTES.CHARACTER_SELECT]}
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
      <PageBanner containerSx={{ py: 0.5 }}>
        <Typography
          variant={"h4"}
          color={"white"}
          my={1}
          fontFamily={(theme) => theme.fontFamilyTitle}
        >
          {character.name}
        </Typography>
        <StatsSection
          characterId={characterId}
          stats={character.stats}
          health={character.health}
          spirit={character.spirit}
          supply={character.supply}
        />
      </PageBanner>
      <Grid
        container
        spacing={2}
        display={"flex"}
        sx={(theme) => ({
          [theme.breakpoints.up("md")]: {
            height: "90vh",
            overflow: "hidden",
          },
        })}
      >
        <Grid
          item
          xs={12}
          md={4}
          sx={(theme) => ({
            [theme.breakpoints.up("md")]: {
              height: "100%",
            },
          })}
        >
          <MovesSection
            stats={character.stats}
            health={character.health}
            spirit={character.spirit}
            supply={character.supply}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={8}
          sx={(theme) => ({
            [theme.breakpoints.up("md")]: {
              height: "100%",
            },
          })}
        >
          <Box display={"flex"} height={"100%"} flexDirection={"column"}>
            <TracksSection
              characterId={characterId}
              health={character.health}
              spirit={character.spirit}
              supply={character.supply}
              momentum={character.momentum}
            />
            <TabsSection assets={assets} />
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
