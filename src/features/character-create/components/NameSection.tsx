import { Stack, TextField, Typography } from "@mui/material";
import { useCharacterCreateStore } from "../store/characterCreate.store";

export function NameSection() {
  const name = useCharacterCreateStore((store) => store.name);
  const setName = useCharacterCreateStore((store) => store.setName);

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
          value={name}
          onChange={(evt) => setName(evt.target.value)}
        />
      </div>
    </Stack>
  );
}
