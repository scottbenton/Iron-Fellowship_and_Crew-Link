import { Avatar, Box, Button, Card, Skeleton, Typography } from "@mui/material";
import { UserAvatar } from "components/UserAvatar";
import { useEffect, useState } from "react";
import { useStore } from "stores/store";

export interface PlayerCardProps {
  playerId: string;
}

export function PlayerCard(props: PlayerCardProps) {
  const { playerId } = props;
  const player = useStore((store) => store.users.userMap[playerId]?.doc);
  const loadPlayer = useStore((store) => store.users.loadUserDocument);
  const [gmCallLoading, setGMCallLoading] = useState(false);

  useEffect(() => {
    loadPlayer(playerId);
  }, [playerId, loadPlayer]);

  const isUserGM = useStore((store) =>
    store.campaigns.currentCampaign.currentCampaign?.gmIds?.includes(
      store.auth.uid
    )
  );

  const addGm = useStore(
    (store) => store.campaigns.currentCampaign.updateCampaignGM
  );

  const isPlayerGM = useStore((store) =>
    store.campaigns.currentCampaign.currentCampaign?.gmIds?.includes(playerId)
  );

  const handleAddGm = () => {
    setGMCallLoading(true);
    addGm(playerId)
      .catch((e) => {})
      .finally(() => {
        setGMCallLoading(false);
      });
  };

  return (
    <Card variant={"outlined"}>
      <Box display={"flex"} alignItems={"center"} p={2}>
        <UserAvatar uid={playerId} />
        <Typography variant={"h6"} ml={2} flexGrow={1}>
          {player ? player.displayName ?? "Unknown Player" : <Skeleton />}
        </Typography>
      </Box>
      {isUserGM && (
        <Box
          display={"flex"}
          justifyContent={"flex-end"}
          sx={(theme) => ({
            backgroundColor: theme.palette.grey[100],
            color: "white",
          })}
        >
          <Button disabled={isPlayerGM || gmCallLoading} onClick={handleAddGm}>
            Add as GM
          </Button>
        </Box>
      )}
    </Card>
  );
}
