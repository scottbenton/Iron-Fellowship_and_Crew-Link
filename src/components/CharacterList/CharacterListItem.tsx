import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import { PortraitAvatar } from "components/PortraitAvatar/PortraitAvatar";
import { PropsWithChildren, ReactNode } from "react";
import { Link } from "react-router-dom";
import { useStore } from "stores/store";
import { CharacterDocument } from "types/Character.type";
import OpenIcon from "@mui/icons-material/ChevronRight";

export interface CharacterListItemProps {
  characterId: string;
  character: CharacterDocument;
  actions?: (characterId: string) => ReactNode;
  href?: string;
  usePlayerNameAsSecondaryText?: boolean;
  raised?: boolean;
}

function LinkComponent(props: PropsWithChildren<{ href: string }>) {
  const { href, ...rest } = props;
  console.debug(props);
  return <Link to={href} {...rest} />;
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
      <Box display={"flex"} alignItems={"flex-start"} p={2}>
        {children}
      </Box>
    ) : (
      <CardActionArea href={href} LinkComponent={LinkComponent}>
        <Box sx={{ display: "flex", alignItems: "flex-start", p: 2 }}>
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
        <Box display={"flex"} flexDirection={"column"} ml={2} pt={1}>
          <Typography variant={"h6"} lineHeight={1.25}>
            {name}
          </Typography>

          {usePlayerNameAsSecondaryText && (
            <Typography
              variant={"subtitle2"}
              component={"div"}
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
            flexGrow={1}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"flex-end"}
            alignSelf={"stretch"}
          >
            <OpenIcon />
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
