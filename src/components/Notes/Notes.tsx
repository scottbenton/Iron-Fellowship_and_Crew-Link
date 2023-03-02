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

export interface NotesProps {
  notes: Note[];
  selectedNoteId?: string;
  selectedNoteContent?: string;
  openNote: (noteId?: string) => void;
  createNote: () => Promise<boolean>;
  updateNoteOrder: (noteId: string, order: number) => Promise<boolean>;
  onSave?: (params: {
    noteId: string;
    title: string;
    content: string;
    isBeaconRequest?: boolean;
  }) => Promise<boolean>;
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
  } = props;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const selectedNote = notes.find((note) => note.noteId === selectedNoteId);

  return (
    <Box
      height={"100%"}
      display={"flex"}
      width={"100%"}
      minHeight={isMobile ? "90vh" : undefined}
    >
      {(!isMobile || !selectedNoteId) && (
        <NoteSidebar
          notes={notes}
          selectedNoteId={selectedNoteId}
          openNote={openNote}
          createNote={createNote}
          updateNoteOrder={updateNoteOrder}
          isMobile={isMobile}
        />
      )}
      {(!isMobile || selectedNoteId) && (
        <Box flexGrow={1} flexShrink={0} width={0}>
          {isMobile && selectedNote && (
            <Breadcrumbs aria-label="breadcrumb" sx={{ px: 2, py: 1 }}>
              <Link
                component={"button"}
                underline="hover"
                color="inherit"
                onClick={() => openNote()}
              >
                Notes
              </Link>
              <Typography color="text.primary">{selectedNote.title}</Typography>
            </Breadcrumbs>
          )}
          {selectedNoteId &&
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
              />
            )}
        </Box>
      )}
    </Box>
  );
}
