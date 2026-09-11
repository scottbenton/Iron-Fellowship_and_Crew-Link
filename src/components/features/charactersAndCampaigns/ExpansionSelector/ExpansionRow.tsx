import { Box, FormControlLabel, Switch, Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import { IExpansionConfig } from "data/rulesets";

export interface ExpansionRowProps {
  config: IExpansionConfig;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ExpansionRow(props: ExpansionRowProps) {
  const { config, checked, onChange } = props;

  const label = config.note ? (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      {config.name}
      <Tooltip title={config.note}>
        <InfoIcon fontSize="small" color="action" />
      </Tooltip>
    </Box>
  ) : (
    config.name
  );

  return (
    <FormControlLabel
      control={<Switch checked={checked} onChange={(_, c) => onChange(c)} />}
      label={label}
    />
  );
}
