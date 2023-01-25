import {
  Box,
  Button,
  Container,
  Grid,
  Hidden,
  LinearProgress,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { paths, ROUTES } from "../../routes";
import { useCampaignStore } from "../../stores/campaigns.store";
import { useCharacterStore } from "../../stores/character.store";
import { useCharacterSheetStore } from "./characterSheet.store";
import { MovesSection } from "./components/MovesSection";
import { StatsSection } from "./components/StatsSection";
import { TabsSection } from "./components/TabsSection";
import { TracksSection } from "./components/TracksSection";

export function CharacterSheetPage() {
  const { characterId } = useParams();
  const characters = useCharacterStore((store) => store.characters);
  const campaigns = useCampaignStore((store) => store.campaigns);
  const loading = useCharacterStore((store) => store.loading);

  const character = useCharacterSheetStore((store) => store.character);
  const setCharacter = useCharacterSheetStore((store) => store.setCharacter);
  const setCampaign = useCharacterSheetStore((store) => store.setCampaign);
  const loadAssets = useCharacterSheetStore((store) => store.loadAssets);
  const loadProgressTracks = useCharacterSheetStore(
    (store) => store.loadProgressTracks
  );
  const resetState = useCharacterSheetStore((store) => store.resetState);

  const campaignId = character?.campaignId;

  useEffect(() => {
    return () => {
      resetState();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = loadAssets();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [character]);

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

  useEffect(() => {
    const unsubscribe = loadProgressTracks();
    return () => {
      unsubscribe();
    };
  }, [characterId, campaignId]);

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

  return (
    <>
      <Box
        sx={[
          (theme) => ({
            position: "relative",
            mx: -3,
            px: 3,
            top: theme.spacing(-3),
            backgroundColor: theme.palette.primary.light,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 0.5,
            flexWrap: "wrap",
            [theme.breakpoints.down("sm")]: {
              mx: -2,
              px: 2,
            },
          }),
        ]}
      >
        <Typography
          variant={"h4"}
          color={"white"}
          my={1}
          fontFamily={(theme) => theme.fontFamilyTitle}
        >
          {character.name}
        </Typography>
        <StatsSection />
      </Box>
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
    </>
  );
}
