import { Box } from "@mui/material";
import { SectorMap } from "./SectorMap";
import { DebouncedOracleInput } from "components/shared/DebouncedOracleInput";

export function SectorSection() {
  return (
    <Box>
      <DebouncedOracleInput
        label={"Sector Name"}
        oracleTableId={[
          "starforged/oracles/space/sector_name/prefix",
          "starforged/oracles/space/sector_name/suffix",
        ]}
        joinOracleTables
        initialValue=""
        updateValue={() => {}}
        variant={"filled"}
        sx={(theme) => ({
          "& .MuiInputBase-root": {
            borderRadius: 0,
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor:
                theme.palette.grey[theme.palette.mode === "light" ? 100 : 800],
            },
          },
        })}
      />
      <SectorMap />
    </Box>
  );
}
