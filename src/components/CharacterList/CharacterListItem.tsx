import { Box, Card, Typography } from "@mui/material";
import { PortraitAvatar } from "components/PortraitAvatar/PortraitAvatar";
import { ReactNode } from "react";
import { useCampaignStore } from "stores/campaigns.store";
import { useMiscDataStore } from "stores/miscData.store";
import { useStore } from "stores/store";
import { CharacterDocument } from "types/Character.type";
import { UserDocument } from "types/User.type";

export interface CharacterListItemProps {
  characterId: string;
  character: CharacterDocument;
  actions?: (characterId: string) => ReactNode;
  usePlayerNameAsSecondaryText?: boolean;
  raised?: boolean;
}

export function CharacterListItem(props: CharacterListItemProps) {
  const {
    characterId,
    character,
    actions,
    usePlayerNameAsSecondaryText,
    raised,
  } = props;
  const { name, profileImage, campaignId, uid } = character;

  const campaign = useStore((store) =>
    campaignId ? store.campaigns.campaignMap[campaignId] : undefined
  );

  const userDoc: UserDocument | undefined = useMiscDataStore(
    (store) => store.userDocs[uid]
  );

  return (
    <Card
      variant={raised ? "elevation" : "outlined"}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
      }}
      elevation={raised ? 3 : 0}
    >
      <Box display={"flex"}>
        <Box display={"flex"} alignItems={"flex-start"} p={2}>
          <PortraitAvatar
            uid={uid}
            characterId={characterId}
            name={name}
            portraitSettings={profileImage}
            size={"medium"}
            colorful
          />
          <Box display={"flex"} flexDirection={"column"} ml={2} pt={1}>
            <Typography variant={"h6"} lineHeight={1.25}>
              {name}
            </Typography>

            {usePlayerNameAsSecondaryText && (
              <Typography
                variant={"subtitle2"}
                // mt={-1}
                color={(theme) => theme.palette.text.secondary}
              >
                {userDoc ? userDoc.displayName : "Loading"}
              </Typography>
            )}

            {!usePlayerNameAsSecondaryText && campaignId ? (
              <Typography
                variant={"subtitle2"}
                // mt={-1}
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
