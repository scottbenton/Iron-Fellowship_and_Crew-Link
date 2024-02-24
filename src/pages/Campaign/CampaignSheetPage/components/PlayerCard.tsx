import { Box, Button, Card, Skeleton, Typography } from "@mui/material";
import { UserAvatar } from "components/shared/UserAvatar";
import { useEffect, useState } from "react";
import { useStore } from "stores/store";

export interface PlayerCardProps {
  playerId: string;
}

export function PlayerCard(props: PlayerCardProps) {
  const { playerId } = props;
  const player = useStore((store) => store.users.userMap[playerId]?.doc);
  const loadPlayer = useStore((store) => store.users.loadUserDocument);

  const isUserGM = useStore((store) =>
    store.campaigns.currentCampaign.currentCampaign?.gmIds?.includes(
      store.auth.uid
    )
  );
  const isPlayerGM = useStore((store) =>
    store.campaigns.currentCampaign.currentCampaign?.gmIds?.includes(playerId)
  );
  const addGm = useStore(
    (store) => store.campaigns.currentCampaign.updateCampaignGM
  );
  const [gmCallLoading, setGMCallLoading] = useState(false);

  const removePlayer = useStore(
    (store) => store.campaigns.currentCampaign.removePlayerFromCampaign
  );
  const [removePlayerCallLoading, setRemovePlayerCallLoading] = useState(false);

  useEffect(() => {
    loadPlayer(playerId);
  }, [playerId, loadPlayer]);

  const handleAddGm = () => {
    setGMCallLoading(true);
    addGm(playerId)
      .catch(() => {})
      .finally(() => {
        setGMCallLoading(false);
      });
  };

  const handleRemovePlayer = () => {
    setRemovePlayerCallLoading(true);
    removePlayer(playerId)
      .catch(() => {})
      .finally(() => {
        setRemovePlayerCallLoading(false);
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
            backgroundColor: theme.palette.background.paperInlay,
          })}
        >
          <Button
            color={"inherit"}
            disabled={isPlayerGM || gmCallLoading}
            onClick={handleAddGm}
          >
            Add as GM
          </Button>
          {!isPlayerGM && (
            <Button
              color={"error"}
              disabled={removePlayerCallLoading}
              onClick={handleRemovePlayer}
            >
              Remove from Campaign
            </Button>
          )}
        </Box>
      )}
    </Card>
  );
}
