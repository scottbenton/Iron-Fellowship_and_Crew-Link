import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useState } from "react";
import { Note } from "types/Notes.type";
import {
  DragDropContext,
  Draggable,
  OnDragEndResponder,
} from "react-beautiful-dnd";
import { StrictModeDroppable } from "./StrictModeDroppable";
import { ROLL_LOG_ID } from "stores/notes/notes.slice.type";
import DieIcon from "@mui/icons-material/Casino";

export interface NoteSidebarProps {
  notes: Note[];
  selectedNoteId?: string;
  openNote: (noteId: string) => void;
  createNote?: () => Promise<string>;
  updateNoteOrder?: (noteId: string, order: number) => Promise<boolean | void>;
  isMobile: boolean;
}

export function NoteSidebar(props: NoteSidebarProps) {
  const {
    notes,
    selectedNoteId,
    openNote,
    createNote,
    updateNoteOrder,
    isMobile,
  } = props;

  const [loading, setLoading] = useState<boolean>(false);

  const handleCreateNote = () => {
    setLoading(true);
    createNote &&
      createNote()
        .then((noteId) => {
          openNote(noteId);
        })
        .catch(() => {})
        .finally(() => {
          setLoading(false);
        });
  };

  const handleDragEnd: OnDragEndResponder = (evt) => {
    const { source, destination } = evt;
    if (!destination) {
      return;
    }

    let noteBefore: Note | undefined;
    let noteAfter: Note | undefined;

    if (source.index === destination.index) {
      return;
    } else if (source.index < destination.index) {
      noteBefore = notes[destination.index];
      noteAfter =
        destination.index + 1 < notes.length
          ? notes[destination.index + 1]
          : undefined;
    } else {
      noteBefore =
        destination.index - 1 >= 0 ? notes[destination.index - 1] : undefined;
      noteAfter = notes[destination.index];
    }
    const noteId = notes[source.index].noteId;

    let order: number = 1;
    if (noteBefore && noteAfter) {
      order = (noteBefore.order + noteAfter.order) / 2;
    } else if (noteBefore) {
      order = noteBefore.order + 1;
    } else if (noteAfter) {
      order = noteAfter.order - 1;
    }

    updateNoteOrder && updateNoteOrder(noteId, order).catch(() => {});
  };

  return (
    <Box
      sx={(theme) => ({
        bgcolor: theme.palette.background.paperInlay,
      })}
      width={isMobile ? "100%" : "33%"}
      maxWidth={isMobile ? undefined : "250px"}
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"space-between"}
    >
      <DragDropContext onDragEnd={handleDragEnd}>
        <StrictModeDroppable droppableId={"notes-sidebar-list"}>
          {(provided) => (
            <List
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={{
                overflowY: "auto",
              }}
            >
              <ListItem disablePadding>
                <ListItemButton
                  selected={ROLL_LOG_ID === selectedNoteId}
                  onClick={() => openNote(ROLL_LOG_ID)}
                >
                  <ListItemIcon>
                    <DieIcon />
                  </ListItemIcon>
                  <ListItemText>Roll Log</ListItemText>
                </ListItemButton>
              </ListItem>
              <Divider />

              {notes.map((note, index) => (
                <Draggable
                  key={note.noteId}
                  draggableId={note.noteId}
                  index={index}
                  isDragDisabled={!updateNoteOrder}
                >
                  {(provided) => (
                    <ListItem
                      disablePadding
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={provided.draggableProps.style}
                    >
                      <ListItemButton
                        selected={note.noteId === selectedNoteId}
                        onClick={() => openNote(note.noteId)}
                      >
                        <ListItemText
                          primaryTypographyProps={{
                            sx: {
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            },
                          }}
                        >
                          {note.title}
                        </ListItemText>
                      </ListItemButton>
                    </ListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </StrictModeDroppable>
      </DragDropContext>
      {createNote && (
        <Box
          bgcolor={(theme) =>
            theme.palette.grey[theme.palette.mode == "light" ? 300 : 700]
          }
        >
          <Button
            color={"inherit"}
            onClick={() => handleCreateNote()}
            disabled={loading}
            sx={{
              borderRadius: 0,
              width: "100%",
            }}
          >
            Add Notes Page
          </Button>
        </Box>
      )}
    </Box>
  );
}
