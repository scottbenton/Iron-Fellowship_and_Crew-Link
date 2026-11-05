import {
  Box,
  Breadcrumbs,
  Checkbox,
  FormControlLabel,
  Link,
  Typography,
} from "@mui/material";
import { NoteSidebar } from "./NoteSidebar";
import { NoteSource, ROLL_LOG_ID } from "stores/notes/notes.slice.type";
import { GameLog } from "components/features/charactersAndCampaigns/GameLog";
import { RtcRichTextEditor } from "components/shared/RichTextEditor/RtcRichTextEditor";
import { useCallback } from "react";
import { useStore } from "stores/store";
import { useCampaignType } from "hooks/useCampaignType";
import { CampaignType } from "api-calls/campaign/_campaign.type";

export interface NotesProps {
  hideSidebar?: boolean;
  condensedView?: boolean;
}

export function Notes(props: NotesProps) {
  const { condensedView, hideSidebar } = props;

  const selectedNote = useStore(
    (store) =>
      store.notes.openNote ??
      (condensedView || hideSidebar ? undefined : ROLL_LOG_ID)
  );
  const selectedNoteItem = useStore((store) => {
    const openNote = store.notes.openNote;
    if (openNote && typeof openNote !== "string") {
      return store.notes.notes[openNote.source].find(
        (note) => note.noteId === openNote.id
      );
    }
    return undefined;
  });

  const setSelectedNote = useStore((store) => store.notes.setOpenNoteId);
  const selectedNoteContent = useStore((store) => store.notes.openNoteContent);

  const characterId = useStore(
    (store) => store.characters.currentCharacter.currentCharacterId
  );
  const campaignId = useStore(
    (store) => store.campaigns.currentCampaign.currentCampaignId
  );

  const onSave = useStore((store) => store.notes.updateNote);
  const onDelete = useStore((store) => store.notes.removeNote);
  const updateNoteShared = useStore((store) => store.notes.updateNoteShared);

  const saveCallback = useCallback(
    (
      unparsedId: string,
      notes: Uint8Array,
      isBeaconRequest?: boolean,
      title?: string
    ) => {
      const note = parseId(unparsedId);

      return onSave(
        note.source,
        campaignId,
        characterId,
        note.id,
        title ?? "Note",
        notes,
        isBeaconRequest
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [campaignId, characterId]
  );

  const handleDelete = useCallback(
    (unparsedId: string) => {
      const id = parseId(unparsedId);
      onDelete(id).then(() => {
        setSelectedNote();
      });
    },
    [onDelete, setSelectedNote]
  );

  const roomPrefix =
    selectedNote && typeof selectedNote !== "string"
      ? selectedNote.source === NoteSource.Character
        ? `characters-${characterId}-`
        : `campaigns-${campaignId}-`
      : "";
  const roomPassword =
    selectedNote && typeof selectedNote !== "string"
      ? selectedNote.source === NoteSource.Character
        ? characterId
        : campaignId
      : "";

  const { showGuidedPlayerView, campaignType } = useCampaignType();

  return (
    <Box
      height={condensedView && selectedNote === ROLL_LOG_ID ? "70vh" : "100%"}
      minHeight={"50vh"}
      display={"flex"}
      width={"100%"}
    >
      {((!hideSidebar && !condensedView) || !selectedNote) && (
        <NoteSidebar
          selectedNote={selectedNote}
          isMobile={condensedView ?? false}
        />
      )}
      {(!condensedView || selectedNote) && (
        <Box
          flexGrow={1}
          flexShrink={0}
          width={0}
          minHeight={"100%"}
          display={"flex"}
          flexDirection={"column"}
          sx={{ overflowY: "auto" }}
        >
          {(condensedView || hideSidebar) &&
            (selectedNote || selectedNote === ROLL_LOG_ID) && (
              <Breadcrumbs aria-label="breadcrumb" sx={{ px: 2, py: 1 }}>
                <Link
                  underline="hover"
                  color="inherit"
                  component={"button"}
                  onClick={() => setSelectedNote()}
                  sx={{ cursor: "pointer" }}
                >
                  Notes
                </Link>
                <Typography color="text.primary">
                  {selectedNote === ROLL_LOG_ID
                    ? "Roll Log"
                    : selectedNoteItem?.title ?? ""}
                </Typography>
              </Breadcrumbs>
            )}
          {selectedNote === ROLL_LOG_ID && <GameLog />}
          {selectedNote &&
            selectedNote !== ROLL_LOG_ID &&
            selectedNote &&
            selectedNoteContent !== undefined && (
              <RtcRichTextEditor
                roomPrefix={roomPrefix}
                documentPassword={roomPassword ?? ""}
                id={constructId(selectedNote.source, selectedNote.id)}
                initialValue={selectedNoteContent ?? undefined}
                showTitle
                onSave={saveCallback}
                onDelete={handleDelete}
                extraEditorActions={
                  selectedNote.source === NoteSource.Campaign &&
                  campaignType === CampaignType.Guided &&
                  !showGuidedPlayerView ? (
                    <FormControlLabel
                      label={"Shared"}
                      sx={{ px: 1 }}
                      control={
                        <Checkbox
                          checked={selectedNoteItem?.shared ?? false}
                          onChange={(_, checked) =>
                            updateNoteShared(selectedNote, checked).catch(
                              () => {}
                            )
                          }
                        />
                      }
                    />
                  ) : undefined
                }
              />
            )}
        </Box>
      )}
    </Box>
  );
}

function constructId(source: NoteSource, id: string) {
  return `${source}-${id}`;
}

function parseId(id: string) {
  const split = id.split("-");
  return {
    source: split[0] as NoteSource,
    id: split[1],
  };
}
