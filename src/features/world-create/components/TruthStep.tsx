import {
  Box,
  Button,
  Card,
  Grid,
  Stack,
  StepButton,
  StepContent,
  StepLabel,
  TextField,
  Typography,
} from "@mui/material";
import { TruthClassic } from "dataforged";
import { TRUTH_IDS } from "types/World.type";
import { getCustomTruthId, useWorldCreateStore } from "../worldCreate.store";
import { StepButtons } from "./StepButtons";
import CheckIcon from "@mui/icons-material/CheckCircle";
import { TruthChooser } from "components/TruthChooser";
import { useEffect, useRef } from "react";

export interface TruthStepProps {
  truth: TruthClassic;
  index: number;
}

export function TruthStep(props: TruthStepProps) {
  const { truth, index } = props;

  const stepButtonRef = useRef<HTMLButtonElement>(null);

  const openStepIndex = useWorldCreateStore((store) => store.currentStep);

  const truthId = truth.$id as TRUTH_IDS;
  const customTruthId = getCustomTruthId(truthId);

  const selectedOption = useWorldCreateStore(
    (store) => store.truths[truthId]?.id
  );
  const stepState = useWorldCreateStore((store) => store.stepState[index]);

  const setSelectedOption = useWorldCreateStore(
    (store) => store.selectWorldTruth
  );
  const setOpenStep = useWorldCreateStore((store) => store.setCurrentStep);

  const customDescription = useWorldCreateStore(
    (store) => store.customTruths[truthId]?.Description
  );
  const customQuestStarter = useWorldCreateStore(
    (store) => store.customTruths[truthId]?.["Quest starter"]
  );

  const setCustomDescription = useWorldCreateStore(
    (store) => store.setCustomWorldTruthDescription
  );
  const setCustomQuestStarter = useWorldCreateStore(
    (store) => store.setCustomWorldTruthQuestStarter
  );

  useEffect(() => {
    if (openStepIndex === index) {
      stepButtonRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [index, openStepIndex]);

  return (
    <>
      <StepButton
        ref={stepButtonRef}
        onClick={() => setOpenStep(index)}
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
          Truths: {truth.Title.Standard}
        </StepLabel>
      </StepButton>
      <StepContent>
        <TruthChooser
          truthId={truthId}
          selectedTruthOptionId={selectedOption}
          selectTruthOption={(truthOptionId) =>
            setSelectedOption(truthId, truthOptionId)
          }
          customDescription={customDescription}
          changeCustomTruthDescription={(description) =>
            setCustomDescription(truthId, description)
          }
          customTruthQuestStarter={customQuestStarter}
          changeCustomTruthQuestStarter={(questStarter) =>
            setCustomQuestStarter(truthId, questStarter)
          }
        />
        <StepButtons />
      </StepContent>
    </>
  );
}
