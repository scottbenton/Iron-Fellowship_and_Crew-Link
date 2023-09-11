import { Box, Button } from "@mui/material";
import { truths } from "data/truths";
import { useSnackbar } from "providers/SnackbarProvider/useSnackbar";
import { useNavigate } from "react-router-dom";
import { useWorldCreateStore } from "../worldCreate.store";
import { constructWorldSheetPath } from "pages/World/routes";
import { useStore } from "stores/store";
import { useState } from "react";

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

  const createWorld = useStore((store) => store.worlds.createWorld);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onSubmit = () => {
    setLoading(true);
    getWorldFromState()
      .then((world) => {
        createWorld(world)
          .then((worldId) => {
            navigate(constructWorldSheetPath(worldId));
          })
          .catch((e) => {})
          .finally(() => setLoading(false));
      })
      .catch((e) => {
        error(e);
        setLoading(false);
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
        color={"inherit"}
      >
        Back
      </Button>
    </Box>
  );
}
