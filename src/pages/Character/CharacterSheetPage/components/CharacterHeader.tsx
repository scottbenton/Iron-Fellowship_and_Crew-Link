import {
  Box,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { InitiativeButtons } from "./InitiativeButtons";
import { StatsSection } from "./StatsSection";
import { useStore } from "stores/store";
import LinkIcon from "@mui/icons-material/Launch";
import { Link } from "react-router-dom";
import {
  CAMPAIGN_ROUTES,
  constructCampaignSheetPath,
} from "pages/Campaign/routes";
import { useIsMobile } from "hooks/useIsMobile";

import { StickyHeader } from "components/shared/StickyHeader";
import { CharacterHeaderMoveOracleButtons } from "./CharacterHeaderMoveOracleButtons";
import { CharacterPortrait } from "./CharacterPortrait";
import CharacterSettingsIcon from "@mui/icons-material/ManageAccounts";
import { CharacterSettingsMenu } from "./CharacterSettings/CharacterSettingsMenu";
import { useState } from "react";

export function CharacterHeader() {
  const characterName = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.name ?? ""
  );

  const campaignId = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.campaignId
  );

  const theme = useTheme();
  const isMobile = useIsMobile();
  const isSmall = useMediaQuery(theme.breakpoints.down("md")) && !isMobile;
  const isMedium =
    useMediaQuery(theme.breakpoints.down("lg")) && !isMobile && !isSmall;
  const isLargerThanMedium = useMediaQuery(theme.breakpoints.up("lg"));

  const [characterSettingsMenuParent, setCharacterSettingsMenuParent] =
    useState<HTMLElement | null>(null);

  return (
    <StickyHeader
      maxStickyBreakpoint={"sm"}
      outerChildren={
        (isMobile || isSmall) && <CharacterHeaderMoveOracleButtons />
      }
    >
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        pt={isMobile ? 1 : undefined}
      >
        <Box display={"flex"} alignItems={"center"} flexGrow={1}>
          <CharacterPortrait />
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
              {campaignId && !isMobile && (
                <Chip
                  size={"small"}
                  color={"primary"}
                  variant={"filled"}
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
            </Stack>
          </Box>
        </Box>
        <Box display={"flex"} alignItems={"center"}>
          {isLargerThanMedium && <StatsSection />}
          <Tooltip title={"Character Settings"}>
            <IconButton
              sx={{ ml: 2 }}
              color={"inherit"}
              onClick={(evt) =>
                setCharacterSettingsMenuParent(evt.currentTarget)
              }
            >
              <CharacterSettingsIcon />
            </IconButton>
          </Tooltip>
          <CharacterSettingsMenu
            open={!!characterSettingsMenuParent}
            onClose={() => setCharacterSettingsMenuParent(null)}
            anchorElement={characterSettingsMenuParent}
          />
        </Box>
      </Box>
      {(isSmall || isMedium) && (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          mt={1}
        >
          <StatsSection />
        </Box>
      )}
    </StickyHeader>
  );
}
