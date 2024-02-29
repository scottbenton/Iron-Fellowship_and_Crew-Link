import { Box, Typography } from "@mui/material";
import { OracleSection } from "components/features/charactersAndCampaigns/NewOracleSection/OracleSection";

export function ExampleOracles() {
  return (
    <Box
      borderRadius={1}
      overflow='hidden'
      border={"1px solid"}
      borderColor={"divider"}
    >
      <Box bgcolor={"darkGrey.main"} color={"darkGrey.contrastText"} px={2}>
        <Typography
          variant={"overline"}
          fontFamily={(theme) => theme.fontFamilyTitle}
        >
          Preview
        </Typography>
      </Box>
      <OracleSection />
    </Box>
  );
}
