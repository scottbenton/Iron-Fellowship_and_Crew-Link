import { Box, Button, Card, LinearProgress, List, Stack } from "@mui/material";
import { SectionHeading } from "components/SectionHeading";
import { useState } from "react";
import { StoredMove } from "types/Moves.type";
import { CustomMoveDialog } from "./CustomMoveDialog";
import { useConfirm } from "material-ui-confirm";
import { CustomMoveListItem } from "./CustomMoveListItem";
import { useStore } from "stores/store";

export interface CustomMovesSectionProps {
  customMoves?: StoredMove[];
  hiddenMoveIds?: string[];
  showOrHideCustomMove: (
    moveId: string,
    hidden: boolean
  ) => Promise<boolean | void>;
}

export function CustomMovesSection(props: CustomMovesSectionProps) {
  const { customMoves, hiddenMoveIds, showOrHideCustomMove } = props;

  const confirm = useConfirm();

  const [isAddMoveDialogOpen, setIsAddMoveDialogOpen] =
    useState<boolean>(false);

  const [currentlyEditingMove, setCurrentlyEditingMove] =
    useState<StoredMove>();

  const addCustomMove = useStore((store) => store.settings.addCustomMove);
  const updateCustomMove = useStore((store) => store.settings.updateCustomMove);
  const removeCustomMove = useStore((store) => store.settings.removeCustomMove);

  const handleDelete = (moveId: string, move: StoredMove) => {
    confirm({
      title: `Delete ${move.name}`,
      description:
        "Are you sure you want to delete this move? It will be deleted from ALL of your characters and campaigns. This cannot be undone.",
      confirmationText: "Delete",
      confirmationButtonProps: {
        variant: "contained",
        color: "error",
      },
    })
      .then(() => {
        removeCustomMove(moveId).catch(() => {});
      })
      .catch(() => {});
  };

  return (
    <Box>
      <SectionHeading label={"Custom Moves"} />
      {Array.isArray(customMoves) && Array.isArray(hiddenMoveIds) ? (
        <Stack spacing={2} px={2} mt={1}>
          {customMoves.length > 0 && (
            <Card variant={"outlined"}>
              <List disablePadding>
                {customMoves.map(
                  (move) =>
                    move && (
                      <CustomMoveListItem
                        key={move.$id}
                        move={move}
                        isVisible={!hiddenMoveIds.includes(move.$id)}
                        handleEdit={() => {
                          setCurrentlyEditingMove(move);
                          setIsAddMoveDialogOpen(true);
                        }}
                        handleVisibilityToggle={(isVisible) =>
                          showOrHideCustomMove(move.$id, !isVisible)
                        }
                        handleDelete={() => handleDelete(move.$id, move)}
                      />
                    )
                )}
              </List>
            </Card>
          )}
          <div>
            <Button
              color={"inherit"}
              variant={"outlined"}
              onClick={() => setIsAddMoveDialogOpen(true)}
            >
              Add Custom Move
            </Button>
          </div>
        </Stack>
      ) : (
        <LinearProgress />
      )}
      <CustomMoveDialog
        open={isAddMoveDialogOpen}
        onClose={() => {
          setIsAddMoveDialogOpen(false);
          setCurrentlyEditingMove(undefined);
        }}
        createCustomMove={addCustomMove}
        updateCustomMove={updateCustomMove}
        move={currentlyEditingMove}
      />
    </Box>
  );
}
