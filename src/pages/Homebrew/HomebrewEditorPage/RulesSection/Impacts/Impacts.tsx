import { Box, Button, List, Typography } from "@mui/material";
import { useState } from "react";
import { StoredRules } from "types/HomebrewCollection.type";

export interface ImpactsProps {
  homebrewId: string;
  impactCategories: StoredRules["impacts"];
}

export function Impacts(props: ImpactsProps) {
  const { homebrewId, impactCategories } = props;

  const [impactDialogOpen, setImpactDialogOpen] = useState(false);
  const [editingImpactCategoryKey, setEditingImpactCategoryKey] = useState<
    string | undefined
  >(undefined);

  return (
    <>
      {Object.keys(impactCategories).length === 0 ? (
        <Typography color={"text.secondary"}>
          No Impact Categories Found
        </Typography>
      ) : (
        <Box
          component={"ul"}
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            pl: 0,
            my: 0,
            listStyle: "none",
          }}
        >
          {Object.keys(impactCategories).map((categoryKey) => (
            <Box component={"li"} key={categoryKey}>
              <Typography>{impactCategories[categoryKey].label}</Typography>
            </Box>
          ))}
        </Box>
      )}
      <Button
        variant={"outlined"}
        color={"inherit"}
        onClick={() => {
          setImpactDialogOpen(true);
          setEditingImpactCategoryKey(undefined);
        }}
      >
        Add Impact Category
      </Button>
    </>
  );
}
