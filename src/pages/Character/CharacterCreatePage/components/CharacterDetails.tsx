import { SectionHeading } from "components/shared/SectionHeading";
import { Control, Controller, UseFormWatch } from "react-hook-form";
import { Form } from "../CharacterCreatePageContent";
import { TextFieldWithOracle } from "components/shared/TextFieldWithOracle/TextFieldWithOracle";
import { useCallback } from "react";
import { useRoller } from "stores/appState/useRoller";
import { useGameSystemValue } from "hooks/useGameSystemValue";
import { GAME_SYSTEMS } from "types/GameSystems.type";
import { Box } from "@mui/material";
import { ImageInput } from "./ImageInput";

export interface CharacterDetailsProps {
  control: Control<Form>;
  watch: UseFormWatch<Form>;
}

const nameOraclesIronsworn = [
  "classic/oracles/name/ironlander/a",
  "classic/oracles/name/ironlander/b",
];

const nameOracleStarforged = [
  "starforged/oracles/characters/name/given",
  "starforged/oracles/characters/name/family_name",
];

export function CharacterDetails(props: CharacterDetailsProps) {
  const { control, watch } = props;
  const { rollOracleTableNew } = useRoller();

  const nameOracles = useGameSystemValue({
    [GAME_SYSTEMS.IRONSWORN]: nameOraclesIronsworn,
    [GAME_SYSTEMS.STARFORGED]: nameOracleStarforged,
  });
  const joinOracles = useGameSystemValue({
    [GAME_SYSTEMS.IRONSWORN]: false,
    [GAME_SYSTEMS.STARFORGED]: true,
  });

  const handleOracleRoll = useCallback(() => {
    if (joinOracles) {
      return nameOracles
        .map((id) => rollOracleTableNew(id, false)?.result ?? "")
        .join(" ");
    } else {
      const oracleIndex = Math.floor(Math.random() * nameOracles.length);

      return rollOracleTableNew(nameOracles[oracleIndex], false)?.result ?? "";
    }
  }, [rollOracleTableNew, nameOracles, joinOracles]);

  return (
    <>
      <SectionHeading
        breakContainer
        label={"Character Details"}
        sx={(theme) => ({
          borderTopRightRadius: theme.shape.borderRadius,
          borderTopLeftRadius: theme.shape.borderRadius,
        })}
      />
      <Box display={"flex"} alignItems={"center"}>
        <Controller
          name={"portrait"}
          control={control}
          render={({ field }) => (
            <ImageInput
              value={field.value}
              onChange={field.onChange}
              watch={watch}
            />
          )}
        />
        <Controller
          name={"name"}
          control={control}
          defaultValue=''
          rules={{ required: "Character name is required." }}
          render={({ field, fieldState, formState }) => (
            <TextFieldWithOracle
              InputLabelProps={{ shrink: true }}
              getOracleValue={() => handleOracleRoll() ?? ""}
              disabled={formState.disabled}
              label={"Character Name"}
              fullWidth
              color={"primary"}
              error={!!fieldState.error}
              helperText={
                fieldState.error ? fieldState.error.message : undefined
              }
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              sx={{ maxWidth: 350, ml: 2 }}
            />
          )}
        />
      </Box>
    </>
  );
}
