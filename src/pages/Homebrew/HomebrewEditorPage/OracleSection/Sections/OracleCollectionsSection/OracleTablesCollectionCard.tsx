import { Box, Card, CardActionArea, Typography } from "@mui/material";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { HomebrewOracleCollectionDocument } from "api-calls/homebrew/oracles/collections/_homebrewOracleCollection.type";
import { useStore } from "stores/store";

export interface OracleTablesCollectionCardProps {
  oracle: HomebrewOracleCollectionDocument;
  onClick: () => void;
}

export function OracleTablesCollectionCard(
  props: OracleTablesCollectionCardProps
) {
  const { oracle, onClick } = props;

  const oracleCollectionMap = useStore(
    (store) => store.rules.oracleMaps.nonReplacedOracleCollectionMap
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
          <Typography variant={"h6"} component={"span"} display={"block"}>
            {oracle.label}
          </Typography>
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
