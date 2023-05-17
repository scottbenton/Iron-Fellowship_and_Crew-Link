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
import { EmptyState } from "components/EmptyState/EmptyState";
import AddWorldIcon from "@mui/icons-material/Add";
import { useWorldsStore } from "stores/worlds.store";
import { useAuth } from "providers/AuthProvider";
import {
  WORLD_ROUTES,
  constructWorldPath,
  constructWorldSheetPath,
} from "../routes";
import { PageContent, PageHeader } from "components/Layout";
import { WorldCard } from "./components/WorldCard";

export function WorldSelectPage() {
  const worlds = useWorldsStore((store) => store.worlds);
  const worldIds = useWorldsStore((store) =>
    Object.keys(store.worlds).sort((w1, w2) =>
      store.worlds[w2].name.localeCompare(store.worlds[w1].name)
    )
  );
  const loading = useWorldsStore((store) => store.loading);

  const uid = useAuth().user?.uid;

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

  if (!uid) return null;

  return (
    <>
      <PageHeader
        label={"Your Worlds"}
        actions={
          <Hidden smDown>
            <Button
              component={Link}
              to={constructWorldPath(WORLD_ROUTES.CREATE)}
              variant={"contained"}
              color={"secondary"}
              endIcon={<AddWorldIcon />}
            >
              Create a World
            </Button>
          </Hidden>
        }
      />
      <PageContent isPaper={!worldIds || worldIds.length === 0}>
        {!worldIds || worldIds.length === 0 ? (
          <EmptyState
            imageSrc="/assets/nature.svg"
            title={"Create your First World"}
            message={
              "Worlds allow you to share location notes and truths across multiple characters or campaigns."
            }
            callToAction={
              <Button
                component={Link}
                to={constructWorldPath(WORLD_ROUTES.CREATE)}
                variant={"contained"}
                endIcon={<AddWorldIcon />}
              >
                Create a World
              </Button>
            }
          />
        ) : (
          <Grid container spacing={2}>
            {worldIds.map((worldId, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <WorldCard worldId={worldId} world={worlds[worldId]} />
              </Grid>
            ))}
          </Grid>
        )}
        <Hidden smUp>
          <Box height={80} />
        </Hidden>
        <Hidden smUp>
          <Fab
            component={Link}
            to={constructWorldPath(WORLD_ROUTES.CREATE)}
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
      </PageContent>
    </>
  );
}
