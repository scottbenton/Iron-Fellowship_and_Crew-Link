import { Box, Card, CardActionArea, Typography } from "@mui/material";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { useStore } from "stores/store";
import { HomebrewMoveCategoryDocument } from "api-calls/homebrew/moves/categories/_homebrewMoveCategory.type";

export interface MoveCategoryCardProps {
  category: HomebrewMoveCategoryDocument;
  onClick: () => void;
}

export function MoveCategoryCard(props: MoveCategoryCardProps) {
  const { category, onClick } = props;

  const moveCategoryMap = useStore(
    (store) => store.rules.moveMaps.nonReplacedMoveCategoryMap
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
            Category
          </Typography>
          <Typography variant={"h6"} component={"span"} display={"block"}>
            {category.label}
          </Typography>
          {category.replacesId && (
            <Typography color={"textSecondary"}>
              Replaces &quot;
              {moveCategoryMap[category.replacesId]?.name ??
                category.replacesId}
              &quot;
            </Typography>
          )}
          {category.enhancesId && (
            <Typography color={"textSecondary"}>
              Enhances &quot;
              {moveCategoryMap[category.enhancesId]?.name ??
                category.enhancesId}
              &quot;
            </Typography>
          )}
        </Box>
        <ChevronRight color={"action"} />
      </CardActionArea>
    </Card>
  );
}
