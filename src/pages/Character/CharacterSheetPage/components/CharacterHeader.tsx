import { Box, Typography } from "@mui/material";
import { PortraitAvatar } from "components/PortraitAvatar/PortraitAvatar";
import { InitiativeButtons } from "./InitiativeButtons";
import { StatsSection } from "./StatsSection";
import { useStore } from "stores/store";

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
          <InitiativeButtons />
        </Box>
      </Box>
      <StatsSection />
    </Box>
  );
}
