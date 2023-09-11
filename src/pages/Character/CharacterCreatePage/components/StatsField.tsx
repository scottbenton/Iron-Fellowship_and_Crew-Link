import { Box, Link, Typography } from "@mui/material";
import { useField } from "formik";
import { useState } from "react";
import { Stat } from "types/stats.enum";
import { StatInput } from "./StatInput";

export function StatsField() {
  const [field, meta, handlers] = useField({ name: "stats" });

  const [statsRemainingTracker, setStatsRemainingTracker] = useState<number[]>([
    3, 2, 2, 1, 1,
  ]);

  const [isCustomStatsEnabled, setIsCustomStatsEnabled] =
    useState<boolean>(false);

  const toggleCustomStats = () => {
    handlers.setValue({
      [Stat.Edge]: undefined,
      [Stat.Heart]: undefined,
      [Stat.Iron]: undefined,
      [Stat.Shadow]: undefined,
      [Stat.Wits]: undefined,
    });
    setStatsRemainingTracker([3, 2, 2, 1, 1]);
    setIsCustomStatsEnabled((prevValue) => !prevValue);
  };

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
    <Box mt={3}>
      <Typography
        display={"flex"}
        alignItems={"baseline"}
        color={(theme) => theme.palette.text.secondary}
      >
        {isCustomStatsEnabled
          ? "Enter a number for each stat."
          : "Select a number 1-3 for each stat."}
        <Link
          component={"button"}
          type={"button"}
          sx={{ ml: 1 }}
          color={"inherit"}
          variant={"inherit"}
          onClick={() => toggleCustomStats()}
        >
          {isCustomStatsEnabled
            ? "Use standard stats instead."
            : "Use custom stat values"}
        </Link>
      </Typography>

      <Box mt={0.5} display={"flex"} flexWrap={"wrap"}>
        <StatInput
          stat={Stat.Edge}
          label={"Edge"}
          remainingOptions={statsRemainingTracker}
          handleRemainingOptionsChange={handleStatsRemainingChange}
          allowAnyNumber={isCustomStatsEnabled}
        />
        <StatInput
          stat={Stat.Heart}
          label={"Heart"}
          remainingOptions={statsRemainingTracker}
          handleRemainingOptionsChange={handleStatsRemainingChange}
          allowAnyNumber={isCustomStatsEnabled}
        />
        <StatInput
          stat={Stat.Iron}
          label={"Iron"}
          remainingOptions={statsRemainingTracker}
          handleRemainingOptionsChange={handleStatsRemainingChange}
          allowAnyNumber={isCustomStatsEnabled}
        />
        <StatInput
          stat={Stat.Shadow}
          label={"Shadow"}
          remainingOptions={statsRemainingTracker}
          handleRemainingOptionsChange={handleStatsRemainingChange}
          allowAnyNumber={isCustomStatsEnabled}
        />
        <StatInput
          stat={Stat.Wits}
          label={"Wits"}
          remainingOptions={statsRemainingTracker}
          handleRemainingOptionsChange={handleStatsRemainingChange}
          allowAnyNumber={isCustomStatsEnabled}
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
