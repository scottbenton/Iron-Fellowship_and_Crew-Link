import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  Grid,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { deleteCharacter } from "../../api/deleteCharacter";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { getHueFromString } from "../../functions/getHueFromString";
import { useSnackbar } from "../../hooks/useSnackbar";
import { constructCharacterSheetUrl, paths, ROUTES } from "../../routes";
import { useCharacterStore } from "../../stores/character.store";

export function CharacterSelectPage() {
  const characters = useCharacterStore((store) => store.characters);
  const { error } = useSnackbar();

  const handleDelete = (characterId: string) => {
    const shouldDelete = confirm(
      `Are you sure you want to delete ${characters[characterId].name}?`
    );
    if (shouldDelete) {
      deleteCharacter(characterId).catch((e) => {
        error("Error deleting your character.");
      });
    }
  };

  return (
    <>
      {!characters || Object.keys(characters).length === 0 ? (
        <EmptyState
          imageSrc="/assets/nature.svg"
          title={"No Characters"}
          message={"Create your first character to get started"}
          callToAction={
            <Button
              component={Link}
              to={paths[ROUTES.CHARACTER_CREATE]}
              variant={"contained"}
            >
              Create a Character
            </Button>
          }
        />
      ) : (
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant={"h5"}
              fontFamily={(theme) => theme.fontFamilyTitle}
            >
              Your Characters
            </Typography>
            <Button
              component={Link}
              to={paths[ROUTES.CHARACTER_CREATE]}
              variant={"contained"}
            >
              Create a Character
            </Button>
          </Grid>
          {Object.keys(characters).map((characterKey, index) => {
            const hue = getHueFromString(characterKey);

            return (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card variant={"outlined"}>
                  <CardActionArea
                    component={Link}
                    to={constructCharacterSheetUrl(characterKey)}
                    sx={{ p: 2 }}
                  >
                    <Box display={"flex"} alignItems={"center"}>
                      <Avatar
                        sx={{
                          backgroundColor: `hsl(${hue}, 60%, 85%)`,
                          color: `hsl(${hue}, 80%, 20%)`,
                        }}
                      >
                        {characters[characterKey].name[0]}
                      </Avatar>
                      <Typography variant={"h6"} ml={2}>
                        {characters[characterKey].name}
                      </Typography>
                    </Box>
                  </CardActionArea>
                  <Box
                    display={"flex"}
                    justifyContent={"flex-end"}
                    sx={(theme) => ({
                      backgroundColor: theme.palette.grey[100],
                      color: "white",
                    })}
                  >
                    <Button
                      color={"error"}
                      onClick={() => handleDelete(characterKey)}
                    >
                      Delete
                    </Button>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </>
  );
}
