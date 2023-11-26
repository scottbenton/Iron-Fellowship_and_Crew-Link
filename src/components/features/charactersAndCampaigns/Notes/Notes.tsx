import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import { Note } from "types/Notes.type";
import { NoteSidebar } from "./NoteSidebar";
import { ROLL_LOG_ID } from "stores/notes/notes.slice.type";
import { GameLog } from "components/features/charactersAndCampaigns/GameLog";
import { RtcRichTextEditor } from "components/shared/RichTextEditor/RtcRichTextEditor";
import { useCallback } from "react";

export interface NotesProps {
  notes: Note[];
  selectedNoteId?: string;
  selectedNoteContent?: Uint8Array | null;
  openNote: (noteId?: string) => void;
  createNote?: () => Promise<string>;
  updateNoteOrder?: (noteId: string, order: number) => Promise<boolean | void>;
  onSave?: (params: {
    noteId: string;
    title: string;
    content?: Uint8Array;
    isBeaconRequest?: boolean;
  }) => Promise<boolean | void>;
  onDelete?: (noteId: string) => void;
  condensedView?: boolean;
  source:
    | { type: "character"; characterId: string }
    | { type: "campaign"; campaignId: string };
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
    source,
  } = props;

  const selectedNote = notes.find((note) => note.noteId === selectedNoteId);

  const roomPrefix =
    source.type === "character"
      ? `characters-${source.characterId}-`
      : `campaigns-${source.campaignId}-`;
  const roomPassword =
    source.type === "character" ? source.characterId : source.campaignId;

  const saveCallback = useCallback(
    (
      noteId: string,
      notes: Uint8Array,
      isBeaconRequest?: boolean,
      title?: string
    ) =>
      onSave
        ? onSave({
            noteId,
            title: title ?? "Note",
            content: notes,
            isBeaconRequest,
          })
        : new Promise<void>((res) => res()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Box
      height={condensedView ? "70vh" : "100%"}
      display={"flex"}
      width={"100%"}
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
          display={"flex"}
          flexDirection={"column"}
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
              <RtcRichTextEditor
                roomPrefix={roomPrefix}
                documentPassword={roomPassword}
                id={selectedNoteId}
                initialValue={selectedNoteContent ?? undefined}
                showTitle
                onSave={onSave ? saveCallback : undefined}
                onDelete={onDelete}
              />
            )}
        </Box>
      )}
    </Box>
  );
}
