import { Box, GlobalStyles, Slide, Typography } from "@mui/material";
import { useListenToCharacter } from "./hooks/useListenToCharacter";
import { PortraitAvatar } from "components/PortraitAvatar/PortraitAvatar";
import HealthIcon from "@mui/icons-material/Favorite";
import SpiritIcon from "@mui/icons-material/Whatshot";
import { useEffect, useRef, useState } from "react";
import { Roll } from "types/DieRolls.type";
import { Unsubscribe } from "firebase/firestore";
import { listenToMostRecentCharacterLog } from "api-calls/game-log/listenToMostRecentCharacterLog";
import { RollCard } from "./components/RollCard";
import { INITIATIVE_STATUS } from "types/Character.type";
import InitiativeIcon from "@mui/icons-material/Shield";
import NoInitiativeIcon from "@mui/icons-material/RemoveModerator";
import { useSearchParams } from "react-router-dom";

export function CharacterCardPage() {
  const [params, setParams] = useSearchParams();
  const isReversed = params.get("reverse") === "true";
  const { characterId, character } = useListenToCharacter();
  const campaignId = character?.campaignId;

  const rollContainerRef = useRef<HTMLDivElement>(null);

  const [isRollVisible, setIsRollVisible] = useState(false);
  const [latestRoll, setLatestRoll] = useState<Roll>();

  useEffect(() => {
    let unsubscribe: Unsubscribe;

    if (characterId) {
      unsubscribe = listenToMostRecentCharacterLog({
        isGM: false,
        campaignId,
        characterId,
        onRoll: (rollId, roll) => {
          setLatestRoll(roll);
          setIsRollVisible(true);
        },
        onError: (error) => {
          console.error(error);
        },
      });
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [characterId, campaignId]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsRollVisible(false);
    }, 10 * 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [latestRoll]);

  if (!character) return null;

  const userId = character.uid;

  return (
    <>
      <GlobalStyles
        styles={{
          body: {
            backgroundColor: "transparent",
          },
          header: {
            display: "none !important",
          },
        }}
      />
      <Box
        display={"flex"}
        alignItems={"flex-end"}
        px={8}
        py={6}
        height={"100vh"}
        width={"100%"}
        overflow={"hidden"}
      >
        <Box
          display={"flex"}
          flexGrow={1}
          justifyContent={isReversed ? "flex-end" : "flex-start"}
          sx={{
            transform: "skew(-.35rad)",
            flexWrap: "wrap-reverse",
          }}
        >
          <Box
            sx={{
              transform: "skew(.35rad)",
              position: "relative",
              zIndex: 6,
            }}
          >
            <PortraitAvatar
              uid={userId ?? ""}
              characterId={characterId ?? ""}
              name={character?.name}
              portraitSettings={character?.profileImage}
              size={"huge"}
              rounded
              darkBorder
            />
          </Box>

          <Box
            sx={(theme) => ({
              marginLeft: -10,
              display: "inline",
              backgroundColor: theme.palette.grey[800],
              color: theme.palette.common.white,
              paddingLeft: 14,
              paddingRight: 4,
              borderRadius: 4,
              py: 2,
              my: 2,
              minWidth: 430,
              position: "relative",
              zIndex: 5,
            })}
          >
            <Box
              sx={{
                transform: "skew(.35rad)",
              }}
            >
              <Box>
                <Typography
                  variant={"h2"}
                  fontFamily={(theme) => theme.fontFamilyTitle}
                  textOverflow={"ellipsis"}
                  overflow={"hidden"}
                  whiteSpace={"nowrap"}
                >
                  {character.name}
                </Typography>
              </Box>
              <Box display={"flex"}>
                <Box display={"flex"} alignItems={"center"}>
                  <HealthIcon
                    sx={(theme) => ({
                      width: 50,
                      height: 50,
                      color: theme.palette.primary.main,
                    })}
                  />
                  <Typography variant={"h3"} ml={1}>
                    {character.health}
                  </Typography>
                </Box>
                <Box display={"flex"} alignItems={"center"} ml={4}>
                  <SpiritIcon
                    sx={(theme) => ({
                      width: 50,
                      height: 50,
                      color: theme.palette.info.light,
                    })}
                  />
                  <Typography variant={"h3"} ml={1}>
                    {character.spirit}
                  </Typography>
                </Box>
              </Box>

              {character.initiativeStatus &&
                character.initiativeStatus !==
                  INITIATIVE_STATUS.OUT_OF_COMBAT && (
                  <Box
                    position={"absolute"}
                    display={"flex"}
                    py={0.5}
                    pl={1}
                    pr={2}
                    ml={-1}
                    mt={1}
                    color={(theme) =>
                      character.initiativeStatus ===
                      INITIATIVE_STATUS.HAS_INITIATIVE
                        ? theme.palette.success.contrastText
                        : theme.palette.error.contrastText
                    }
                    bgcolor={(theme) =>
                      character.initiativeStatus ===
                      INITIATIVE_STATUS.HAS_INITIATIVE
                        ? theme.palette.success.main
                        : theme.palette.error.main
                    }
                    borderRadius={(theme) => theme.shape.borderRadius}
                  >
                    {character.initiativeStatus ===
                    INITIATIVE_STATUS.HAS_INITIATIVE ? (
                      <InitiativeIcon
                        sx={(theme) => ({
                          width: 50,
                          height: 50,
                        })}
                      />
                    ) : (
                      <NoInitiativeIcon
                        sx={(theme) => ({
                          width: 50,
                          height: 50,
                        })}
                      />
                    )}
                    <Typography variant={"h4"} ml={1}>
                      {getStatusText(character.initiativeStatus)}
                    </Typography>
                  </Box>
                )}
            </Box>
          </Box>
          <Box
            my={2}
            display={"flex"}
            alignItems={"stretch"}
            ref={rollContainerRef}
            maxWidth={500}
            justifyContent={isReversed ? "center" : "flex-start"}
            width={"100%"}
          >
            {latestRoll && (
              <Slide
                in={isRollVisible}
                direction={isReversed ? "left" : "right"}
                container={rollContainerRef.current}
              >
                <Box
                  sx={(theme) => ({
                    backgroundColor: theme.palette.grey[800],
                    color: theme.palette.common.white,
                    px: 6,
                    borderRadius: 4,
                    py: 2,
                    minWidth: 200,
                    ml: 4,
                    display: "flex",
                    alignItems: "center",
                  })}
                >
                  <Box
                    sx={{
                      transform: "skew(.35rad)",
                    }}
                  >
                    <RollCard roll={latestRoll} />
                  </Box>
                </Box>
              </Slide>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}

const getStatusText = (status: INITIATIVE_STATUS): string => {
  switch (status) {
    case INITIATIVE_STATUS.HAS_INITIATIVE:
      return "Initiative";
    case INITIATIVE_STATUS.DOES_NOT_HAVE_INITIATIVE:
      return "No Initiative";
    case INITIATIVE_STATUS.OUT_OF_COMBAT:
      return "Out of Combat";
  }
};
