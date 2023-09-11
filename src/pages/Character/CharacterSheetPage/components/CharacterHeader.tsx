import { Box, Chip, Stack, Typography } from "@mui/material";
import { PortraitAvatar } from "components/PortraitAvatar/PortraitAvatar";
import { InitiativeButtons } from "./InitiativeButtons";
import { StatsSection } from "./StatsSection";
import { useStore } from "stores/store";
import LinkIcon from "@mui/icons-material/Launch";
import { Link } from "react-router-dom";
import {
  CAMPAIGN_ROUTES,
  constructCampaignSheetPath,
} from "pages/Campaign/routes";

export interface CharacterHeaderProps {}

export function CharacterHeader(props: CharacterHeaderProps) {
  const characterName = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.name ?? ""
  );
  const uid = useStore((store) => store.auth.uid);
  const characterId = useStore(
    (store) => store.characters.currentCharacter.currentCharacterId ?? ""
  );

  const characterPortraitSettings = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.profileImage
  );

  const campaignId = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.campaignId
  );
  const isGM = useStore(
    (store) =>
      store.campaigns.currentCampaign.currentCampaign?.gmIds?.includes(
        store.auth.uid
      ) ?? false
  );

  return (
    <Box
      sx={[
        (theme) => ({
          position: "relative",
          mx: -3,
          px: 3,
          backgroundColor: theme.palette.primary.light,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 0.5,
          flexWrap: "wrap",
          [theme.breakpoints.down("sm")]: {
            mx: -2,
            px: 2,
          },
        }),
      ]}
    >
      <Box display={"flex"} alignItems={"center"}>
        <PortraitAvatar
          uid={uid}
          characterId={characterId}
          name={characterName}
          portraitSettings={characterPortraitSettings}
        />
        <Box display={"flex"} flexDirection={"column"} marginLeft={1}>
          <Typography
            variant={"h4"}
            lineHeight={1}
            color={"white"}
            fontFamily={(theme) => theme.fontFamilyTitle}
          >
            {characterName}
          </Typography>
          <Stack spacing={1} direction={"row"}>
            <InitiativeButtons />
            {campaignId && (
              <Chip
                size={"small"}
                color={"primary"}
                variant={"outlined"}
                icon={<LinkIcon />}
                label="Campaign"
                component={Link}
                to={constructCampaignSheetPath(
                  campaignId,
                  CAMPAIGN_ROUTES.SHEET
                )}
                clickable
              />
            )}
            {campaignId && isGM && (
              <Chip
                size={"small"}
                color={"primary"}
                icon={<LinkIcon />}
                label={"GM Screen"}
                component={Link}
                to={constructCampaignSheetPath(
                  campaignId,
                  CAMPAIGN_ROUTES.GM_SCREEN
                )}
                clickable
              />
            )}
          </Stack>
        </Box>
      </Box>
      <StatsSection />
    </Box>
  );
}
