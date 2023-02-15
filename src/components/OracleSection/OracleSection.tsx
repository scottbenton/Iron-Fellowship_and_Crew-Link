import { Box, Button } from "@mui/material";
import { useRoller } from "components/DieRollProvider";
import {
  oracleRollChanceNames,
  ORACLE_ROLL_CHANCE,
} from "components/DieRollProvider/DieRollContext";
import { oracles } from "data/oracles";
import { OracleCategory } from "./OracleCategory";

export function OracleSection() {
  const { rollOracle } = useRoller();
  return (
    <>
      <Box display={"flex"} flexWrap={"wrap"} p={1}>
        <Button
          sx={{ mx: 0.5, my: 0.5 }}
          variant={"outlined"}
          color={"primary"}
          onClick={() => rollOracle(ORACLE_ROLL_CHANCE.SMALL_CHANCE)}
        >
          {oracleRollChanceNames[ORACLE_ROLL_CHANCE.SMALL_CHANCE]}
        </Button>
        <Button
          sx={{ mx: 0.5, my: 0.5 }}
          variant={"outlined"}
          color={"primary"}
          onClick={() => rollOracle(ORACLE_ROLL_CHANCE.UNLIKELY)}
        >
          {oracleRollChanceNames[ORACLE_ROLL_CHANCE.UNLIKELY]}
        </Button>
        <Button
          sx={{ mx: 0.5, my: 0.5 }}
          variant={"outlined"}
          color={"primary"}
          onClick={() => rollOracle(ORACLE_ROLL_CHANCE.FIFTY_FIFTY)}
        >
          {oracleRollChanceNames[ORACLE_ROLL_CHANCE.FIFTY_FIFTY]}
        </Button>
        <Button
          sx={{ mx: 0.5, my: 0.5 }}
          variant={"outlined"}
          color={"primary"}
          onClick={() => rollOracle(ORACLE_ROLL_CHANCE.LIKELY)}
        >
          {oracleRollChanceNames[ORACLE_ROLL_CHANCE.LIKELY]}
        </Button>
        <Button
          sx={{ mx: 0.5, my: 0.5 }}
          variant={"outlined"}
          color={"primary"}
          onClick={() => rollOracle(ORACLE_ROLL_CHANCE.ALMOST_CERTAIN)}
        >
          {oracleRollChanceNames[ORACLE_ROLL_CHANCE.ALMOST_CERTAIN]}
        </Button>
      </Box>
      {oracles.map((category) => (
        <OracleCategory category={category} key={category.name} />
      ))}
    </>
  );
}
