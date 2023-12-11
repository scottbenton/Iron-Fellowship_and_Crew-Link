import { DatePicker } from "@mui/x-date-pickers";
import { Box, Grid, TextField } from "@mui/material";
import { SectionHeading } from "components/shared/SectionHeading";
import { useEffect, useState } from "react";
import { useStore } from "stores/store";

export interface AboutSectionProps {
  id: string;
}

export function AboutSection(props: AboutSectionProps) {
  const { id } = props;

  const details = useStore((store) => store.homebrew.collections[id]);
  const updateDetails = useStore((store) => store.homebrew.updateExpansion);

  const originalTitle = details.title;
  const [title, setTitle] = useState(details.title ?? "");

  useEffect(() => {
    if (originalTitle) {
      setTitle(originalTitle);
    }
  }, [originalTitle]);

  return (
    <Box
      sx={{
        ["&>:not(:last-of-type)"]: {
          mb: 2,
        },
      }}
    >
      <SectionHeading label="Collection Details" breakContainer />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label={"Title"}
            value={title}
            onChange={(evt) => setTitle(evt.currentTarget.value)}
            onBlur={(evt) =>
              updateDetails(id, { title: evt.currentTarget.value }).catch(
                () => {}
              )
            }
            fullWidth
          />
        </Grid>
      </Grid>
      <SectionHeading label={"Authors"} breakContainer />
      <SectionHeading label="Advanced Details" breakContainer />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <DatePicker
            label={"Last Updated Date"}
            slotProps={{
              textField: {
                fullWidth: true,
              },
            }}
            disableFuture
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label={"ID"} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label={"Url"} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label={"License"} fullWidth />
        </Grid>
      </Grid>
    </Box>
  );
}
