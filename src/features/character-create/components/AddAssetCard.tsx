import { Card, CardActionArea, Grid, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/AddCircle";

interface AddAssetCardProps {
  onClick: () => void;
}

export function AddAssetCard(props: AddAssetCardProps) {
  const { onClick } = props;

  return (
    <Grid
      item
      xs={12}
      sm={6}
      lg={4}
      sx={{ display: "flex", justifyContent: "center" }}
    >
      <Card
        sx={{
          maxWidth: 300,
          minHeight: 400,
          width: "100%",
        }}
        variant={"outlined"}
      >
        <CardActionArea
          onClick={onClick}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Typography variant={"h6"} color={"GrayText"}>
            Add Asset
          </Typography>
          <AddIcon
            sx={(theme) => ({
              color: theme.palette.grey[400],
              width: 32,
              height: 32,
            })}
          />
        </CardActionArea>
      </Card>
    </Grid>
  );
}
