import {
  Alert,
  Stack,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Box,
  Typography,
  Button,
  Card,
  Grid,
  TextField,
  StepButton,
} from "@mui/material";
import { PageBanner } from "components/Layout/PageBanner";
import { Truth, TRUTH_IDS } from "types/World.type";
import { useState } from "react";
import { truthIds, truths } from "data/truths";
import { WorldBasicsStep } from "./components/WorldBasicsStep";
import { TruthStep } from "./components/TruthStep";
import { useWorldCreateStore } from "./worldCreate.store";
import { StepButtons } from "./components/StepButtons";

// interface FormValues {
//   name: string;
//   truths: { [key in TRUTH_IDS]: Truth };
// }

// const schema = yup.object({
//   name: yup.string().required(),
//   truths: yup.lazy((value) => {
//     const validationObject: { [key in TRUTH_IDS]?: any } = {};
//     truthIds.map((id) => {
//       validationObject[id] = yup.object({
//         id: yup.string().required(),
//         customTruth: yup.object({
//           Description: yup.string().required(),
//           "Quest starter": yup.string().required(),
//         }),
//       });
//     });
//     return yup.object(validationObject);
//   }),
// });

// const steps: { title: string; content: ReactElement }[] = [
//   {
//     title: "World Basics",
//     content: (
//       <>
//         <TextFieldElement name={"name"} label={"World Name"} required />
//       </>
//     ),
//   },
// ];

// truths.forEach((truth) => {
//   steps.push({
//     title: truth.Title.Standard,
//     content: (
//       <Grid container spacing={2}>
//         {truth.Options.map((truthOption, index) => (
//           <Grid key={index} item xs={12} md={6}>
//             <Card
//               key={index}
//               sx={{
//                 p: 2,
//                 height: "100%",
//                 display: "flex",
//                 justifyContent: "space-between",
//                 flexDirection: "column",
//               }}
//               variant={"outlined"}
//             >
//               <Typography>{truthOption.Description}</Typography>

//               <Typography
//                 sx={(theme) => ({
//                   bgcolor: theme.palette.background.default,
//                   borderRadius: theme.shape.borderRadius,
//                   mx: -1,
//                   mb: -0.5,
//                   mt: 1,
//                   px: 1,
//                   py: 0.5,
//                 })}
//               >
//                 <b>Quest Starter: </b>
//                 {truthOption["Quest starter"]}
//               </Typography>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     ),
//   });
// });

export function WorldCreatePage() {
  const currentStep = useWorldCreateStore((store) => store.currentStep);
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
