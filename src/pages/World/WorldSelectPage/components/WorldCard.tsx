import { Box, Card, CardActionArea, Skeleton, Typography } from "@mui/material";
import { constructWorldSheetPath } from "pages/World/routes";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useStore } from "stores/store";
import OpenIcon from "@mui/icons-material/ChevronRight";

export interface WorldCardProps {
  worldId: string;
}

export function WorldCard(props: WorldCardProps) {
  const { worldId } = props;

  const world = useStore((store) => store.worlds.worldMap[worldId]);
  const ownerIds = world.ownerIds;
  const worldOwnerString = useStore((store) => {
    const worldOwnersNames: string[] = [];
    store.worlds.worldMap[worldId].ownerIds.map((ownerId) => {
      const name = store.users.userMap[ownerId]?.doc?.displayName;
      if (name) {
        worldOwnersNames.push(name);
      }
    });
    return worldOwnersNames.join(", ");
  });

  const loadUsers = useStore((store) => store.users.loadUserDocuments);

  useEffect(() => {
    loadUsers(ownerIds);
  }, [ownerIds, loadUsers]);

  return (
    <Card elevation={2}>
      <CardActionArea
        component={Link}
        to={constructWorldSheetPath(worldId)}
        sx={{ p: 2, height: "100%", display: "flex", alignItems: "flex-start" }}
      >
        <Box flexGrow={1}>
          <Typography variant={"h6"}>{world.name}</Typography>
          <Typography color={"textSecondary"}>
            {worldOwnerString ? worldOwnerString : <Skeleton width={"12ch"} />}
          </Typography>
        </Box>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"flex-end"}
          alignSelf={"stretch"}
        >
          <OpenIcon />
        </Box>
      </CardActionArea>
    </Card>
  );
}
