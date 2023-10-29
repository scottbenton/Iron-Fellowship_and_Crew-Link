import { Box, Button } from "@mui/material";

export function SkipToContentButton() {
  return (
    <Button
      LinkComponent={"a"}
      variant={"contained"}
      color={"primary"}
      href={"#main-content"}
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        transform: "translate(-100%)",
        zIndex: 1000,
        "&:focus": {
          transform: "translate(0%)",
        },
      }}
    >
      Skip to Content
    </Button>
  );
}
