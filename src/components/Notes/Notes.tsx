import {
  Box,
  Breadcrumbs,
  Button,
  Link,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { RichTextEditor } from "components/RichTextEditor";
import { Note } from "types/Notes.type";
import { NoteSidebar } from "./NoteSidebar";
import { useState } from "react";
import { ROLL_LOG_ID } from "stores/notes/notes.slice.type";
import { GameLog } from "components/GameLog";

export interface NotesProps {
  notes: Note[];
  selectedNoteId?: string;
  selectedNoteContent?: string;
  openNote: (noteId?: string) => void;
  createNote?: () => Promise<string>;
  updateNoteOrder?: (noteId: string, order: number) => Promise<boolean | void>;
  onSave?: (params: {
    noteId: string;
    title: string;
    content?: string;
    isBeaconRequest?: boolean;
  }) => Promise<boolean | void>;
  onDelete?: (noteId: string) => void;
  condensedView?: boolean;
}

export function Notes(props: NotesProps) {
  const {
    notes,
    selectedNoteId,
    selectedNoteContent,
    openNote,
    createNote,
    updateNoteOrder,
    onSave,
    onDelete,
    condensedView,
  } = props;

  const selectedNote = notes.find((note) => note.noteId === selectedNoteId);

  return (
    <Box
      height={"100%"}
      display={"flex"}
      width={"100%"}
      minHeight={condensedView ? "90vh" : undefined}
    >
      {(!condensedView || !selectedNoteId) && (
        <NoteSidebar
          notes={notes}
          selectedNoteId={selectedNoteId}
          openNote={openNote}
          createNote={createNote}
          updateNoteOrder={updateNoteOrder}
          isMobile={condensedView ?? false}
        />
      )}
      {(!condensedView || selectedNoteId) && (
        <Box
          flexGrow={1}
          flexShrink={0}
          width={0}
          minHeight={"100%"}
          sx={{ overflowY: "auto" }}
        >
          {condensedView &&
            (selectedNote || selectedNoteId === ROLL_LOG_ID) && (
              <Breadcrumbs aria-label="breadcrumb" sx={{ px: 2, py: 1 }}>
                <Link
                  underline="hover"
                  color="inherit"
                  onClick={() => openNote()}
                  sx={{ cursor: "pointer" }}
                >
                  Notes
                </Link>
                <Typography color="text.primary">
                  {selectedNoteId === ROLL_LOG_ID
                    ? "Roll Log"
                    : selectedNote?.title ?? ""}
                </Typography>
              </Breadcrumbs>
            )}
          {selectedNoteId === ROLL_LOG_ID && <GameLog />}
          {selectedNoteId &&
            selectedNoteId !== ROLL_LOG_ID &&
            selectedNote &&
            selectedNoteContent !== undefined && (
              <RichTextEditor
                id={selectedNoteId}
                content={{
                  title: selectedNote.title,
                  body: selectedNoteContent,
                }}
                onSave={
                  onSave
                    ? ({ id, title, content, isBeaconRequest }) =>
                        new Promise<boolean>((resolve, reject) => {
                          if (id) {
                            onSave({
                              noteId: id,
                              title,
                              content,
                              isBeaconRequest,
                            })
                              .then(() => resolve(true))
                              .catch((e) => reject(e));
                          } else {
                            reject("Note id not provided");
                          }
                        })
                    : undefined
                }
                onDelete={onDelete}
              />
            )}
        </Box>
      )}
    </Box>
  );
}
