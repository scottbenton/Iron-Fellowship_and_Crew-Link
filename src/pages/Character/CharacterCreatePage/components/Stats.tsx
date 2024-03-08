import { Control, Controller } from "react-hook-form";
import { Form } from "../CharacterCreatePageContent";
import { useStore } from "stores/store";
import { SectionHeading } from "components/shared/SectionHeading";
import { Alert, Box, Link, Typography } from "@mui/material";
import { useState } from "react";
import { StatInput } from "./StatInput";

export interface StatsProps {
  control: Control<Form>;
}

const standardArray = [3, 2, 2, 1, 1];

export function Stats(props: StatsProps) {
  const { control } = props;

  const stats = useStore((store) => store.rules.stats);

  const numberOfStats = Object.keys(stats).length;
  const canUseStandardArray = numberOfStats === standardArray.length;
  const [usingStandardArray, setUsingStandardArray] = useState(true);

  const showStandardArrayInputs = canUseStandardArray && usingStandardArray;

  const [statsRemainingTracker, setStatsRemainingTracker] = useState<number[]>([
    ...standardArray,
  ]);

  const handleStatsRemainingChange = (
    previousValue: number | undefined,
    newValue: number | undefined
  ) => {
    setStatsRemainingTracker((prevStatsRemaining) => {
      const newStatsRemaining = [...prevStatsRemaining];

      if (typeof previousValue === "number") {
        newStatsRemaining.push(previousValue);
        newStatsRemaining.sort((a, b) => b - a);
      }
      if (typeof newValue === "number") {
        const index = newStatsRemaining.indexOf(newValue);
        newStatsRemaining.splice(index, 1);
      }
      return newStatsRemaining;
    });
  };

  const toggleCustomStats = () => {
    setStatsRemainingTracker([...standardArray]);
    setUsingStandardArray((prevValue) => !prevValue);
  };

  return (
    <>
      <SectionHeading breakContainer label={"Stats"} />
      <Controller
        name={"stats"}
        defaultValue={{}}
        control={control}
        rules={{
          required: "Stats are required",
          validate: (statValues) => {
            for (const statKey of Object.keys(stats)) {
              if (typeof statValues[statKey] !== "number") {
                return "All stats must have a value";
              }
            }
          },
        }}
        render={({ field, fieldState }) => (
          <>
            <Box>
              <Typography
                display={"flex"}
                alignItems={"baseline"}
                color={(theme) => theme.palette.text.secondary}
                sx={{ mr: 1 }}
              >
                {showStandardArrayInputs
                  ? "Select a number 1-3 for each stat."
                  : "Enter a number for each stat."}
              </Typography>
              {canUseStandardArray && (
                <Link
                  component={"button"}
                  type={"button"}
                  color={"inherit"}
                  variant={"inherit"}
                  onClick={() => {
                    field.onChange({});
                    toggleCustomStats();
                  }}
                >
                  {showStandardArrayInputs
                    ? "Use custom stat values."
                    : "Use standard stats instead."}
                </Link>
              )}
            </Box>

            {fieldState.error && (
              <Alert severity='error'>
                {fieldState.error.message ??
                  "Invalid stats. Please make sure all stats are present."}
              </Alert>
            )}

            <Box display={"flex"} flexWrap={"wrap"}>
              {Object.keys(stats).map((statKey) => (
                <StatInput
                  key={statKey}
                  label={stats[statKey].label}
                  description={stats[statKey].description}
                  value={field.value[statKey]}
                  updateValue={(value) =>
                    field.onChange({ ...field.value, [statKey]: value })
                  }
                  remainingOptions={statsRemainingTracker}
                  handleRemainingOptionsChange={handleStatsRemainingChange}
                  allowAnyNumber={!showStandardArrayInputs}
                />
              ))}
            </Box>
          </>
        )}
      />
    </>
  );
}
