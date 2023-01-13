import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PageBanner } from "../../components/Layout/PageBanner";
import { useSnackbar } from "../../hooks/useSnackbar";
import { constructCharacterSheetUrl, paths, ROUTES } from "../../routes";
import { AssetsSection } from "./components/AssetsSection";
import { NameSection } from "./components/NameSection";
import { StatsSection } from "./components/StatsSection";
import { useCharacterCreateStore } from "./store/characterCreate.store";

export function CharacterCreatePage() {
  // Name
  // Stats
  // Health - auto set
  // Spirit - auto set
  // Supply - auto set
  // Momentum - auto set
  const navigate = useNavigate();
  const { error } = useSnackbar();

  const createCharacter = useCharacterCreateStore(
    (store) => store.createCharacter
  );

  const handleCreateCharacter = () => {
    createCharacter()
      .then((id) => {
        navigate(constructCharacterSheetUrl(id));
      })
      .catch((err) => {
        error(err);
      });
  };

  return (
    <>
      <PageBanner
        sx={{
          height: 128,
          backgroundSize: "cover",
          backgroundPosition: "top",
          backgroundRepeat: "no-repeat",
          backgroundImage: "url(/assets/ForestBackdrop.jpg)",
          filter: "brightness(50%) grayscale(25%)",
        }}
      ></PageBanner>
      <Typography
        variant={"h4"}
        color={"white"}
        position={"relative"}
        fontFamily={(theme) => theme.fontFamilyTitle}
        mt={-10}
      >
        Create your Character
      </Typography>
      <Stack spacing={2} mt={2}>
        <NameSection />
        <Divider />
        <StatsSection />
        <Divider />
        <AssetsSection />
        <Divider />
        <Box display={"flex"} justifyContent={"flex-end"}>
          <Button variant={"contained"} onClick={() => handleCreateCharacter()}>
            Create Character
          </Button>
        </Box>
      </Stack>
    </>
  );
}
