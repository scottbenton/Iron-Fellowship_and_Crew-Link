import {
  Box,
  ButtonBase,
  Card,
  FormControlLabel,
  Link,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { starforgedTruthOptionMap } from "data/truths";
import { TruthStarforged } from "dataforged";
import { HexboxUnchecked } from "assets/HexboxUnchecked";
import { HexradioChecked } from "assets/HexradioChecked";
import CheckIcon from "@mui/icons-material/CheckCircle";
import { useState } from "react";
import { StarforgedTruthDialogSelector } from "./StarforgedTruthDialogSelector";

export interface StarforgedTruthCardProps {
  truth: TruthStarforged;
  truthOptionId: string;
  hideHeader?: boolean;
  fullHeight?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  selectedSubItemId?: string | null;
  onSelectSubItem?: (id: string) => void;
  customTruth?: {
    description: string;
    questStarter?: string;
  };
  canEdit: boolean;
}

export function StarforgedTruthCard(props: StarforgedTruthCardProps) {
  const {
    truth,
    truthOptionId,
    hideHeader,
    fullHeight,
    onSelect,
    selected,
    selectedSubItemId,
    onSelectSubItem,
    customTruth,
    canEdit,
  } = props;
  const truthOption = starforgedTruthOptionMap[truthOptionId];

  const [editTruthDialogOpen, setEditTruthDialogOpen] = useState(false);

  return (
    <>
      <Card
        onClick={onSelect && !selected ? () => onSelect() : undefined}
        component={onSelect && !selected ? ButtonBase : "div"}
        variant={"outlined"}
        sx={(theme) => ({
          p: 2,
          display: "flex",
          flexDirection: "column",
          height: fullHeight ? "100%" : undefined,
          textAlign: "left",
          borderColor: selected ? theme.palette.primary.light : undefined,
        })}
      >
        {!hideHeader && (
          <Box
            display={"flex"}
            alignItems={"baseline"}
            justifyContent={"space-between"}
          >
            <Typography variant={"h6"}>{truth.Title.Standard}</Typography>
            {canEdit && (
              <Link
                color={"inherit"}
                component={"button"}
                onClick={() => setEditTruthDialogOpen(true)}
              >
                Edit
              </Link>
            )}
          </Box>
        )}
        <Box flexGrow={1}>
          <Box>
            {onSelect && (
              <Box
                component={"span"}
                sx={{ float: "right", width: 24, height: 24 }}
              >
                {selected && <CheckIcon color={"primary"} />}
              </Box>
            )}

            {truthOption?.Result && (
              <Typography sx={{ fontWeight: 600, mb: 1 }}>
                {truthOption.Result}
              </Typography>
            )}
            <Typography>
              {truthOption?.Description ?? customTruth?.description}
            </Typography>
          </Box>
          {truthOption?.Subtable &&
            (onSelectSubItem || !selectedSubItemId ? (
              <RadioGroup
                value={selectedSubItemId}
                onChange={(evt, value) =>
                  onSelectSubItem && onSelectSubItem(value)
                }
              >
                {truthOption.Subtable.flatMap((row) => {
                  return (
                    <FormControlLabel
                      label={row.Result}
                      key={row.$id}
                      value={row.$id}
                      disabled={(onSelect && !selected) || !onSelectSubItem}
                      control={
                        <Radio
                          checkedIcon={<HexradioChecked />}
                          icon={<HexboxUnchecked />}
                        />
                      }
                    />
                  );
                })}
              </RadioGroup>
            ) : (
              <Box display={"flex"} alignItems={"center"} pt={1} pb={2}>
                <HexradioChecked color={"primary"} />
                <Typography ml={2}>
                  {
                    truthOption.Subtable?.find(
                      (subItem) => subItem.$id === selectedSubItemId
                    )?.Result
                  }
                </Typography>
              </Box>
            ))}
        </Box>
        <Box
          sx={(theme) => ({
            bgcolor: theme.palette.background.paperInlay,
            px: 1,
            pb: 1,
            m: -1,
            mt: 1,
            borderRadius: theme.shape.borderRadius + "px",
          })}
        >
          <Typography variant={"overline"}>Quest Starter</Typography>

          {canEdit && (
            <Typography>
              {truthOption?.["Quest starter"] ?? customTruth?.questStarter}
            </Typography>
          )}
        </Box>
      </Card>
      <StarforgedTruthDialogSelector
        open={editTruthDialogOpen}
        handleClose={() => setEditTruthDialogOpen(false)}
        truth={truth}
      />
    </>
  );
}
