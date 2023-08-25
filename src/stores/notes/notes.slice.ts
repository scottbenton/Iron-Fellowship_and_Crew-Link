import { CreateSliceType } from "stores/store.type";
import { NotesSlice } from "./notes.slice.type";
import { defaultNotesSlice } from "./notes.slice.default";
import { listenToNotes } from "api-calls/notes/listenToNotes";
import { Store } from "@mui/icons-material";
import { getErrorMessage } from "functions/getErrorMessage";
import { listenToNoteContent } from "api-calls/notes/listenToNoteContent";
import { addNote } from "api-calls/notes/addNote";
import { updateNote } from "api-calls/notes/updateNote";
import { updateNoteOrder } from "api-calls/notes/updateNoteOrder";
import { removeNote } from "api-calls/notes/removeNote";

export const createNotesSlice: CreateSliceType<NotesSlice> = (
  set,
  getState
) => ({
  ...defaultNotesSlice,

  subscribe: (campaignId, characterId) => {
    if (!campaignId && !characterId) {
      return () => {};
    }
    set((store) => {
      store.notes.loading = true;
    });
    return listenToNotes(
      campaignId,
      characterId,
      (notes) => {
        set((store) => {
          store.notes.loading = false;
          store.notes.notes = notes;
          store.notes.error = undefined;
        });
      },
      (error) => {
        console.error(error);
        set((store) => {
          store.notes.loading = false;
          store.notes.error = "Failed to load notes.";
        });
      }
    );
  },

  subscribeToNoteContent: (noteId) => {
    const state = getState();

    const campaignId = state.campaigns.currentCampaign.currentCampaignId;
    const characterId = state.characters.currentCharacter.currentCharacterId;

    if (!campaignId && !characterId) {
      return () => {};
    }

    return listenToNoteContent(
      campaignId,
      characterId,
      noteId,
      (content) => {
        set((store) => {
          if (store.notes.openNoteId === noteId) {
            store.notes.openNoteContent = content ?? null;
          }
        });
      },
      (error) => {
        console.error(error);
      }
    );
  },

  setOpenNoteId: (openNoteId) => {
    set((store) => {
      if (store.notes.openNoteId !== openNoteId) {
        store.notes.openNoteId = openNoteId;
        store.notes.openNoteContent = undefined;
      }
    });
  },

  temporarilyReorderNotes: (noteId, order) => {
    set((store) => {
      const noteIndex = store.notes.notes.findIndex(
        (note) => note.noteId === noteId
      );

      if (typeof noteIndex !== "number" || noteIndex < 0) return;

      store.notes.notes[noteIndex].order = order;
      store.notes.notes.sort((n1, n2) => n1.order - n2.order);
    });
  },

  addNote: (order) => {
    const state = getState();
    const campaignId = state.campaigns.currentCampaign.currentCampaignId;
    const characterId = state.characters.currentCharacter.currentCharacterId;

    return addNote({ campaignId, characterId, order });
  },

  updateNote: (noteId, title, content, isBeaconRequest) => {
    const state = getState();
    const campaignId = state.campaigns.currentCampaign.currentCampaignId;
    const characterId = state.characters.currentCharacter.currentCharacterId;
    return updateNote({
      campaignId,
      characterId,
      noteId,
      title,
      content,
      isBeaconRequest,
    });
  },

  updateNoteOrder: (noteId, order) => {
    const state = getState();
    const campaignId = state.campaigns.currentCampaign.currentCampaignId;
    const characterId = state.characters.currentCharacter.currentCharacterId;

    return updateNoteOrder({ campaignId, characterId, noteId, order });
  },

  removeNote: (noteId) => {
    const state = getState();
    const campaignId = state.campaigns.currentCampaign.currentCampaignId;
    const characterId = state.characters.currentCharacter.currentCharacterId;

    return removeNote({ characterId, campaignId, noteId });
  },

  resetStore: () => {
    set((store) => {
      store.notes = {
        ...store.notes,
        ...defaultNotesSlice,
      };
    });
  },
});
