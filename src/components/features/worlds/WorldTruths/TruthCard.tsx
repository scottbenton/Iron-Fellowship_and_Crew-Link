import {
  Box,
  ButtonBase,
  Card,
  // FormControlLabel,
  // FormControlLabel,
  Link,
  // Radio,
  // RadioGroup,
  // Radio,
  // RadioGroup,
  Typography,
} from "@mui/material";
// import { HexboxUnchecked } from "assets/HexboxUnchecked";
// import { HexradioChecked } from "assets/HexradioChecked";
import CheckIcon from "@mui/icons-material/CheckCircle";
import { useState } from "react";
import { Datasworn } from "@datasworn/core";
import { TruthSelectorDialog } from "./TruthSelectorDialog";
import { MarkdownRenderer } from "components/shared/MarkdownRenderer";
// import { HexradioChecked } from "assets/HexradioChecked";
// import { HexboxUnchecked } from "assets/HexboxUnchecked";

export interface TruthCardProps {
  truthKey: string;
  truth: Datasworn.Truth;
  truthOption: Datasworn.TruthOption;
  hideHeader?: boolean;
  fullHeight?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  selectedSubItemIndex?: number | null;
  onSelectSubItem?: (index: number) => void;
  canEdit: boolean;
}

export function TruthCard(props: TruthCardProps) {
  const {
    truthKey,
    truth,
    truthOption,
    hideHeader,
    fullHeight,
    onSelect,
    selected,
    // selectedSubItemIndex,
    // onSelectSubItem,
    canEdit,
  } = props;

  const [editTruthDialogOpen, setEditTruthDialogOpen] = useState(false);

  if (!truthOption) {
    return null;
  }

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
          alignItems: "stretch",
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
            <Typography variant={"h6"}>{truth.name}</Typography>
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

            {truthOption.summary && (
              <MarkdownRenderer
                markdown={truthOption.summary}
                sx={{ fontWeight: 600 }}
                typographyVariant={"body1"}
              />
            )}
            {truthOption.description && (
              <MarkdownRenderer
                markdown={truthOption.description}
                typographyVariant={"body1"}
              />
            )}
          </Box>
          {/* TODO - get the oracles working again */}
          {/* {truthOption.oracles &&
            (onSelectSubItem || typeof selectedSubItemIndex !== "number" ? (
              <RadioGroup
                value={selected ? selectedSubItemIndex : null}
                onChange={(_, index) =>
                  onSelectSubItem && onSelectSubItem(parseInt(index))
                }
              >
                {truthOption.table?.rows.map((row, index) => (
                  <FormControlLabel
                    label={row.text}
                    key={index}
                    value={index}
                    disabled={(onSelect && !selected) || !onSelectSubItem}
                    control={
                      <Radio
                        checkedIcon={<HexradioChecked />}
                        icon={<HexboxUnchecked />}
                      />
                    }
                  />
                ))}
              </RadioGroup>
            ) : (
              <Box display={"flex"} alignItems={"center"} pt={1} pb={2}>
                <HexradioChecked color={"primary"} />
                <Typography ml={2}>
                  {
                    truthOption.table?.rows.find(
                      (_, index) => index === selectedSubItemIndex
                    )?.text
                  }
                </Typography>
              </Box>
            ))} */}
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

          {canEdit && <Typography>{truthOption?.quest_starter}</Typography>}
        </Box>
      </Card>
      <TruthSelectorDialog
        open={editTruthDialogOpen}
        handleClose={() => setEditTruthDialogOpen(false)}
        truth={truth}
        truthKey={truthKey}
      />
    </>
  );
}
