import {
  Box,
  Button,
  Card,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Stack,
} from "@mui/material";
import { SectionHeading } from "components/SectionHeading";
import { useState } from "react";
import { getCustomMoveDatabaseId, StoredMove } from "types/Moves.type";
import { CustomMoveDialog } from "./CustomMoveDialog";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useConfirm } from "material-ui-confirm";

export interface CustomMovesSectionProps {
  customMoves?: StoredMove[];
  createCustomMove: (move: StoredMove) => Promise<boolean>;
  updateCustomMove: (moveId: string, move: StoredMove) => Promise<boolean>;
  removeCustomMove: (moveId: string) => Promise<boolean>;
}

export function CustomMovesSection(props: CustomMovesSectionProps) {
  const { customMoves, createCustomMove, updateCustomMove, removeCustomMove } =
    props;

  const confirm = useConfirm();

  const [isAddMoveDialogOpen, setIsAddMoveDialogOpen] =
    useState<boolean>(false);

  const [currentlyEditingMove, setCurrentlyEditingMove] =
    useState<StoredMove>();

  const handleDelete = (moveId: string, move: StoredMove) => {
    confirm({
      title: `Delete ${move.name}`,
      description:
        "Are you sure you want to delete this move? This cannot be undone.",
      confirmationText: "Delete",
      confirmationButtonProps: {
        variant: "contained",
        color: "error",
      },
    })
      .then(() => {
        removeCustomMove(moveId).catch();
      })
      .catch();
  };

  return (
    <Box>
      <SectionHeading label={"Custom Moves"} />
      {Array.isArray(customMoves) ? (
        <Stack spacing={2} px={2} mt={1}>
          <Card variant={"outlined"}>
            <List disablePadding>
              {customMoves.map(
                (move) =>
                  move && (
                    <ListItem
                      dense
                      key={move.name}
                      sx={(theme) => ({
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        "&:nth-of-type(odd)": {
                          backgroundColor: theme.palette.action.hover,
                        },
                      })}
                    >
                      <ListItemText>{move.name}</ListItemText>
                      <Box>
                        <IconButton
                          onClick={() => {
                            setCurrentlyEditingMove(move);
                            setIsAddMoveDialogOpen(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() =>
                            handleDelete(
                              getCustomMoveDatabaseId(move.name),
                              move
                            )
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </ListItem>
                  )
              )}
            </List>
          </Card>
          <div>
            <Button
              variant={"contained"}
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
        createCustomMove={createCustomMove}
        updateCustomMove={updateCustomMove}
        move={currentlyEditingMove}
      />
    </Box>
  );
}
