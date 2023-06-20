import { Box, Card, CardActionArea, Skeleton, Typography } from "@mui/material";
import { useUserDoc } from "api/user/getUserDoc";
import { constructWorldSheetPath } from "pages/World/routes";
import { Link } from "react-router-dom";
import { World } from "types/World.type";

export interface WorldCardProps {
  world: World;
  worldId: string;
}

export function WorldCard(props: WorldCardProps) {
  const { world, worldId } = props;

  const { user, loading } = useUserDoc(world.ownerId);

  return (
    <Card elevation={2}>
      <CardActionArea
        component={Link}
        to={constructWorldSheetPath(world.ownerId, worldId)}
        sx={{ p: 2 }}
      >
        <Typography variant={"h6"}>{world.name}</Typography>
        <Typography color={"textSecondary"}>
          {user ? user.displayName : <Skeleton width={"12ch"} />}
        </Typography>
      </CardActionArea>
    </Card>
  );
}
