import { Box, Card, Divider, GlobalStyles, Typography } from "@mui/material";
import { useListenToCharacter } from "api/characters/listenToCharacter";
import { PortraitAvatar } from "components/PortraitAvatar/PortraitAvatar";
import { useParams } from "react-router-dom";
import HealthIcon from "@mui/icons-material/Favorite";
import SpiritIcon from "@mui/icons-material/Whatshot";
import { useListenToLastCharacterRoll } from "api/characters/rolls/listenToLastCharacterRoll";
import { useEffect, useState } from "react";
import { ROLL_TYPE, Roll } from "types/DieRolls.type";
import { D6Icon } from "assets/D6Icon";
import { D10Icon } from "assets/D10Icon";
import { getRollResultLabel } from "providers/DieRollProvider/RollSnackbar/StatRollSnackbar";
import InitiativeIcon from "@mui/icons-material/Shield";
import NoInitiativeIcon from "@mui/icons-material/RemoveModerator";
import { INITIATIVE_STATUS } from "types/Character.type";

export function CharacterCardPage() {
  const { userId, characterId } = useParams();

  const character = useListenToCharacter(userId, characterId);
  const lastRoll = useListenToLastCharacterRoll(userId, characterId);

  const [visibleRoll, setVisibleRoll] = useState<Roll>();

  useEffect(() => {
    setVisibleRoll(lastRoll);

    const timeout = setTimeout(() => {
      setVisibleRoll(undefined);
    }, 10 * 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [lastRoll]);

  if (!character) return null;

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
        alignItems={"center"}
        justifyContent={"space-between"}
        py={4}
        px={4}
      >
        <Box display={"flex"} overflow={"hidden"}>
          <PortraitAvatar
            uid={userId ?? ""}
            characterId={characterId ?? ""}
            name={character?.name}
            portraitSettings={character?.profileImage}
            size={"huge"}
            colorful
            rounded
            darkBorder
          />
          <Box
            sx={(theme) => ({
              display: "inline",
              backgroundColor: theme.palette.grey[800],
              color: theme.palette.common.white,
              marginLeft: -8,
              paddingLeft: 10,
              paddingRight: 2,
              borderRadius: 16,
              flexGrow: 1,
              py: 2,
              my: 2,
            })}
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
                    color: theme.palette.grey[300],
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
                    color: theme.palette.grey[300],
                  })}
                />
                <Typography variant={"h3"} ml={1}>
                  {character.spirit}
                </Typography>
              </Box>
              <Box display={"flex"} alignItems={"center"} ml={4} width={248}>
                {character.initiativeStatus &&
                  character.initiativeStatus !==
                    INITIATIVE_STATUS.OUT_OF_COMBAT && (
                    <>
                      {character.initiativeStatus ===
                      INITIATIVE_STATUS.HAS_INITIATIVE ? (
                        <InitiativeIcon
                          sx={(theme) => ({
                            width: 50,
                            height: 50,
                            color: theme.palette.grey[300],
                          })}
                        />
                      ) : (
                        <NoInitiativeIcon
                          sx={(theme) => ({
                            width: 50,
                            height: 50,
                            color: theme.palette.grey[300],
                          })}
                        />
                      )}
                      <Typography variant={"h4"} ml={1}>
                        {getStatusText(character.initiativeStatus)}
                      </Typography>
                    </>
                  )}
              </Box>
            </Box>
          </Box>
        </Box>
        {visibleRoll && (
          <Card
            sx={(theme) => ({
              px: 4,
              py: 2,
              backgroundColor: theme.palette.primary.dark,
              color: theme.palette.primary.contrastText,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              mt: 1,
              borderRadius: 16,
            })}
          >
            <Typography
              variant={"h4"}
              fontFamily={(theme) => theme.fontFamilyTitle}
            >
              {visibleRoll.rollLabel}
            </Typography>
            <Box display={"flex"} flexDirection={"row"}>
              {visibleRoll.type === ROLL_TYPE.STAT && (
                <>
                  <Box>
                    <Box
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <D6Icon sx={{ width: 40, height: 40 }} />
                      <Typography
                        variant={"h4"}
                        ml={2}
                        color={(theme) => theme.palette.grey[200]}
                      >
                        {visibleRoll.action + (visibleRoll.modifier || 0)}
                      </Typography>
                    </Box>
                    <Box
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <D10Icon sx={{ width: 40, height: 40 }} />
                      <Typography
                        variant={"h4"}
                        ml={2}
                        color={(theme) => theme.palette.grey[200]}
                      >
                        {visibleRoll.challenge1}, {visibleRoll.challenge2}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider
                    orientation={"vertical"}
                    sx={(theme) => ({
                      alignSelf: "stretch",
                      borderColor: theme.palette.grey[400],
                      height: "auto",
                      mx: 4,
                    })}
                  />
                  <Box
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"flex-start"}
                    justifyContent={"center"}
                  >
                    <Typography
                      color={"white"}
                      variant={"h3"}
                      fontFamily={(theme) => theme.fontFamilyTitle}
                    >
                      {getRollResultLabel(visibleRoll.result)}
                    </Typography>
                    {visibleRoll.challenge1 === visibleRoll.challenge2 && (
                      <Typography
                        variant={"h5"}
                        color={(theme) => theme.palette.grey[200]}
                        fontFamily={(theme) => theme.fontFamilyTitle}
                      >
                        Doubles
                      </Typography>
                    )}
                  </Box>
                </>
              )}
              {visibleRoll.type === ROLL_TYPE.TRACK_PROGRESS && (
                <>
                  <Box>
                    <Box
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <Typography
                        variant={"h4"}
                        color={(theme) => theme.palette.grey[200]}
                      >
                        Progress: {visibleRoll.trackProgress}
                      </Typography>
                    </Box>
                    <Box
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <D10Icon sx={{ width: 40, height: 40 }} />
                      <Typography
                        variant={"h4"}
                        ml={2}
                        color={(theme) => theme.palette.grey[200]}
                      >
                        {visibleRoll.challenge1}, {visibleRoll.challenge2}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider
                    orientation={"vertical"}
                    sx={(theme) => ({
                      alignSelf: "stretch",
                      borderColor: theme.palette.grey[400],
                      height: "auto",
                      mx: 4,
                    })}
                  />
                  <Box
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"flex-start"}
                    justifyContent={"center"}
                  >
                    <Typography
                      color={"white"}
                      variant={"h3"}
                      fontFamily={(theme) => theme.fontFamilyTitle}
                    >
                      {getRollResultLabel(visibleRoll.result)}
                    </Typography>
                    {visibleRoll.challenge1 === visibleRoll.challenge2 && (
                      <Typography
                        color={(theme) => theme.palette.grey[200]}
                        variant={"caption"}
                        fontFamily={(theme) => theme.fontFamilyTitle}
                      >
                        Doubles
                      </Typography>
                    )}
                  </Box>
                </>
              )}
            </Box>
          </Card>
        )}
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
