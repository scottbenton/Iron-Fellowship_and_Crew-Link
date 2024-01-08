import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  DialogActions,
  DialogContent,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { ChangeEvent, useState } from "react";

export enum ORACLE_TABLE_TYPE {
  SIMPLE = "simple",
  SHARED_ROLLS = "shared-rolls",
  SHARED_RESULTS = "shared-results",
}

export interface SelectTableTypeFormProps {
  setTableType: (type: ORACLE_TABLE_TYPE) => void;
  onClose: () => void;
}

const types: {
  type: ORACLE_TABLE_TYPE;
  name: string;
  description: string;
  example?: string;
}[] = [
  {
    type: ORACLE_TABLE_TYPE.SIMPLE,
    name: "Simple Table",
    description:
      "Standard oracle tables with a roll column, a result column, and an optional details column.",
  },
  {
    type: ORACLE_TABLE_TYPE.SHARED_ROLLS,
    name: "Grouped Table (Shared Rolls)",
    description:
      "Multiple related oracle tables that share roll odds, but have different results.",
    example: "(ex: Starforged Character Name Oracles).",
  },
  {
    type: ORACLE_TABLE_TYPE.SHARED_RESULTS,
    name: "Grouped Table (Shared Results)",
    description: "Multiple oracle tables that share one set of results.",
    example: "(ex: Starforged Planetside Peril Oracle).",
  },
];

export function SelectTableTypeForm(props: SelectTableTypeFormProps) {
  const { setTableType, onClose } = props;

  const [selectedOracleTableType, setSelectedOracleTableType] =
    useState<ORACLE_TABLE_TYPE>(ORACLE_TABLE_TYPE.SIMPLE);

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setSelectedOracleTableType(evt.target.value as ORACLE_TABLE_TYPE);
  };

  return (
    <>
      <DialogContent>
        <FormControl>
          <FormLabel id={"oracle-type-label"}>Oracle Type</FormLabel>
          <Alert severity="info" sx={{ mt: 1, mb: 2 }}>
            Once you create your oracle, this cannot be changed.
          </Alert>
          <RadioGroup
            aria-labelledby="oracle-type-label"
            name={"oracle-type"}
            value={selectedOracleTableType}
            onChange={handleChange}
            sx={{
              ["&>:not(:last-of-type)"]: {
                mb: 2,
              },
            }}
          >
            {types.map((type) => (
              <Card variant={"outlined"} key={type.type}>
                <CardActionArea
                  sx={{ p: 2, "&>input": { display: "none" } }}
                  component={"label"}
                >
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant={"h6"}>{type.name}</Typography>
                    <Box
                      sx={(theme) => ({
                        w: theme.spacing(3),
                        h: theme.spacing(3),
                      })}
                    >
                      <Radio value={type.type} />
                    </Box>
                  </Box>
                  <Typography color={"text.secondary"} variant={"body2"}>
                    {type.description}
                  </Typography>
                  <Typography color={"text.secondary"} variant={"body2"}>
                    {type.example}
                  </Typography>
                </CardActionArea>
              </Card>
            ))}
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button color={"inherit"} onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant={"contained"}
          onClick={() => setTableType(selectedOracleTableType)}
        >
          Continue
        </Button>
      </DialogActions>
    </>
  );
}
