import {
  Button,
  DialogActions,
  DialogContent,
  Stack,
  TextField,
} from "@mui/material";
import { DialogTitleWithCloseButton } from "components/shared/DialogTitleWithCloseButton";
import { MarkdownEditor } from "components/shared/RichTextEditor/MarkdownEditor";
import { convertIdPart } from "functions/dataswornIdEncoder";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useStore } from "stores/store";
import {
  GenericStoredMove,
  MoveType,
  StoredMove,
} from "types/homebrew/HomebrewMoves.type";
import { MoveAutocomplete } from "../MoveAutocomplete";
import { MoveTypeInput } from "./MoveTypeInput";
import { MoveTypeFieldWrapper } from "./MoveTypeFieldWrapper";
import { LegacyTrackAutocomplete } from "../../RulesSection/LegacyTracks/LegacyTrackAutocomplete";
import { ConditionMeterAutocomplete } from "../../RulesSection/ConditionMeters/ConditionMeterAutocomplete";
import { StatAutocomplete } from "../../RulesSection/Stats/StatAutocomplete";
import { ProgressTrackSelect } from "./ProgressTrackSelect";

export interface MoveFormDialogProps {
  homebrewId: string;
  categoryId: string;
  existingMoveId?: string;
  onClose: () => void;
}

export interface Form {
  label: string;
  text: string;
  replacesId?: string;
  oracles?: string[];
  type: MoveType;
  stats?: string[];
  conditionMeters?: string[];
  assetControls?: string[];
  progressRollCategory?: string;
  specialTracks?: string[];
}

export function MoveDialogForm(props: MoveFormDialogProps) {
  const { homebrewId, categoryId, existingMoveId, onClose } = props;

  const moves = useStore(
    (store) => store.homebrew.collections[homebrewId]?.moves?.data ?? {}
  );

  const existingMove = existingMoveId ? moves[existingMoveId] : undefined;

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, disabled },
    control,
  } = useForm<Form>({
    disabled: loading,
    defaultValues: existingMove
      ? {
          label: existingMove.label,
          text: existingMove.text,
          replacesId: existingMove.replacesId,
          oracles: existingMove.oracles,
          type: existingMove.type,
          stats:
            existingMove.type === MoveType.ActionRoll
              ? existingMove.stats
              : undefined,
          conditionMeters:
            existingMove.type === MoveType.ActionRoll
              ? existingMove.conditionMeters
              : undefined,
          assetControls:
            existingMove.type === MoveType.ActionRoll
              ? existingMove.assetControls
              : undefined,
          progressRollCategory:
            existingMove.type === MoveType.ProgressRoll
              ? existingMove.category
              : undefined,
          specialTracks:
            existingMove.type === MoveType.SpecialTrack
              ? existingMove.specialTracks
              : undefined,
        }
      : {},
  });

  const createMove = useStore((store) => store.homebrew.createMove);
  const updateMove = useStore((store) => store.homebrew.updateMove);

  const onSubmit: SubmitHandler<Form> = (values) => {
    setLoading(true);

    let move: StoredMove;
    const genericMove: GenericStoredMove = {
      collectionId: homebrewId,
      categoryId: categoryId,
      label: values.label,
      text: values.text,
      type: values.type,
    };

    if (values.replacesId) {
      genericMove.replacesId = values.replacesId;
    }
    if (values.oracles) {
      genericMove.oracles = values.oracles;
    }

    if (genericMove.type === MoveType.NoRoll) {
      move = {
        ...genericMove,
        type: MoveType.NoRoll,
      };
    }
    if (genericMove.type === MoveType.ActionRoll) {
      move = {
        ...genericMove,
        type: MoveType.ActionRoll,
        stats: values.stats ?? [],
        conditionMeters: values.conditionMeters ?? [],
        assetControls: values.assetControls ?? [],
      };
    } else if (genericMove.type === MoveType.ProgressRoll) {
      if (values.progressRollCategory) {
        move = {
          ...genericMove,
          type: MoveType.ProgressRoll,
          category: values.progressRollCategory,
        };
      } else {
        throw new Error("Move had no progress category associated.");
      }
    } else {
      move = {
        ...genericMove,
        type: MoveType.SpecialTrack,
        specialTracks: values.specialTracks ?? [],
      };
    }

    if (existingMoveId) {
      updateMove(existingMoveId, move)
        .then(() => {
          setLoading(false);
          onClose();
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      createMove(move)
        .then(() => {
          setLoading(false);
          onClose();
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };

  return (
    <>
      <DialogTitleWithCloseButton onClose={onClose}>
        {existingMove ? `Edit ${existingMove.label}` : "Create Move"}
      </DialogTitleWithCloseButton>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              disabled={disabled}
              label={"Category Label"}
              fullWidth
              error={touchedFields.label && !!errors.label}
              helperText={
                touchedFields.label && errors.label
                  ? errors.label.message
                  : undefined
              }
              inputProps={{
                defaultValue: "",
                ...register("label", {
                  required: "This field is required.",
                  validate: (value) => {
                    if (!existingMoveId && value) {
                      try {
                        const id = convertIdPart(value);
                        if (moves[id]) {
                          return `You already have a move with id ${id}. Please try a different label.`;
                        }
                      } catch (e) {
                        return "Failed to parse a valid ID for your Move. Please use at least three letters or numbers in your label.";
                      }
                    }
                  },
                }),
              }}
            />
            <Controller
              name='text'
              control={control}
              render={({ field }) => (
                <MarkdownEditor
                  label={"Move Text"}
                  content={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
            <Controller
              name={"replacesId"}
              control={control}
              render={({ field }) => (
                <MoveAutocomplete
                  label={"Replaces Move"}
                  value={field.value}
                  onChange={(ids) => field.onChange(ids)}
                  onBlur={field.onBlur}
                  disabled={disabled}
                  helperText={"Replaces an existing move with this one."}
                />
              )}
            />
            <MoveTypeInput control={control} />
            <MoveTypeFieldWrapper
              moveType={MoveType.ActionRoll}
              control={control}
            >
              <Controller
                name={"stats"}
                control={control}
                render={({ field }) => (
                  <StatAutocomplete
                    value={field.value ?? []}
                    onChange={(ids) => field.onChange(ids)}
                    onBlur={field.onBlur}
                    disabled={disabled}
                  />
                )}
              />
              <Controller
                name={"conditionMeters"}
                control={control}
                render={({ field }) => (
                  <ConditionMeterAutocomplete
                    value={field.value ?? []}
                    onChange={(ids) => field.onChange(ids)}
                    onBlur={field.onBlur}
                    disabled={disabled}
                  />
                )}
              />
            </MoveTypeFieldWrapper>
            <MoveTypeFieldWrapper
              moveType={MoveType.ProgressRoll}
              control={control}
            >
              <Controller
                name={"progressRollCategory"}
                control={control}
                render={({ field }) => (
                  <ProgressTrackSelect
                    value={field.value}
                    onChange={(category) => field.onChange(category)}
                    onBlur={field.onBlur}
                    disabled={disabled}
                    helperText={
                      "Progress Track Categories you would like to roll against"
                    }
                  />
                )}
              />
            </MoveTypeFieldWrapper>
            <MoveTypeFieldWrapper
              moveType={MoveType.SpecialTrack}
              control={control}
            >
              <Controller
                name={"specialTracks"}
                control={control}
                render={({ field }) => (
                  <LegacyTrackAutocomplete
                    multiple
                    value={field.value}
                    onChange={(ids) => field.onChange(ids)}
                    onBlur={field.onBlur}
                    disabled={disabled}
                    helperText={"Legacy Tracks you would like to roll against"}
                  />
                )}
              />
            </MoveTypeFieldWrapper>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button type={"reset"} color={"inherit"} onClick={onClose}>
            Cancel
          </Button>
          <Button type={"submit"} variant={"contained"} onClick={() => {}}>
            Save
          </Button>
        </DialogActions>
      </form>
    </>
  );
}
