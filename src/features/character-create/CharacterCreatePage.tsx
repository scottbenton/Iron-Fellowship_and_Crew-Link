import { Box, Divider, Stack, TextField, Typography } from "@mui/material";
import { AssetsSection } from "./components/AssetsSection";
import { NameSection } from "./components/NameSection";
import { StatsSection } from "./components/StatsSection";

export function CharacterCreatePage() {
  // Name
  // Stats
  // Health - auto set
  // Spirit - auto set
  // Supply - auto set
  // Momentum - auto set

  return (
    <>
      <Box
        width={"100vw"}
        height={150}
        sx={{
          backgroundSize: "cover",
          backgroundPosition: "top",
          backgroundRepeat: "no-repeat",
          backgroundImage: "url(/assets/ForestBackdrop.jpg)",
          filter: "brightness(50%) grayscale(25%)",
          position: "absolute",
          left: 0,
        }}
      ></Box>
      <Box height={150} display={"flex"} alignItems={"flex-end"} paddingY={2}>
        <Typography
          variant={"h4"}
          color={"white"}
          position={"relative"}
          fontFamily={(theme) => theme.fontFamilyTitle}
        >
          Create your Character
        </Typography>
      </Box>
      <Stack spacing={2} mt={2}>
        <NameSection />
        <Divider />
        <StatsSection />
        <Divider />
        <AssetsSection />
      </Stack>
    </>
  );
}
