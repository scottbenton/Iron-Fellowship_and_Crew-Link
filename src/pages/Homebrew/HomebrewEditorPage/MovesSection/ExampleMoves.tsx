import { Box, Card, Typography } from "@mui/material";
import { MovesSection as NewMovesSection } from "components/features/charactersAndCampaigns/NewMovesSection";

export function ExampleMoves() {
  return (
    <Card variant={"outlined"}>
      <Box bgcolor={"darkGrey.dark"} color={"darkGrey.contrastText"} px={2}>
        <Typography
          variant={"overline"}
          fontFamily={(theme) => theme.fontFamilyTitle}
        >
          Preview
        </Typography>
      </Box>
      <NewMovesSection />
    </Card>
  );
}
