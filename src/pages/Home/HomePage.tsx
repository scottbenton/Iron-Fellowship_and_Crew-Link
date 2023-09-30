import { Box, Typography, Grid, Button, Stack } from "@mui/material";
import { PageContent, PageHeader } from "components/shared/Layout";
import {
  CHARACTER_ROUTES,
  constructCharacterPath,
} from "pages/Character/routes";
import { Link } from "react-router-dom";
import { BASE_ROUTES, basePaths } from "routes";
import { useStore } from "stores/store";

export function HomePage() {
  const isLoggedIn = useStore((store) => !!store.auth.user);

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
            fontFamily={(theme) => theme.fontFamilyTitle}
            color={(theme) => theme.palette.common.white}
          >
            Welcome{isLoggedIn && " back"} to Iron Fellowship
          </Typography>
          <Typography
            textAlign={"center"}
            variant={"h6"}
            fontFamily={(theme) => theme.fontFamilyTitle}
            color={(theme) => theme.palette.common.white}
          >
            Get playing with your Ironsworn group in minutes
          </Typography>
          {isLoggedIn ? (
            <Button
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
                color={"primary"}
                component={Link}
                to={basePaths[BASE_ROUTES.LOGIN]}
              >
                Login
              </Button>
              <Button
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
        <Grid container rowSpacing={4} columnSpacing={4} pt={2}>
          <Grid item xs={12} sm={6}>
            <Typography
              variant={"h5"}
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
              src={"/assets/CharacterSheet.png"}
              alt={
                "Screenshot of a character sheet in Iron Fellowship for a character named Eirik"
              }
              width={"100%"}
              borderRadius={(theme) => `${theme.shape.borderRadius}px`}
            />
          </Grid>
        </Grid>
        <Grid
          container
          rowSpacing={4}
          columnSpacing={4}
          pt={8}
          flexDirection={"row-reverse"}
        >
          <Grid item xs={12} sm={6}>
            <Typography
              variant={"h5"}
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
              src={"/assets/CampaignView.png"}
              alt={
                "Screenshot of a campaign in Iron Fellowship titled Land of Ten Thousand Gods with four characters added."
              }
              width={"100%"}
              borderRadius={(theme) => `${theme.shape.borderRadius}px`}
            />
          </Grid>
        </Grid>
        <Grid container rowSpacing={4} columnSpacing={4} pt={8}>
          <Grid item xs={12} sm={6}>
            <Typography
              variant={"h5"}
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
              src={"/assets/GMScreen.png"}
              alt={
                "Screenshot of a campaign in Iron Fellowship titled Land of Ten Thousand Gods with four characters added."
              }
              width={"100%"}
              borderRadius={(theme) => `${theme.shape.borderRadius}px`}
            />
          </Grid>
        </Grid>
        <Grid
          container
          rowSpacing={4}
          columnSpacing={4}
          pt={8}
          flexDirection={"row-reverse"}
        >
          <Grid item xs={12} sm={6}>
            <Typography
              variant={"h5"}
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
              src={"/assets/WorldSheet.png"}
              alt={
                "Screenshot of a campaign in Iron Fellowship titled Land of Ten Thousand Gods with four characters added."
              }
              width={"100%"}
              borderRadius={(theme) => `${theme.shape.borderRadius}px`}
            />
          </Grid>
        </Grid>
        <Box
          display={"flex"}
          alignItems={"center"}
          flexDirection={"column"}
          mb={2}
        >
          <Typography
            textAlign={"center"}
            variant={"h5"}
            fontFamily={(theme) => theme.fontFamilyTitle}
            mt={8}
          >
            Ironsworn Licensing
          </Typography>
          <Typography
            maxWidth={"50ch"}
            color={"textSecondary"}
            textAlign={"center"}
          >
            This work is based on{" "}
            <a href={"https://www.ironswornrpg.com"}>Ironsworn</a>, created by
            Shawn Tomkin, and licensed for our use under the{" "}
            <a href={"https://creativecommons.org/licenses/by-nc-sa/4.0/"}>
              Creative Commons Attribution-NonCommercial-ShareAlike 4.0
              International license.
            </a>
          </Typography>
        </Box>
      </PageContent>
    </>
  );
}
