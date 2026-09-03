import { Button } from "@mui/material";
import { GoogleIcon } from "assets/GoogleIcon";
import { getErrorMessage } from "functions/getErrorMessage";
import { loginWithGoogle } from "lib/auth.lib";
import { useSnackbar } from "providers/SnackbarProvider/useSnackbar";

export interface GoogleSignInButtonProps {
  isLoginPage: boolean;
}

export function GoogleSignInButton(props: GoogleSignInButtonProps) {
  const { isLoginPage } = props;
  const { error } = useSnackbar();

  return (
    <Button
      variant={"contained"}
      sx={(theme) => ({
        backgroundColor: "#fff",
        color: theme.palette.grey[900],
        "&:hover": {
          backgroundColor: theme.palette.grey[200],
        },
      })}
      startIcon={<GoogleIcon />}
      onClick={() =>
        loginWithGoogle().catch((e) =>
          error(getErrorMessage(e, "Failed to log in"))
        )
      }
    >
      {isLoginPage ? "Login with" : "Sign Up using"} Google
    </Button>
  );
}
