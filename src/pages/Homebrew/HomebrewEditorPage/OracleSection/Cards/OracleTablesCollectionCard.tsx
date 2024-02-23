import { Datasworn } from "@datasworn/core";
import { Box, Card, CardActionArea, Typography } from "@mui/material";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { useOracleCollectionMap } from "data/hooks/useOracleCollectionMap";

export interface OracleTablesCollectionCardProps {
  oracle: Datasworn.OracleTablesCollection;
  onClick: () => void;
}

export function OracleTablesCollectionCard(
  props: OracleTablesCollectionCardProps
) {
  const { oracle, onClick } = props;

  const originalOracleCollectionMap = useOracleCollectionMap();

  return (
    <Card variant={"outlined"}>
      <CardActionArea
        onClick={onClick}
        sx={{
          px: 2,
          py: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant={"overline"} color={"textSecondary"}>
            Collection
          </Typography>
          <Typography variant={"h6"}>{oracle.name}</Typography>
          {oracle.replaces && (
            <Typography color={"textSecondary"}>
              Replaces &quot;
              {originalOracleCollectionMap[oracle.replaces]?.name ??
                oracle.replaces}
              &quot;
            </Typography>
          )}
          {oracle.enhances && (
            <Typography color={"textSecondary"}>
              Enhances &quot;
              {originalOracleCollectionMap[oracle.enhances]?.name ??
                oracle.enhances}
              &quot;
            </Typography>
          )}
        </Box>
        <ChevronRight color={"action"} />
      </CardActionArea>
    </Card>
  );
}
