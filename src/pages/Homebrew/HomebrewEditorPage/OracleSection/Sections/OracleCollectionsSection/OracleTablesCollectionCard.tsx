import { Box, Card, CardActionArea, Typography } from "@mui/material";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { StoredOracleCollection } from "types/homebrew/HomebrewOracles.type";
import { useStore } from "stores/store";

export interface OracleTablesCollectionCardProps {
  oracle: StoredOracleCollection;
  onClick: () => void;
}

export function OracleTablesCollectionCard(
  props: OracleTablesCollectionCardProps
) {
  const { oracle, onClick } = props;

  const oracleCollectionMap = useStore(
    (store) => store.rules.oracleMaps.oracleCollectionMap
  );

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
          <Typography variant={"h6"}>{oracle.label}</Typography>
          {oracle.replacesId && (
            <Typography color={"textSecondary"}>
              Replaces &quot;
              {oracleCollectionMap[oracle.replacesId]?.name ??
                oracle.replacesId}
              &quot;
            </Typography>
          )}
          {oracle.enhancesId && (
            <Typography color={"textSecondary"}>
              Enhances &quot;
              {oracleCollectionMap[oracle.enhancesId]?.name ??
                oracle.enhancesId}
              &quot;
            </Typography>
          )}
        </Box>
        <ChevronRight color={"action"} />
      </CardActionArea>
    </Card>
  );
}
