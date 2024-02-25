import { Box, Typography } from "@mui/material";
import { OracleCollectionList } from "components/features/charactersAndCampaigns/NewOracleSection";
import { useStore } from "stores/store";

export function ExampleOracles() {
  const rootOracles = useStore((store) => store.rules.rootOracleCollectionIds);

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
      <OracleCollectionList collectionIds={rootOracles} />
    </Box>
  );
}
