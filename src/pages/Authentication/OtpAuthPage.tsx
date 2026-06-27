import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AccountIcon from "@mui/icons-material/MarkEmailRead";
import { requestOtpSignIn } from "api-calls/auth/requestOtpSignIn";
import { verifyOtpSignIn } from "api-calls/auth/verifyOtpSignIn";
import { PageContent, PageHeader } from "components/shared/Layout";
import { getErrorMessage } from "functions/getErrorMessage";
import { useContinueUrl } from "hooks/useContinueUrl";
import { getSystem } from "hooks/useGameSystem";
import { loginWithToken } from "lib/auth.lib";
import { useState } from "react";
import { basePaths, BASE_ROUTES } from "routes";

export interface OtpAuthPageProps {
  isLoginPage: boolean;
}

export function OtpAuthPage(props: OtpAuthPageProps) {
  const { isLoginPage } = props;
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState(false);
  const { navigateToContinueURL } = useContinueUrl();

  const handleRequestCode = () => {
    if (!email.trim()) {
      setErrorMessage("Email is required");
      return;
    }

    if (!isLoginPage && !name.trim()) {
      setErrorMessage("Name is required");
      return;
    }

    setLoading(true);
    setErrorMessage(undefined);

    requestOtpSignIn({ app: getSystem(), email })
      .then(() => {
        setCodeSent(true);
      })
      .catch((error) => {
        setErrorMessage(
          getErrorMessage(error, "Failed to send sign-in code.")
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleVerifyCode = () => {
    if (!email.trim() || !code.trim()) {
      setErrorMessage("Email and sign-in code are required");
      return;
    }

    setLoading(true);
    setErrorMessage(undefined);

    verifyOtpSignIn({
      code,
      email,
      name: !isLoginPage ? name.trim() : undefined,
    })
      .then((response) => loginWithToken(response.data.token))
      .then(() => {
        navigateToContinueURL(basePaths[BASE_ROUTES.CHARACTER]);
      })
      .catch((error) => {
        setErrorMessage(getErrorMessage(error, "Failed to sign in."));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <PageHeader />
      <PageContent isPaper maxWidth={"sm"}>
        <Stack spacing={4}>
          <Box>
            <Box pt={2} display={"flex"} alignItems={"center"}>
              <Box
                sx={(theme) => ({
                  display: "inline-flex",
                  borderRadius: 999 || `${theme.shape.borderRadius}px`,
                  alignItems: "center",
                  justifyContent: "center",
                  p: 0.5,
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.common.white,
                })}
              >
                <AccountIcon />
              </Box>
              <Typography
                ml={1}
                variant={"h4"}
                fontFamily={(theme) => theme.fontFamilyTitle}
                color={"textSecondary"}
              >
                {isLoginPage ? "Email Code Login" : "Email Code Sign Up"}
              </Typography>
            </Box>
          </Box>

          <Stack spacing={2}>
            {errorMessage && (
              <Alert severity={"error"}>
                <AlertTitle>Sign In Error</AlertTitle>
                {errorMessage}
              </Alert>
            )}
            {codeSent && (
              <Alert severity={"info"}>
                <AlertTitle>Code sent</AlertTitle>
                Check your email for a 6 digit sign-in code.
              </Alert>
            )}
            <TextField
              label={"Email Address"}
              type={"email"}
              value={email}
              disabled={loading || codeSent}
              onChange={(evt) => setEmail(evt.currentTarget.value)}
            />
            {!isLoginPage && (
              <TextField
                label={"Display Name"}
                helperText={"This will be visible to other players."}
                value={name}
                disabled={loading || codeSent}
                onChange={(evt) => setName(evt.currentTarget.value)}
              />
            )}
            {codeSent && (
              <TextField
                label={"Sign-In Code"}
                value={code}
                disabled={loading}
                inputProps={{
                  inputMode: "numeric",
                  maxLength: 6,
                }}
                onChange={(evt) => setCode(evt.currentTarget.value)}
              />
            )}
            <Box display={"flex"} justifyContent={"flex-end"}>
              <Button
                variant={"contained"}
                onClick={codeSent ? handleVerifyCode : handleRequestCode}
                disabled={loading}
              >
                {codeSent ? "Sign In" : "Send Code"}
              </Button>
            </Box>
          </Stack>
        </Stack>
      </PageContent>
    </>
  );
}

export function Component() {
  return <OtpAuthPage isLoginPage />;
}
