import { Box, Card, Typography } from "@mui/material";
import { PortraitAvatar } from "components/PortraitAvatar/PortraitAvatar";
import { ReactNode } from "react";
import { useCampaignStore } from "stores/campaigns.store";
import { useMiscDataStore } from "stores/miscData.store";
import { CharacterDocument } from "types/Character.type";
import { UserDocument } from "types/User.type";

export interface CharacterListItemProps {
  characterId: string;
  character: CharacterDocument;
  actions?: (characterId: string) => ReactNode;
  usePlayerNameAsSecondaryText?: boolean;
}

export function CharacterListItem(props: CharacterListItemProps) {
  const { characterId, character, actions, usePlayerNameAsSecondaryText } =
    props;
  const { name, profileImage, campaignId, uid } = character;

  const campaign = useCampaignStore((store) =>
    campaignId ? store.campaigns[campaignId] : undefined
  );

  const userDoc: UserDocument | undefined = useMiscDataStore(
    (store) => store.userDocs[uid]
  );

  return (
    <Card
      variant={"outlined"}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Box display={"flex"} alignItems={"center"} p={2}>
          <PortraitAvatar
            uid={uid}
            characterId={characterId}
            name={name}
            portraitSettings={profileImage}
            size={"small"}
            colorful
          />
          <Box display={"flex"} flexDirection={"column"} ml={2}>
            <Typography variant={"h6"}>{name}</Typography>

            {usePlayerNameAsSecondaryText && (
              <Typography
                variant={"subtitle2"}
                mt={-1}
                color={(theme) => theme.palette.text.secondary}
              >
                {userDoc ? userDoc.displayName : "Loading"}
              </Typography>
            )}

            {!usePlayerNameAsSecondaryText && campaignId ? (
              <Typography
                variant={"subtitle2"}
                mt={-1}
                color={(theme) => theme.palette.text.secondary}
              >
                {campaign ? campaign.name : "Campaign: Loading"}
              </Typography>
            ) : null}
          </Box>
        </Box>
      </Box>
      {actions && (
        <Box
          display={"flex"}
          justifyContent={"flex-end"}
          sx={(theme) => ({
            backgroundColor: theme.palette.grey[100],
            color: "white",
          })}
        >
          {actions(characterId)}
        </Box>
      )}
    </Card>
  );
}
