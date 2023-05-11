import {
  StepButton,
  StepContent,
  StepLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useWorldCreateStore } from "../worldCreate.store";
import { StepButtons } from "./StepButtons";

export function WorldBasicsStep() {
  const worldName = useWorldCreateStore((store) => store.name);
  const stepState = useWorldCreateStore((store) => store.stepState[0]);

  const setWorldName = useWorldCreateStore((store) => store.setName);

  const setCurrentStep = useWorldCreateStore((store) => store.setCurrentStep);

  return (
    <>
      <StepButton
        onClick={() => setCurrentStep(0)}
        optional={
          stepState.touched &&
          stepState.errorMessage && (
            <Typography variant={"caption"} color={"error"}>
              {stepState.errorMessage}
            </Typography>
          )
        }
      >
        <StepLabel error={stepState.touched && !!stepState.errorMessage}>
          World Basics
        </StepLabel>
      </StepButton>
      <StepContent>
        <TextField
          label={"World Name"}
          value={worldName}
          onChange={(evt) => setWorldName(evt.currentTarget.value)}
        />
        <StepButtons />
      </StepContent>
    </>
  );
}
