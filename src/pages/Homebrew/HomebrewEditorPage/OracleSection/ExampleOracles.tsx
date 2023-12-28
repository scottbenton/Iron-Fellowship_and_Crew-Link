import { Box, Typography } from "@mui/material";
import { OracleCollectionList } from "components/sharedIronsworn/NewOracles";
import { useOracles } from "data/hooks/useOracles";

export function ExampleOracles() {
  const oracles = useOracles();
  return (
    <Box
      borderRadius={1}
      overflow="hidden"
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
      <OracleCollectionList oracles={oracles} />
    </Box>
  );
}
