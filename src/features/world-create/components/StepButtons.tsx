import { Box, Button } from "@mui/material";
import { useCreateWorld } from "api/worlds/createWorld";
import { truths } from "data/truths";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import { useNavigate } from "react-router-dom";
import { constructWorldSheetUrl } from "routes";
import { useWorldCreateStore } from "../worldCreate.store";

export function StepButtons() {
  const { error, success } = useSnackbar();

  const currentStep = useWorldCreateStore((store) => store.currentStep);
  const handlePrevious = useWorldCreateStore(
    (store) => store.handlePreviousStep
  );
  const handleNext = useWorldCreateStore((store) => store.handleNextStep);
  const getWorldFromState = useWorldCreateStore(
    (store) => store.getWorldFromState
  );
  const { createWorld, loading } = useCreateWorld();

  const navigate = useNavigate();
  const uid = useAuth().user?.uid ?? "";

  const onSubmit = () => {
    getWorldFromState()
      .then((world) => {
        createWorld(world)
          .then((worldId) => {
            navigate(constructWorldSheetUrl(uid, worldId));
          })
          .catch((e) => {});
      })
      .catch((e) => {
        error(e);
      });
  };

  return (
    <Box mt={2}>
      <Button
        disabled={currentStep === truths.length + 1 || loading}
        variant={"contained"}
        onClick={
          currentStep === truths.length ? () => onSubmit() : () => handleNext()
        }
      >
        {currentStep === truths.length ? "Finish" : "Next"}
      </Button>
      <Button
        disabled={currentStep === 0 || loading}
        onClick={() => handlePrevious()}
      >
        Back
      </Button>
    </Box>
  );
}
