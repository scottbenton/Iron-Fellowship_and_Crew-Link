import { Box, Card, Link, Typography } from "@mui/material";
import { truthMap, truthOptionMap } from "data/truths";
import { useState } from "react";
import { Truth, TRUTH_IDS } from "types/World.type";
import { TruthDialogSelector } from "./TruthDialogSelector";
import { useStore } from "stores/store";

export interface TruthCardProps {
  truthId: TRUTH_IDS;
  storedTruth: Truth;
  canEdit: boolean;
}

export function TruthCard(props: TruthCardProps) {
  const { truthId, storedTruth, canEdit } = props;

  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);

  const truth = truthMap[truthId];
  const truthOption = storedTruth.customTruth ?? truthOptionMap[storedTruth.id];

  const updateWorldTruth = useStore(
    (store) => store.worlds.currentWorld.updateCurrentWorldTruth
  );
  const handleUpdateWorldTruth = (truth: Truth) => {
    updateWorldTruth(truthId, truth).catch(() => {});
  };

  return (
    <>
      <Card
        sx={{
          height: "100%",
          px: 2,
          pb: 2,
          pt: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
        variant={"outlined"}
      >
        <Box mb={1}>
          <Box
            display={"flex"}
            alignItems={"baseline"}
            justifyContent={"space-between"}
          >
            <Typography variant={"h6"}>{truth?.Title.Standard}</Typography>
            {canEdit && (
              <Link
                color={"inherit"}
                component={"button"}
                onClick={() => setEditDialogOpen(true)}
              >
                Edit
              </Link>
            )}
          </Box>
          <Typography>{truthOption?.Description}</Typography>
        </Box>
        {canEdit && (
          <Box
            sx={(theme) => ({
              px: 1,
              pb: 1,
              m: -1,
              mt: 1,
              backgroundColor: theme.palette.background.paperInlay,
            })}
          >
            <Typography variant={"overline"}>Quest Starter:</Typography>
            <Typography>{truthOption?.["Quest starter"]}</Typography>
          </Box>
        )}
      </Card>
      <TruthDialogSelector
        open={editDialogOpen}
        handleClose={() => setEditDialogOpen(false)}
        truthId={truthId}
        truth={truth}
        storedTruth={storedTruth}
        selectTruthOption={(truth) => handleUpdateWorldTruth(truth)}
      />
    </>
  );
}
