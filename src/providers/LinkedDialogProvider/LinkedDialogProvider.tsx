import { Dialog } from "@mui/material";
import { PropsWithChildren, useCallback, useReducer } from "react";
import { LinkedDialogContent } from "./LinkedDialogContent";
import { LinkedDialogContext } from "./LinkedDialogContext";

interface ProviderState {
  isDialogOpen: boolean;
  openDialogId?: string;
  previousOpenDialogIds: string[];
}

enum ACTIONS {
  OPEN_ID,
  BACK,
  CLOSE_ALL,
}

type ReducerActions =
  | {
      type: ACTIONS.OPEN_ID;
      id: string;
    }
  | {
      type: ACTIONS.BACK;
    }
  | {
      type: ACTIONS.CLOSE_ALL;
    };

function reducer(state: ProviderState, action: ReducerActions): ProviderState {
  switch (action.type) {
    case ACTIONS.OPEN_ID:
      if (state.isDialogOpen) {
        const currentId = state.openDialogId;
        if (currentId) {
          return {
            isDialogOpen: true,
            openDialogId: action.id,
            previousOpenDialogIds: [...state.previousOpenDialogIds, currentId],
          };
        } else {
          return {
            isDialogOpen: true,
            openDialogId: action.id,
            previousOpenDialogIds: [],
          };
        }
      } else {
        return {
          isDialogOpen: true,
          openDialogId: action.id,
          previousOpenDialogIds: [],
        };
      }
    case ACTIONS.BACK:
      const previousOpenDialogIds = state.previousOpenDialogIds;
      if (previousOpenDialogIds.length > 0) {
        let newIds = [...previousOpenDialogIds];
        const nextId = newIds.pop();

        return {
          isDialogOpen: true,
          openDialogId: nextId,
          previousOpenDialogIds: newIds,
        };
      } else {
        return {
          isDialogOpen: false,
          openDialogId: state.openDialogId,
          previousOpenDialogIds: [],
        };
      }
    case ACTIONS.CLOSE_ALL:
      return {
        isDialogOpen: false,
        openDialogId: state.openDialogId,
        previousOpenDialogIds: [],
      };
  }
}

export function LinkedDialogProvider(props: PropsWithChildren) {
  const { children } = props;

  const [state, dispatch] = useReducer(reducer, {
    isDialogOpen: false,
    previousOpenDialogIds: [],
  });

  const { isDialogOpen, openDialogId, previousOpenDialogIds } = state;

  const openDialog = useCallback((id: string) => {
    dispatch({
      type: ACTIONS.OPEN_ID,
      id,
    });
  }, []);

  const handleBack = useCallback(() => {
    dispatch({
      type: ACTIONS.BACK,
    });
  }, []);

  const handleClose = useCallback(() => {
    dispatch({
      type: ACTIONS.CLOSE_ALL,
    });
  }, []);

  return (
    <LinkedDialogContext.Provider value={{ openDialog }}>
      <Dialog open={isDialogOpen} onClose={() => handleBack()}>
        <LinkedDialogContent
          id={openDialogId}
          isLastItem={previousOpenDialogIds.length === 0}
          handleBack={handleBack}
          handleClose={handleClose}
        />
      </Dialog>
      {children}
    </LinkedDialogContext.Provider>
  );
}
