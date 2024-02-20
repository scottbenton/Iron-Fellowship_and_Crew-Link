import { Box } from "@mui/material";
import { SectionHeading } from "components/shared/SectionHeading";
import { Stats } from "./Stats";
import { ConditionMeters } from "./ConditionMeters";
import { Impacts } from "./Impacts";
import { LegacyTracks } from "./LegacyTracks";

export interface RulesSectionProps {
  id: string;
}

export function RulesSection(props: RulesSectionProps) {
  const { id } = props;

  return (
    <Box
      sx={{
        ["&>:not(:last-child)"]: {
          mb: 2,
        },
      }}
    >
      <SectionHeading breakContainer label={"Stats"} />
      <Stats homebrewId={id} />
      <SectionHeading breakContainer label={"Condition Meters"} />
      <ConditionMeters homebrewId={id} />
      <SectionHeading breakContainer label={"Impacts / Debilities"} />
      <Impacts homebrewId={id} />
      <SectionHeading breakContainer label={"Legacy Tracks"} />
      <LegacyTracks homebrewId={id} />
    </Box>
  );
}
