import { Box, Button, Grid, Hidden, LinearProgress } from "@mui/material";
import { useListenToCampaignProgressTracksCharacterSheet } from "api/campaign/tracks/listenToCampaignProgressTracks";
import { useListenToCharacterProgressTracks } from "api/characters/tracks/listenToCharacterProgressTracks";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { EmptyState } from "components/EmptyState/EmptyState";
import { useCampaignStore } from "stores/campaigns.store";
import { useCharacterStore } from "stores/character.store";
import { useCharacterSheetStore } from "./characterSheet.store";
import { MovesSection } from "components/MovesSection";
import { TabsSection } from "./components/TabsSection";
import { TracksSection } from "./components/TracksSection";
import { useListenToCharacterSheetNotes } from "api/characters/notes/listenToCharacterNotes";
import { CharacterHeader } from "./components/CharacterHeader";
import { useCharacterSheetListenToCustomOracles } from "api/user/custom-oracles/listenToCustomOracles";
import { useCharacterSheetListenToCustomMoves } from "api/user/custom-moves/listenToCustomMoves";
import { useCharacterSheetListenToCampaignSettings } from "api/campaign/settings/listenToCampaignSettings";
import { useCharacterSheetListenToCharacterSettings } from "api/characters/settings/listenToCharacterSettings";
import { useCharacterSheetListenToWorld } from "api/worlds/listenToWorld";
import { useCharacterSheetListenToLocations } from "api/worlds/locations/listenToLocations";
import { CHARACTER_ROUTES, characterPaths } from "../routes";
import { PageContent, PageHeader } from "components/Layout";
import { useCharacterSheetListenToNPCs } from "api/worlds/npcs/listenToNPCs";

export function CharacterSheetPage() {
  const { characterId } = useParams();
  const characters = useCharacterStore((store) => store.characters);
  const campaigns = useCampaignStore((store) => store.campaigns);
  const loading = useCharacterStore((store) => store.loading);
  const character = useCharacterSheetStore((store) => store.character);
  const setCharacter = useCharacterSheetStore((store) => store.setCharacter);
  const setCampaign = useCharacterSheetStore((store) => store.setCampaign);
  const resetState = useCharacterSheetStore((store) => store.resetState);

  useListenToCharacterProgressTracks();
  useListenToCampaignProgressTracksCharacterSheet();
  useListenToCharacterSheetNotes();
  useCharacterSheetListenToCustomMoves();
  useCharacterSheetListenToCustomOracles();
  useCharacterSheetListenToCampaignSettings();
  useCharacterSheetListenToCharacterSettings();
  useCharacterSheetListenToWorld();
  useCharacterSheetListenToLocations();
  useCharacterSheetListenToNPCs();

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
