import { Box, Typography } from "@mui/material";
import { PortraitAvatar } from "components/PortraitAvatar/PortraitAvatar";
import { useCharacterSheetStore } from "../characterSheet.store";
import { InitiativeButtons } from "./InitiativeButtons";
import { StatsSection } from "./StatsSection";

export interface CharacterHeaderProps {}

export function CharacterHeader(props: CharacterHeaderProps) {
  const characterId = useCharacterSheetStore(
    (store) => store.characterId ?? ""
  );
  const characterName = useCharacterSheetStore(
    (store) => store.character?.name
  );
  const characterPortraitUrl = useCharacterSheetStore(
    (store) => store.character?.portraitUrl
  );
  const characterPortraitSettings = useCharacterSheetStore(
    (store) => store.character?.profileImage
  );

  return (
    <Box
      sx={[
        (theme) => ({
          position: "relative",
          mx: -3,
          px: 3,
          top: theme.spacing(-3),
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
          id={characterId}
          name={characterName}
          portraitUrl={characterPortraitUrl}
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
