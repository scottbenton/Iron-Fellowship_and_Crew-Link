import {
  Box,
  Button,
  Card,
  CardActionArea,
  Fab,
  Grid,
  Hidden,
  LinearProgress,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { constructWorldSheetUrl, paths, ROUTES } from "../../routes";
import AddWorldIcon from "@mui/icons-material/Add";
import { useWorldsStore } from "stores/worlds.store";

export function WorldSelectPage() {
  const worlds = useWorldsStore((store) => store.worlds);
  const worldIds = useWorldsStore((store) =>
    Object.keys(store.worlds).sort((w1, w2) =>
      store.worlds[w2].name.localeCompare(store.worlds[w1].name)
    )
  );
  const loading = useWorldsStore((store) => store.loading);

  if (loading) {
    return (
      <LinearProgress
        sx={{
          width: "100vw",
          position: "absolute",
          left: 0,
          marginTop: -3,
        }}
      />
    );
  }

  return (
    <>
      {!worldIds || worldIds.length === 0 ? (
        <EmptyState
          imageSrc="/assets/nature.svg"
          title={"No Worlds"}
          message={"Create your first world to get started"}
          callToAction={
            <Button
              component={Link}
              to={paths[ROUTES.WORLD_CREATE]}
              variant={"contained"}
              endIcon={<AddWorldIcon />}
            >
              Create a World
            </Button>
          }
        />
      ) : (
        <>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            pb={2}
          >
            <Typography
              variant={"h5"}
              fontFamily={(theme) => theme.fontFamilyTitle}
            >
              Your Worlds
            </Typography>
            <Hidden smDown>
              <Button
                component={Link}
                to={paths[ROUTES.WORLD_CREATE]}
                variant={"contained"}
                endIcon={<AddWorldIcon />}
              >
                Create a World
              </Button>
            </Hidden>
          </Box>
          <Grid container spacing={2}>
            {worldIds.map((worldId, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card variant={"outlined"}>
                  <CardActionArea
                    component={Link}
                    to={constructWorldSheetUrl(worldId)}
                    sx={{ p: 2 }}
                  >
                    <Box display={"flex"} alignItems={"center"}>
                      <Typography variant={"h6"}>
                        {worlds[worldId].name}
                      </Typography>
                    </Box>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Hidden smUp>
            <Box height={80} />
          </Hidden>
          <Hidden smUp>
            <Fab
              component={Link}
              to={paths[ROUTES.WORLD_CREATE]}
              color={"secondary"}
              sx={(theme) => ({
                position: "fixed",
                bottom: theme.spacing(9),
                right: theme.spacing(2),
              })}
            >
              <AddWorldIcon />
            </Fab>
          </Hidden>
        </>
      )}
    </>
  );
}
