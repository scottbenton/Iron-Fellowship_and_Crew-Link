import { Box, Card, Typography, Button } from "@mui/material";
import { useListenToCampaignCustomMoves } from "api/campaign/settings/moves/listenToCampaignCustomMoves";
import { useRemoveCampaignCustomMove } from "api/campaign/settings/moves/removeCampaignCustomMove";
import { useConfirm } from "material-ui-confirm";
import { useState } from "react";
import { Move } from "types/Moves.type";
import { CustomMoveDialog } from "./CustomMoveDialog";

export interface CampaignCustomMovesProps {
  campaignId: string;
  isGM: boolean;
}

const CampaignCustomMovesList = ({
  campaignId,
  isGM,
}: CampaignCustomMovesProps) => {
  const { moves } = useListenToCampaignCustomMoves(campaignId);
  const { removeCampaignCustomMove } = useRemoveCampaignCustomMove();

  const [editCustomMoveDialog, setEditCustomMoveDialog] = useState(false);

  const confirm = useConfirm();

  const [currentMove, setCurrentMove] = useState<Move>();

  const handleDeleteMove = (customMove: Move) => {
    confirm({
      title: "Delete Move",
      description: "Are you sure you want to delete this custom move?",
      confirmationText: "Delete",
      confirmationButtonProps: {
        variant: "contained",
        color: "error",
      },
    })
      .then(() => {
        removeCampaignCustomMove({ campaignId, customMove });
      })
      .catch();
  };

  return (
    <Box>
      {moves?.map((customMove, index) => (
        <Card
          variant={"outlined"}
          sx={{
            width: "40%",
            marginTop: 2,
          }}
          key={index}
        >
          <Box p={2}>
            <Typography
              gutterBottom
              variant={"h6"}
              fontFamily={(theme) => theme.fontFamilyTitle}
            >
              {customMove.name}
            </Typography>
            <Typography variant={"body1"}>{customMove.text}</Typography>
          </Box>
          {isGM && (
            <Box
              display={"flex"}
              justifyContent={"flex-end"}
              sx={(theme) => ({
                backgroundColor: theme.palette.grey[100],
                color: "white",
              })}
            >
              <Button
                onClick={() => {
                  setCurrentMove(customMove);
                  setEditCustomMoveDialog(true);
                }}
              >
                Edit
              </Button>

              <Button
                color={"error"}
                onClick={() => handleDeleteMove(customMove)}
              >
                Delete
              </Button>
            </Box>
          )}
        </Card>
      ))}
      <CustomMoveDialog
        open={editCustomMoveDialog}
        setClose={() => setEditCustomMoveDialog(false)}
        campaignId={campaignId}
        oldMove={currentMove}
      />
    </Box>
  );
};

export default CampaignCustomMovesList;
