import {
  ButtonBase,
  Card,
  SxProps,
  TextField,
  Typography,
} from "@mui/material";
import { useRoller } from "providers/DieRollProvider";
import { useStore } from "stores/store";
import { useEffect, useState } from "react";

export interface StatComponentProps {
  label: string;
  value: number;
  updateTrack?: (newValue: number) => Promise<void>;
  disableRoll?: boolean;
  sx?: SxProps;
}

export function StatComponent(props: StatComponentProps) {
  const { label, value, updateTrack, disableRoll, sx } = props;

  const [inputValue, setInputValue] = useState<string>(value + "");
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    if (!isInputFocused) {
      setInputValue(value + "");
    }
  }, [isInputFocused, value]);

  const { rollStat } = useRoller();
  const adds = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.adds ?? 0
  );
  const hasAdds = adds !== 0;
  const resetAdds = useStore(
    (store) => store.characters.currentCharacter.updateCurrentCharacter
  );

  const handleStatUpdate = (stringVal: string) => {
    setInputValue(stringVal);
    const intVal = !stringVal ? 0 : parseInt(stringVal);
    if (updateTrack && !isNaN(intVal)) {
      updateTrack(intVal).catch((e) => {
        console.error(e);
      });
    }
  };

  const valueWithAdds = updateTrack ? value : value + adds;

  return (
    <Card
      variant={"outlined"}
      sx={[
        (theme) => ({
          overflow: "hidden",
          width: 75,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          outlineColor: theme.palette.primary.main,
          outlineWidth: 0,
          outlineStyle: "solid",
          transition: theme.transitions.create(
            ["background-color", "border-color", "outline-width"],
            { duration: theme.transitions.duration.shorter }
          ),
          "&>h6#track-label": {
            transition: theme.transitions.create(
              ["background-color", "color"],
              { duration: theme.transitions.duration.shorter }
            ),
            backgroundColor: theme.palette.background.paperInlay,
            color: theme.palette.text.secondary,
            fontFamily: theme.fontFamilyTitle,
            py: 0.5,
          },
          "&:hover":
            updateTrack || disableRoll
              ? {}
              : {
                  "&>h6#track-label": {
                    backgroundColor: theme.palette.background.paperInlayDarker,
                    color: theme.palette.text.primary,
                  },
                  outlineWidth: 2,
                  outlineColor: theme.palette.primary.main,
                  borderColor: theme.palette.primary.main,
                },
          "&:focus":
            updateTrack || disableRoll
              ? {}
              : {
                  outlineWidth: 2,
                  outlineColor: theme.palette.primary.main,
                  borderColor: theme.palette.primary.main,
                },
        }),

        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      component={updateTrack || disableRoll ? "div" : ButtonBase}
      onClick={() => {
        if (!(updateTrack || disableRoll)) {
          rollStat(label, value, adds);
          resetAdds({ adds: 0 }).catch(() => {});
        }
      }}
    >
      <Typography
        display={"block"}
        textAlign={"center"}
        variant={"subtitle1"}
        lineHeight={1}
        id={"track-label"}
      >
        {label}
        {hasAdds && label !== "Adds" && "*"}
      </Typography>
      {!updateTrack ? (
        <Typography
          sx={[
            (theme) => ({
              color: theme.palette.text.primary,
              paddingX: 0,
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }),
            updateTrack ? { lineHeight: "1.5rem" } : {},
          ]}
          variant={"h6"}
          textAlign={"center"}
        >
          <Typography component={"span"} variant={"body1"} mr={0.2}>
            {valueWithAdds > 0 ? "+" : ""}
          </Typography>
          {valueWithAdds}
        </Typography>
      ) : (
        <TextField
          color={"primary"}
          id={label}
          variant={"outlined"}
          value={inputValue}
          onChange={(evt) => handleStatUpdate(evt.target.value)}
          sx={{
            width: "100%",
            "& input": { paddingRight: 0, py: 0.75 },
          }}
          type={"number"}
          size={"small"}
          inputProps={{ inputMode: "numeric" }}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
        />
      )}
    </Card>
  );
}
