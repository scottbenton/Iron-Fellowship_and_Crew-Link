import { Box, Button, Card, Stack, Typography } from "@mui/material";
import { CampaignType } from "api-calls/campaign/_campaign.type";
import { UserAvatar } from "components/shared/UserAvatar";
import { useCampaignType } from "hooks/useCampaignType";
import { useStore } from "stores/store";

export interface UserCardProps {
  uid: string;
}

export function UserCard(props: UserCardProps) {
  const { uid } = props;

  const currentUid = useStore((store) => store.auth.uid);

  const user = useStore((store) => store.users.userMap[uid]);
  const gmIds = useStore(
    (store) => store.campaigns.currentCampaign.currentCampaign?.gmIds ?? []
  );

  const { campaignType, showGuidedPlayerView } = useCampaignType();

  const updateGuide = useStore(
    (store) => store.campaigns.currentCampaign.updateCampaignGM
  );
  const removeUser = useStore(
    (store) => store.campaigns.currentCampaign.removePlayerFromCampaign
  );

  return (
    <Card variant={"outlined"} sx={{ height: "100%" }}>
      <Box display={"flex"} alignItems={"center"} p={2}>
        <UserAvatar uid={uid} />
        <Box ml={1}>
          <Typography variant={"h6"} component={"h3"} lineHeight={1}>
            {user.doc?.displayName}
          </Typography>
          {campaignType === CampaignType.Guided && gmIds.includes(uid) && (
            <Typography color={"textSecondary"}>Guide</Typography>
          )}
        </Box>
      </Box>
      {campaignType === CampaignType.Guided &&
        uid !== currentUid &&
        !gmIds.includes(uid) &&
        !showGuidedPlayerView && (
          <Stack direction={"row"} spacing={1} justifyContent={"flex-end"}>
            <Button color={"error"} onClick={() => removeUser(uid)}>
              Remove
            </Button>
            <Button color={"inherit"} onClick={() => updateGuide(uid)}>
              Make Guide
            </Button>
          </Stack>
        )}
    </Card>
  );
}
