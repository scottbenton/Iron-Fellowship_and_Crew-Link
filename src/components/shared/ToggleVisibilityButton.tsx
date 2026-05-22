import { ButtonBase, CircularProgress } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useEffect, useState } from "react";

export interface ToggleVisibilityButtonProps {
  onToggleVisibility: () => void;
  loading: boolean;
  hidden?: boolean;
}

export function ToggleVisibilityButton(
  props: ToggleVisibilityButtonProps
) {
  const { onToggleVisibility, loading, hidden } = props;

  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    if(!loading && buttonLoading) {
      setButtonLoading(false);
    }
    if(loading && !buttonLoading) {
      setButtonLoading(true);
    }
  }, [buttonLoading, loading]);

  return (
    <ButtonBase
      onClick={() => {
        setButtonLoading(true);
        onToggleVisibility();
      }}
      disabled={loading}
      disableRipple
      aria-label={hidden ? "Show Item" : "Hide Item"}
      sx={{
        borderRadius: "50%",
        p: 1,
        ":hover": {
          backgroundColor: "rgba(255, 255, 255, 0.08)"
        }
      }}
    >
      {buttonLoading && (
        <CircularProgress
          color={"inherit"}
          size={16}
          disableShrink
          sx={{
            animationDuration: "600ms",
            m: 0.5
          }}
        />
      )}
      {!buttonLoading && hidden && (
        <VisibilityOff />
      )}
      {!buttonLoading && !hidden && (
        <Visibility />
      )}
    </ButtonBase>
  );
}
