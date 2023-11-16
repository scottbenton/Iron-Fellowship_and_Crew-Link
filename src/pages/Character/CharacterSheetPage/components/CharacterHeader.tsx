import { Box, Button, Chip, Fab, Stack, Typography } from "@mui/material";
import { PortraitAvatar } from "components/features/characters/PortraitAvatar/PortraitAvatar";
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
import { useNewCharacterMobileView } from "hooks/featureFlags/useNewCharacterMobileView";
import { useEffect, useRef, useState } from "react";
import MovesIcon from "@mui/icons-material/DirectionsRun";
import { OracleIcon } from "assets/OracleIcon";
import {
  MOVE_AND_ORACLE_DRAWER_SECTIONS,
  MoveAndOracleDrawer,
} from "components/features/charactersAndCampaigns/MoveAndOracleDrawer";

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

  const isMobile = useIsMobile();
  const newViewEnabled = useNewCharacterMobileView();

  const [openSection, setOpenSection] =
    useState<MOVE_AND_ORACLE_DRAWER_SECTIONS>();

  const headerRef = useRef<HTMLElement>(null);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        setIsStuck(rect.top <= 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Box
      ref={headerRef}
      sx={(theme) =>
        isMobile && newViewEnabled
          ? {
              position: "sticky",
              top: 0,
              zIndex: theme.zIndex.appBar,
            }
          : {}
      }
    >
      <Box
        id={"character-header"}
        sx={[
          (theme) => ({
            top: 0,
            mx: -3,
            px: 3,
            backgroundColor:
              theme.palette.grey[theme.palette.mode === "light" ? 600 : 800],
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 0.5,
            overflowX: "auto",
            flexWrap: "wrap",
            transition: theme.transitions.create(["box-shadow"]),
            ...(isMobile && newViewEnabled
              ? {
                  pb: 5,
                  pt: 2,
                  boxShadow: isStuck ? theme.shadows[8] : undefined,
                }
              : {}),
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
              {campaignId && !isMobile && (
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
        {(!isMobile || !newViewEnabled) && <StatsSection />}
      </Box>
      {isMobile && newViewEnabled && (
        <>
          <Box display={"flex"} justifyContent={"center"} gap={2} mt={-4}>
            <Fab
              variant={"extended"}
              color={"primary"}
              sx={{ borderRadius: 4 }}
              onClick={() =>
                setOpenSection(MOVE_AND_ORACLE_DRAWER_SECTIONS.MOVES)
              }
            >
              <MovesIcon sx={{ mr: 1 }} />
              Moves
            </Fab>
            <Fab
              variant={"extended"}
              color={"primary"}
              sx={{ borderRadius: 4 }}
              onClick={() =>
                setOpenSection(MOVE_AND_ORACLE_DRAWER_SECTIONS.ORACLES)
              }
            >
              <OracleIcon sx={{ mr: 1 }} />
              Oracles
            </Fab>
          </Box>
          <MoveAndOracleDrawer
            openSection={openSection}
            closeSection={() => setOpenSection(undefined)}
          />
        </>
      )}
    </Box>
  );
}
