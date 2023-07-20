import { Alert, Step, Stepper } from "@mui/material";
import { truths } from "data/truths";
import { WorldBasicsStep } from "./components/WorldBasicsStep";
import { TruthStep } from "./components/TruthStep";
import { useWorldCreateStore } from "./worldCreate.store";
import { useEffect } from "react";
import { PageContent, PageHeader } from "components/Layout";
import { Head } from "providers/HeadProvider/Head";

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
      <Head
        title={"Create a World"}
        description={"Create a new world in Iron Fellowship."}
      />
      <PageHeader label={"Create your World"} />
      <PageContent isPaper>
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
      </PageContent>
    </>
  );
}
