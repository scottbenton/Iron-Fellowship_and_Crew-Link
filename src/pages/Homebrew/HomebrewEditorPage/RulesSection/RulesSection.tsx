import { Box } from "@mui/material";
import { SectionHeading } from "components/shared/SectionHeading";

export interface RulesSectionProps {
  id: string;
}

export function RulesSection(props: RulesSectionProps) {
  const { id } = props;

  console.debug(id);

  return (
    <Box
      sx={{
        ["&>:not(:last-of-type)"]: {
          mb: 2,
        },
      }}
    >
      <SectionHeading breakContainer label={"Stats"} />
      <SectionHeading breakContainer label={"Condition Meters"} />
      <SectionHeading breakContainer label={"Impacts"} />
      <SectionHeading breakContainer label={"Special Tracks"} />
    </Box>
  );
}
