import { Box, Stack, TextField, Typography } from "@mui/material";

export function NameSection() {
  return (
    <Stack spacing={0}>
      <Typography variant={"h6"}>Name</Typography>
      <Typography color={"GrayText"}>
        Every adventurer has a name. What is yours?
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
