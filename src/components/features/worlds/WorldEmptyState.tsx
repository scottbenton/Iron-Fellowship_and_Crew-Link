import {
  Box,
  Button,
  Card,
  CardActionArea,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { constructWorldSheetPath } from "pages/World/routes";
import { useNavigate } from "react-router-dom";
import { World } from "types/World.type";
import { EmptyState } from "../../shared/EmptyState/EmptyState";
import { useStore } from "stores/store";

export interface WorldEmptyStateProps {
  isGM?: boolean;
  isMultiplayer?: boolean;
  worldsToChooseFrom?: World[];
  onChooseWorld?: (index: number) => void;
  worldUpdateLoading?: boolean;
  isOnWorldTab?: boolean;
}

export function WorldEmptyState(props: WorldEmptyStateProps) {
  const {
    isGM,
    isMultiplayer,
    worldsToChooseFrom,
    onChooseWorld,
    worldUpdateLoading,
    isOnWorldTab,
  } = props;

  const navigate = useNavigate();

  const createWorld = useStore((store) => store.worlds.createWorld);
  const handleWorldCreate = () => {
    createWorld()
      .then((worldId) => {
        navigate(constructWorldSheetPath(worldId));
      })
      .catch(() => {});
  };

  return (
    <>
      {worldsToChooseFrom && onChooseWorld && worldsToChooseFrom.length > 0 ? (
        <Stack spacing={2} sx={{ p: 2 }}>
          <Typography
            sx={{ mb: 1 }}
            color={(theme) => theme.palette.text.secondary}
          >
            Add an existing world
          </Typography>

          {worldsToChooseFrom.map((world, index) => (
            <Card variant={"outlined"} key={world.name}>
              <CardActionArea
                onClick={() => onChooseWorld(index)}
                sx={{ p: 2 }}
                disabled={worldUpdateLoading}
              >
                {world.name}
              </CardActionArea>
            </Card>
          ))}
          <Divider sx={{ my: 3 }}>OR</Divider>
          <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
            <Button
              variant={"contained"}
              onClick={handleWorldCreate}
              disabled={worldUpdateLoading}
            >
              Create a new World
            </Button>
          </Box>
        </Stack>
      ) : (
        <EmptyState
          imageSrc={"/assets/nature.svg"}
          title={"No Worlds Found"}
          message={
            isMultiplayer && !isGM
              ? "No world found. Your GM can add a world to the campaign in the GM Screen."
              : `Worlds allow you to share locations, NPCs, and world truths across different campaigns and characters. ${
                  !isOnWorldTab
                    ? `You can add a world from the world tab ${
                        isMultiplayer
                          ? "on the GM screen"
                          : "in your character sheet"
                      }.`
                    : ""
                }`
          }
          callToAction={
            isOnWorldTab && (
              <Button
                variant={"contained"}
                color={"primary"}
                onClick={handleWorldCreate}
              >
                Create a World
              </Button>
            )
          }
        />
      )}
    </>
  );
}
