import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AccountIcon from "@mui/icons-material/Person";
import { AuthPageHeading, GoogleSignInButton } from "components/shared/Auth";
import { PageContent, PageHeader } from "components/shared/Layout";
import { FirebaseError } from "firebase/app";
import { sendMagicEmailLink } from "lib/auth.lib";
import { FormEvent, useState } from "react";

export interface LoginOrSignupPageProps {
  isLoginPage: boolean;
}

export function LoginOrSignupPage(props: LoginOrSignupPageProps) {
  const { isLoginPage } = props;

  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");

  const [linkSent, setLinkSent] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [linkSendLoading, setLinkSendLoading] = useState<boolean>(false);

  const handleMagicLinkSignup = () => {
    if (!email) {
      setErrorMessage("Email is required");
      return;
    }

    if (email.split("@").length < 2) {
      setErrorMessage("Please enter a valid email");
      return;
    }

    if (!isLoginPage && !name.trim()) {
      setErrorMessage("Name is required");
      return;
    }

    setLinkSendLoading(true);
    sendMagicEmailLink(email, !isLoginPage ? name : undefined)
      .then(() => {
        setLinkSent(true);
        setErrorMessage(undefined);
      })
      .catch((e: FirebaseError) => {
        setErrorMessage("Error sending email link: " + e.message);
      })
      .finally(() => {
        setLinkSendLoading(false);
      });
  };

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    handleMagicLinkSignup();
  };

  return (
    <>
      <PageHeader />
      <PageContent isPaper maxWidth={"sm"}>
        <Stack spacing={4}>
          <AuthPageHeading isLoginPage={isLoginPage} icon={<AccountIcon />} />
          {!linkSent ? (
            <>
              <GoogleSignInButton isLoginPage={isLoginPage} />
              <Divider>OR</Divider>
              <Stack spacing={2} component={"form"} onSubmit={handleSubmit}>
                <Typography variant={"h6"}>Passwordless Sign in</Typography>
                <Alert severity={"info"}>
                  {!isLoginPage &&
                    "Get a sign in link emailed to you each time you log in. "}
                  You must open the link on the same device you clicked{" "}
                  {'"Send sign in link"'} on.
                </Alert>
                {errorMessage && (
                  <Alert severity={"error"}>
                    <AlertTitle>Error Sending Sign In Link</AlertTitle>
                    {errorMessage}
                  </Alert>
                )}
                <TextField
                  label={"Email Address"}
                  type={"email"}
                  autoComplete={"email"}
                  value={email}
                  onChange={(evt) => setEmail(evt.currentTarget.value)}
                ></TextField>
                {!isLoginPage && (
                  <TextField
                    label={"Name"}
                    autoComplete={"name"}
                    helperText={
                      "This will be visible to other players in a campaign."
                    }
                    value={name}
                    onChange={(evt) => setName(evt.currentTarget.value)}
                  />
                )}
                <Box display={"flex"} justifyContent={"flex-end"}>
                  <Button
                    type={"submit"}
                    variant={"contained"}
                    disabled={linkSendLoading}
                  >
                    Send Sign In Link
                  </Button>
                </Box>
              </Stack>
            </>
          ) : (
            <Alert severity="info">
              <AlertTitle>Sign in link sent</AlertTitle>
              Please check your email for the link to sign in. You must open the
              link in this browser to be logged in.
            </Alert>
          )}
        </Stack>
      </PageContent>
    </>
  );
}
