import { Alert, Step, Stepper } from "@mui/material";
import { PageBanner } from "components/Layout/PageBanner";
import { truths } from "data/truths";
import { WorldBasicsStep } from "./components/WorldBasicsStep";
import { TruthStep } from "./components/TruthStep";
import { useWorldCreateStore } from "./worldCreate.store";
import { useEffect } from "react";

export function WorldCreatePage() {
  const currentStep = useWorldCreateStore((store) => store.currentStep);
  const resetStore = useWorldCreateStore((store) => store.resetStore);

  useEffect(() => {
    return () => {
      resetStore();
    };
  }, []);

  return (
    <>
      <PageBanner>Create your World</PageBanner>
      <Alert color="info" sx={{ my: 2 }}>
        Worlds allow you to share truths, locations, and NPCs across multiple
        characters or campaigns.
      </Alert>
      <Stepper nonLinear activeStep={currentStep} orientation="vertical">
        <Step>
          <WorldBasicsStep />
        </Step>
        {truths.map((truth, index) => (
          <Step key={index}>
            <TruthStep key={index} index={index + 1} truth={truth} />
          </Step>
        ))}
      </Stepper>
    </>
  );
}
