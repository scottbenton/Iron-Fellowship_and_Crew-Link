import { Box, Typography } from "@mui/material";
import { OracleCollectionList } from "components/sharedIronsworn/NewOracles";
import { useRootOracleIds } from "data/hooks/useRootOracleIds";

export interface ExampleOraclesProps {
  homebrewId: string;
}

export function ExampleOracles(props: ExampleOraclesProps) {
  const { homebrewId } = props;

  const rootOracles = useRootOracleIds([homebrewId]);

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
      <OracleCollectionList
        collectionIds={rootOracles}
        homebrewIds={[homebrewId]}
      />
    </Box>
  );
}
