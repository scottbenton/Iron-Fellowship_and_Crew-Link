import { Button } from "@mui/material";
import { useSnackbar } from "../../hooks/useSnackbar";
import { loginWithGoogle } from "../../lib/auth.lib";

export function LoginButton() {
  const { error, info } = useSnackbar();

  const handleLogin = () => {
    loginWithGoogle().catch(() => {
      error("Error logging in. Please try again.");
    });
  };

  return (
    <Button
      variant={"contained"}
      color={"secondary"}
      onClick={() => handleLogin()}
    >
      Get Started
    </Button>
  );
}
