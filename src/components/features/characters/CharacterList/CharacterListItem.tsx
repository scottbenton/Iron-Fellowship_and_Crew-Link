import { Box, Card, CardActionArea, Typography } from "@mui/material";
import { PortraitAvatar } from "components/features/characters/PortraitAvatar/PortraitAvatar";
import { PropsWithChildren, ReactNode } from "react";
import { useStore } from "stores/store";
import { CharacterDocument } from "types/Character.type";
import OpenIcon from "@mui/icons-material/ChevronRight";
import { LinkComponent } from "components/shared/LinkComponent";

export interface CharacterListItemProps {
  characterId: string;
  character: CharacterDocument;
  actions?: (characterId: string) => ReactNode;
  href?: string;
  usePlayerNameAsSecondaryText?: boolean;
  raised?: boolean;
}

export function CharacterListItem(props: CharacterListItemProps) {
  const {
    characterId,
    character,
    actions,
    href,
    usePlayerNameAsSecondaryText,
    raised,
  } = props;
  const { name, profileImage, campaignId, uid } = character;

  const campaign = useStore((store) =>
    campaignId ? store.campaigns.campaignMap[campaignId] : undefined
  );

  const userDoc = useStore((store) => store.users.userMap[uid]?.doc);

  const Wrapper = ({ children }: PropsWithChildren) =>
    !href ? (
      <Box display={"flex"} alignItems={"flex-start"} p={2} height={"100%"}>
        {children}
      </Box>
    ) : (
      <CardActionArea
        href={href}
        LinkComponent={LinkComponent}
        sx={{ height: "100%" }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            p: 2,
            height: "100%",
          }}
        >
          {children}
        </Box>
      </CardActionArea>
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
    >
      <Wrapper>
        <PortraitAvatar
          uid={uid}
          characterId={characterId}
          name={name}
          portraitSettings={profileImage}
          size={"medium"}
          colorful
        />
        <Box
          display={"flex"}
          flexDirection={"column"}
          ml={2}
          pt={1}
          flexGrow={1}
        >
          <Typography variant={"h6"} lineHeight={1.25} component={"p"}>
            {name}
          </Typography>

          {usePlayerNameAsSecondaryText && (
            <Typography
              variant={"subtitle2"}
              component={"p"}
              // mt={-1}
              color={(theme) => theme.palette.text.secondary}
            >
              {userDoc ? userDoc.displayName : "Loading"}
            </Typography>
          )}

          {!usePlayerNameAsSecondaryText && campaignId ? (
            <Typography
              variant={"subtitle2"}
              component={"div"}
              // mt={-1}
              color={(theme) => theme.palette.text.secondary}
            >
              {campaign ? campaign.name : "Campaign: Loading"}
            </Typography>
          ) : null}
        </Box>
        {href && (
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"flex-end"}
            alignSelf={"stretch"}
          >
            <OpenIcon aria-hidden />
          </Box>
        )}
      </Wrapper>
      {actions && (
        <Box
          display={"flex"}
          justifyContent={"flex-end"}
          sx={(theme) => ({
            backgroundColor: theme.palette.background.paperInlay,
          })}
        >
          {actions(characterId)}
        </Box>
      )}
    </Card>
  );
}
