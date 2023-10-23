import { Box, Typography } from "@mui/material";
import { useGameSystemValue } from "hooks/useGameSystemValue";
import { GAME_SYSTEMS } from "types/GameSystems.type";

export function Licensing() {
  const license = useGameSystemValue({
    [GAME_SYSTEMS.IRONSWORN]: (
      <>
        This work is based on{" "}
        <a href={"https://www.ironswornrpg.com"}>Ironsworn</a>, created by Shawn
        Tomkin, and licensed for our use under the{" "}
        <a href={"https://creativecommons.org/licenses/by-nc-sa/4.0/"}>
          Creative Commons Attribution-NonCommercial-ShareAlike 4.0
          International license.
        </a>
      </>
    ),
    [GAME_SYSTEMS.STARFORGED]: (
      <>
        This work is based on{" "}
        <a href={"https://www.ironswornrpg.com"}>Ironsworn: Starforged</a>,
        created by Shawn Tompkin, and licensed for our use under the{" "}
        <a href={"https://creativecommons.org/licenses/by-nc-sa/4.0/"}>
          Creative Commons Attribution-NonCommercial-ShareAlike 4.0
          International license.
        </a>
      </>
    ),
  });
  return (
    <Box display={"flex"} alignItems={"center"} flexDirection={"column"} mb={2}>
      <Typography
        textAlign={"center"}
        variant={"h5"}
        fontFamily={(theme) => theme.fontFamilyTitle}
        mt={8}
      >
        Licensing
      </Typography>
      <Typography
        maxWidth={"50ch"}
        color={"textSecondary"}
        textAlign={"center"}
      >
        {license}
      </Typography>
    </Box>
  );
}
