import { Box, LinearProgress, useMediaQuery, useTheme } from "@mui/material";
import { Notes } from "components/Notes/Notes";
import { useEffect } from "react";
import { ROLL_LOG_ID } from "stores/notes/notes.slice.type";
import { useStore } from "stores/store";

export function CampaignNotesSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const notes = useStore((store) => store.notes.notes);
  const temporarilyReorderNotes = useStore(
    (store) => store.notes.temporarilyReorderNotes
  );

  const campaignId = useStore(
    (store) => store.campaigns.currentCampaign.currentCampaignId ?? ""
  );

  const noteContent = useStore((store) => store.notes.openNoteContent);
  const openNoteId = useStore((store) => store.notes.openNoteId);
  const setNoteId = useStore((store) => store.notes.setOpenNoteId);

  const addCampaignNote = useStore((store) => store.notes.addNote);
  const updateCampaignNote = useStore((store) => store.notes.updateNote);
  const updateCampaignNoteOrder = useStore(
    (store) => store.notes.updateNoteOrder
  );
  const removeCampaignNote = useStore((store) => store.notes.removeNote);

  useEffect(() => {
    if (!openNoteId && !isMobile) {
      setNoteId(ROLL_LOG_ID);
    }
  }, [setNoteId, openNoteId, isMobile]);

  if (!Array.isArray(notes)) {
    return <LinearProgress />;
  }

  const handleNoteReorder = (noteId: string, order: number) => {
    temporarilyReorderNotes(noteId, order);
    return updateCampaignNoteOrder(noteId, order);
  };

  return (
    <Box height={"100%"}>
      <Notes
        source={{
          type: "campaign",
          campaignId,
        }}
        notes={notes}
        selectedNoteId={openNoteId}
        selectedNoteContent={noteContent}
        openNote={(noteId) => setNoteId(noteId)}
        createNote={() =>
          addCampaignNote(
            notes && notes.length > 0 ? notes[notes.length - 1].order + 1 : 1
          )
        }
        updateNoteOrder={handleNoteReorder}
        onSave={({ noteId, title, content, isBeaconRequest }) =>
          updateCampaignNote(noteId, title, content, isBeaconRequest)
        }
        onDelete={(noteId) =>
          removeCampaignNote(noteId)
            .then(() => {
              setNoteId(undefined);
            })
            .catch(() => {})
        }
        condensedView={isMobile}
      />
    </Box>
  );
}
