import { Box, LinearProgress, useMediaQuery, useTheme } from "@mui/material";
import { useAddCampaignNote } from "api/campaign/notes/addCampaignNote";
import { useListenToCampaignNoteContent } from "api/campaign/notes/listenToCampaignNoteContent";
import { useListenToCampaignNotes } from "api/campaign/notes/listenToCampaignNotes";
import { useRemoveCampaignNote } from "api/campaign/notes/removeCampaignNote";
import { useUpdateCampaignNote } from "api/campaign/notes/updateCampaignNote";
import { useUpdateCampaignNoteOrder } from "api/campaign/notes/updateCampaignNoteOrder";
import { Notes } from "components/Notes/Notes";
import { useEffect } from "react";

export interface CampaignNotesSectionProps {
  campaignId: string;
}

export function CampaignNotesSection(props: CampaignNotesSectionProps) {
  const { campaignId } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { notes, temporarilyReorderNotes } =
    useListenToCampaignNotes(campaignId);

  const {
    noteContent,
    noteId: openNoteId,
    setNoteId,
  } = useListenToCampaignNoteContent(campaignId);

  const { addCampaignNote } = useAddCampaignNote();
  const { updateCampaignNote } = useUpdateCampaignNote();
  const { updateCampaignNoteOrder } = useUpdateCampaignNoteOrder();
  const { removeCampaignNote } = useRemoveCampaignNote();

  useEffect(() => {
    if (Array.isArray(notes) && notes.length > 0 && !openNoteId && !isMobile) {
      setNoteId(notes[notes.length - 1].noteId);
    } else if (!Array.isArray(notes) || notes.length === 0) {
      setNoteId(undefined);
    }
  }, [notes, setNoteId, openNoteId, isMobile]);

  if (!Array.isArray(notes)) {
    return <LinearProgress />;
  }

  const handleNoteReorder = (noteId: string, order: number) => {
    temporarilyReorderNotes(noteId, order);
    return updateCampaignNoteOrder({ campaignId, noteId, order });
  };

  return (
    <Box height={"100%"}>
      <Notes
        notes={notes}
        selectedNoteId={openNoteId}
        selectedNoteContent={noteContent}
        openNote={(noteId) => setNoteId(noteId)}
        createNote={() =>
          addCampaignNote({
            campaignId,
            order:
              notes && notes.length > 0 ? notes[notes.length - 1].order + 1 : 1,
          })
        }
        updateNoteOrder={handleNoteReorder}
        onSave={(params) => updateCampaignNote({ campaignId, ...params })}
        onDelete={(noteId) =>
          removeCampaignNote({ campaignId, noteId })
            .then(() => {
              setNoteId(undefined);
            })
            .catch()
        }
        condensedView={isMobile}
      />
    </Box>
  );
}
