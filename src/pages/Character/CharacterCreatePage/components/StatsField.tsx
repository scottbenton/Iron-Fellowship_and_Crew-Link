import { Box, Typography } from "@mui/material";
import { useField } from "formik";
import { useState } from "react";
import { Stat } from "types/stats.enum";
import { StatDropdown } from "./StatDropdown";

export function StatsField() {
  const [field, meta] = useField({ name: "stats" });

  const [statsRemainingTracker, setStatsRemainingTracker] = useState<number[]>([
    3, 2, 2, 1, 1,
  ]);

  const handleStatsRemainingChange = (
    previousValue: number | undefined,
    newValue: number | undefined
  ) => {
    setStatsRemainingTracker((prevStatsRemaining) => {
      let newStatsRemaining = [...prevStatsRemaining];

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

  return (
    <Box mt={2}>
      <Typography color={(theme) => theme.palette.text.secondary}>
        Select a number 1-3 for each stat.
      </Typography>
      <Box mt={0.5} display={"flex"} flexWrap={"wrap"}>
        <StatDropdown
          stat={Stat.Edge}
          label={"Edge"}
          remainingOptions={statsRemainingTracker}
          handleRemainingOptionsChange={handleStatsRemainingChange}
        />
        <StatDropdown
          stat={Stat.Heart}
          label={"Heart"}
          remainingOptions={statsRemainingTracker}
          handleRemainingOptionsChange={handleStatsRemainingChange}
        />
        <StatDropdown
          stat={Stat.Iron}
          label={"Iron"}
          remainingOptions={statsRemainingTracker}
          handleRemainingOptionsChange={handleStatsRemainingChange}
        />
        <StatDropdown
          stat={Stat.Shadow}
          label={"Shadow"}
          remainingOptions={statsRemainingTracker}
          handleRemainingOptionsChange={handleStatsRemainingChange}
        />
        <StatDropdown
          stat={Stat.Wits}
          label={"Wits"}
          remainingOptions={statsRemainingTracker}
          handleRemainingOptionsChange={handleStatsRemainingChange}
        />
      </Box>
      {meta.touched && meta.error && (
        <Typography variant={"caption"} color={"error"}>
          {meta.error}
        </Typography>
      )}
    </Box>
  );
}
