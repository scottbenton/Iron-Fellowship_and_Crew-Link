import { Box, Typography, Grid, Button, Stack } from "@mui/material";
import { PageContent, PageHeader } from "components/shared/Layout";
import { useAppName } from "hooks/useAppName";
import { useGameSystemValue } from "hooks/useGameSystemValue";
import {
  CHARACTER_ROUTES,
  constructCharacterPath,
} from "pages/Character/routes";
import { Link } from "react-router-dom";
import { BASE_ROUTES, basePaths } from "routes";
import { useStore } from "stores/store";
import { GAME_SYSTEMS } from "types/GameSystems.type";
import { ExampleStatsSection } from "./ExampleStatsSection";
import { ExampleSupplySection } from "./ExampleSupplySection";
import { ExampleTrackSection } from "./ExampleTrackSection";
import { Licensing } from "./Licensing";
import { getPublicAssetPath } from "functions/getPublicAssetPath";

export function HomePage() {
  const isLoggedIn = useStore((store) => !!store.auth.user);

  const appName = useAppName();
  const gameSystem = useGameSystemValue({
    [GAME_SYSTEMS.IRONSWORN]: "Ironsworn",
    [GAME_SYSTEMS.STARFORGED]: "Starforged",
  });

  return (
    <>
      <PageHeader>
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          flexGrow={1}
        >
          <Typography
            textAlign={"center"}
            variant={"h3"}
            component={"h1"}
            fontFamily={(theme) => theme.fontFamilyTitle}
            color={(theme) => theme.palette.common.white}
          >
            Welcome{isLoggedIn && " back"} to {appName}
          </Typography>
          <Typography
            textAlign={"center"}
            variant={"h6"}
            component={"p"}
            fontFamily={(theme) => theme.fontFamilyTitle}
            color={(theme) => theme.palette.common.white}
          >
            {`Get playing with your ${gameSystem} group in minutes`}
          </Typography>
          {isLoggedIn ? (
            <Button
              className={"dark-focus-outline"}
              color={"primary"}
              variant={"contained"}
              component={Link}
              to={constructCharacterPath(CHARACTER_ROUTES.SELECT)}
              sx={{ mt: 3 }}
            >
              Your Characters
            </Button>
          ) : (
            <Stack direction={"row"} spacing={1} mt={4}>
              <Button
                className={"dark-focus-outline"}
                color={"inherit"}
                component={Link}
                to={basePaths[BASE_ROUTES.LOGIN]}
              >
                Login
              </Button>
              <Button
                className={"dark-focus-outline"}
                variant={"contained"}
                color={"primary"}
                component={Link}
                to={basePaths[BASE_ROUTES.SIGNUP]}
              >
                Create Account
              </Button>
            </Stack>
          )}
        </Box>
      </PageHeader>
      <PageContent isPaper maxWidth={"md"}>
        <Grid
          container
          component={"section"}
          rowSpacing={4}
          columnSpacing={4}
          pt={2}
        >
          <Grid item xs={12} sm={6}>
            <Typography
              variant={"h5"}
              component={"h2"}
              fontFamily={(theme) => theme.fontFamilyTitle}
            >
              Create Characters
            </Typography>
            <Typography color={"textSecondary"} maxWidth={"50ch"}>
              Create as many characters as you want, and track their assets,
              progress tracks, notes, and more on our character sheet.
              Characters you make are stored in our database and synced across
              devices.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box
              border={(theme) => `1px solid ${theme.palette.divider}`}
              component={"img"}
              src={getPublicAssetPath("CharacterSheet.webp")}
              alt={`Screenshot of a character sheet in ${appName}`}
              width={"100%"}
              borderRadius={(theme) => `${theme.shape.borderRadius}px`}
            />
          </Grid>
          <Grid item xs={12}>
            <ExampleStatsSection />
          </Grid>
        </Grid>
        <Grid
          container
          component={"section"}
          rowSpacing={4}
          columnSpacing={4}
          pt={8}
          flexDirection={"row-reverse"}
        >
          <Grid item xs={12} sm={6}>
            <Typography
              variant={"h5"}
              component={"h2"}
              fontFamily={(theme) => theme.fontFamilyTitle}
            >
              Join Campaigns
            </Typography>
            <Typography color={"textSecondary"} maxWidth={"50ch"}>
              Playing with a group? Create a campaign to share a supply track,
              progress tracks, NPCs, Locations, and more between players.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box
              border={(theme) => `1px solid ${theme.palette.divider}`}
              component={"img"}
              src={getPublicAssetPath("CampaignView.webp")}
              alt={`Screenshot of a campaign in ${appName}`}
              width={"100%"}
              borderRadius={(theme) => `${theme.shape.borderRadius}px`}
            />
          </Grid>
          <Grid item xs={12}>
            <ExampleSupplySection />
          </Grid>
        </Grid>
        <Grid
          container
          component={"section"}
          rowSpacing={4}
          columnSpacing={4}
          pt={8}
        >
          <Grid item xs={12} sm={6}>
            <Typography
              variant={"h5"}
              component={"h2"}
              fontFamily={(theme) => theme.fontFamilyTitle}
            >
              GM Tools
            </Typography>
            <Typography color={"textSecondary"} maxWidth={"50ch"}>
              Our GM screen has everything you need to run your game. Change
              progress tracks, consult the oracle, reference moves, take notes,
              and more on our GM screen.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box
              border={(theme) => `1px solid ${theme.palette.divider}`}
              component={"img"}
              src={getPublicAssetPath("GMScreen.webp")}
              alt={
                "Screenshot of a campaign in Iron Fellowship titled Land of Ten Thousand Gods with four characters added."
              }
              width={"100%"}
              borderRadius={(theme) => `${theme.shape.borderRadius}px`}
            />
          </Grid>
          <Grid item xs={12}>
            <ExampleTrackSection />
          </Grid>
        </Grid>
        <Grid
          container
          component={"section"}
          rowSpacing={4}
          columnSpacing={4}
          pt={8}
          flexDirection={"row-reverse"}
        >
          <Grid item xs={12} sm={6}>
            <Typography
              variant={"h5"}
              component={"h2"}
              fontFamily={(theme) => theme.fontFamilyTitle}
            >
              Share Worlds
            </Typography>
            <Typography color={"textSecondary"} maxWidth={"50ch"}>
              Share your world truths, NPCs, locations, and lore between
              different singleplayer characters and campaigns you are GMing.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box
              border={(theme) => `1px solid ${theme.palette.divider}`}
              component={"img"}
              src={getPublicAssetPath("WorldSheet.webp")}
              alt={
                "Screenshot of a campaign in Iron Fellowship titled Land of Ten Thousand Gods with four characters added."
              }
              width={"100%"}
              borderRadius={(theme) => `${theme.shape.borderRadius}px`}
            />
          </Grid>
        </Grid>
        <Licensing />
      </PageContent>
    </>
  );
}
