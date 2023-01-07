import { Box, Stack, TextField, Typography } from "@mui/material";

export function NameSection() {
  return (
    <Stack spacing={0}>
      <Typography variant={"h6"}>Name</Typography>
      <Typography color={"GrayText"}>
        A good story starts with a good name. Or a bad one.
      </Typography>
      <div>
        <TextField
          label={"Name"}
          variant={"filled"}
          sx={{ mt: 2, minWidth: 350 }}
        />
      </div>
    </Stack>
  );
}
