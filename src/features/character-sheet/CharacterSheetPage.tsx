import { Box, Button, Grid, Hidden, LinearProgress } from "@mui/material";
import { useListenToCampaignProgressTracksCharacterSheet } from "api/campaign/tracks/listenToCampaignProgressTracks";
import { useListenToCharacterProgressTracks } from "api/characters/tracks/listenToCharacterProgressTracks";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { paths, ROUTES } from "../../routes";
import { useCampaignStore } from "../../stores/campaigns.store";
import { useCharacterStore } from "../../stores/character.store";
import { useCharacterSheetStore } from "./characterSheet.store";
import { MovesSection } from "components/MovesSection";
import { TabsSection } from "./components/TabsSection";
import { TracksSection } from "./components/TracksSection";
import { useListenToCharacterSheetNotes } from "api/characters/notes/listenToCharacterNotes";
import { CharacterHeader } from "./components/CharacterHeader";

export function CharacterSheetPage() {
  const { characterId } = useParams();
  const characters = useCharacterStore((store) => store.characters);
  const campaigns = useCampaignStore((store) => store.campaigns);
  const loading = useCharacterStore((store) => store.loading);

  const character = useCharacterSheetStore((store) => store.character);
  const supply = useCharacterSheetStore((store) => store.supply);
  const setCharacter = useCharacterSheetStore((store) => store.setCharacter);
  const setCampaign = useCharacterSheetStore((store) => store.setCampaign);
  const resetState = useCharacterSheetStore((store) => store.resetState);

  useListenToCharacterProgressTracks();
  useListenToCampaignProgressTracksCharacterSheet();
  useListenToCharacterSheetNotes();

  useEffect(() => {
    return () => {
      resetState();
    };
  }, []);

  useEffect(() => {
    setCharacter(
      characterId,
      characterId ? characters[characterId] : undefined
    );

    const campaignId = characterId
      ? characters[characterId]?.campaignId
      : undefined;

    setCampaign(campaignId, campaignId ? campaigns[campaignId] : undefined);
  }, [characters, characterId, campaigns]);

  if (loading) {
    return (
      <LinearProgress
        sx={{ width: "100vw", position: "absolute", left: 0, marginTop: -3 }}
      />
    );
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

  const stats = {
    ...character.stats,
    health: character.health,
    spirit: character.spirit,
    supply: supply ?? 0,
  };

  return (
    <>
      <CharacterHeader />
      <Grid
        container
        spacing={2}
        display={"flex"}
        sx={(theme) => ({
          [theme.breakpoints.up("md")]: {
            height: "calc(100vh - 110px)",
            overflow: "hidden",
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
            <MovesSection stats={stats} campaignId={character.campaignId} />
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
    </>
  );
}
