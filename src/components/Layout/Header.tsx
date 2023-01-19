import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import { AUTH_STATE, useAuth } from "../../hooks/useAuth";
import { paths, ROUTES } from "../../routes";
import { LoginButton } from "./LoginButton";
import { ReactComponent as IronJournalLogo } from "./iron-journal-logo.svg";

export function Header() {
  const theme = useTheme();
  const { authState } = useAuth();

  return (
    <AppBar elevation={0} position={"static"}>
      <Container maxWidth={"xl"}>
        <Toolbar
          variant={"dense"}
          disableGutters
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box display={"flex"} alignItems={"center"}>
            <IronJournalLogo width={32} height={32} />
            <Typography fontFamily={"Staatliches"} variant={"h5"} ml={2}>
              Iron Journal
            </Typography>
          </Box>
          {authState === AUTH_STATE.AUTHENTICATED ? (
            <Box>
              <Button
                component={Link}
                to={paths[ROUTES.CAMPAIGN_SELECT]}
                sx={{
                  color: "white",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                Campaigns
              </Button>
              <Button
                component={Link}
                to={paths[ROUTES.CHARACTER_SELECT]}
                sx={{
                  color: "white",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                Characters
              </Button>
            </Box>
          ) : (
            <LoginButton />
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
