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
import AccountIcon from "@mui/icons-material/MarkEmailRead";
import { requestOtpSignIn } from "api-calls/auth/requestOtpSignIn";
import { verifyOtpSignIn } from "api-calls/auth/verifyOtpSignIn";
import { AuthPageHeading, GoogleSignInButton } from "components/shared/Auth";
import { PageContent, PageHeader } from "components/shared/Layout";
import { getErrorMessage } from "functions/getErrorMessage";
import { useContinueUrl } from "hooks/useContinueUrl";
import { getSystem } from "hooks/useGameSystem";
import { loginWithToken } from "lib/auth.lib";
import { Head } from "providers/HeadProvider/Head";
import { FormEvent, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  basePaths,
  BASE_ROUTES,
  constructRedirectUrlWithContinueParam,
} from "routes";

// The server rejects resend requests made within 60 seconds of the last send.
const RESEND_COOLDOWN_SECONDS = 60;

export interface OtpAuthPageProps {
  isLoginPage: boolean;
}

export function OtpAuthPage(props: OtpAuthPageProps) {
  const { isLoginPage } = props;
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  // The address the most recent code was actually sent to. Survives "Use a
  // different email" so the user can get back to the code field without
  // having to make a second (cooldown-rejected) request.
  const [codeSentToEmail, setCodeSentToEmail] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const { navigateToContinueURL } = useContinueUrl();
  const [searchParams] = useSearchParams();

  // Codes are the primary flow, but nothing else links to the magic link
  // pages, so a user whose code never arrives would otherwise be stuck.
  // Carry any continue param across so switching flows keeps their
  // destination.
  const continuePath = searchParams.get("continue");
  const backupAuthPath =
    basePaths[BASE_ROUTES.AUTH] + (isLoginPage ? "/login" : "/signup");
  const backupAuthHref = continuePath
    ? constructRedirectUrlWithContinueParam(backupAuthPath, continuePath)
    : backupAuthPath;

  useEffect(() => {
    if (resendCountdown <= 0) {
      return;
    }
    const timeout = setTimeout(() => {
      setResendCountdown((currentCount) => Math.max(currentCount - 1, 0));
    }, 1000);
    return () => clearTimeout(timeout);
  }, [resendCountdown]);

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
        setCodeSentToEmail(email);
        setResendCountdown(RESEND_COOLDOWN_SECONDS);
      })
      .catch((error) => {
        setErrorMessage(getErrorMessage(error, "Failed to send sign-in code."));
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

  // Deliberately leaves codeSentToEmail and the resend countdown alone: the
  // code already in the user's inbox stays valid, and so does its cooldown.
  const handleUseDifferentEmail = () => {
    setCodeSent(false);
    setCode("");
    setErrorMessage(undefined);
  };

  const handleReturnToCodeEntry = () => {
    if (!codeSentToEmail) {
      return;
    }
    setEmail(codeSentToEmail);
    setCodeSent(true);
    setErrorMessage(undefined);
  };

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (codeSent) {
      handleVerifyCode();
    } else {
      handleRequestCode();
    }
  };

  return (
    <>
      <PageHeader />
      <PageContent isPaper maxWidth={"sm"}>
        <Stack spacing={4}>
          <AuthPageHeading isLoginPage={isLoginPage} icon={<AccountIcon />} />
          {!codeSent && (
            <>
              <GoogleSignInButton isLoginPage={isLoginPage} />
              <Divider>OR</Divider>
            </>
          )}
          <Stack spacing={2} component={"form"} onSubmit={handleSubmit}>
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
              autoComplete={"email"}
              value={email}
              disabled={loading || codeSent}
              onChange={(evt) => setEmail(evt.currentTarget.value)}
            />
            {!isLoginPage && (
              <TextField
                label={"Display Name"}
                autoComplete={"name"}
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
                autoFocus
                inputProps={{
                  autoComplete: "one-time-code",
                  inputMode: "numeric",
                  maxLength: 6,
                }}
                onChange={(evt) => setCode(evt.currentTarget.value)}
              />
            )}
            {codeSent && (
              <Stack
                direction={"row"}
                spacing={1}
                flexWrap={"wrap"}
                useFlexGap
                alignItems={"center"}
              >
                <Button
                  type={"button"}
                  onClick={handleRequestCode}
                  disabled={loading || resendCountdown > 0}
                >
                  {resendCountdown > 0
                    ? `Resend code in ${resendCountdown}s`
                    : "Resend code"}
                </Button>
                <Button
                  type={"button"}
                  onClick={handleUseDifferentEmail}
                  disabled={loading}
                >
                  Use a different email
                </Button>
              </Stack>
            )}
            {!codeSent && codeSentToEmail && (
              <Box display={"flex"}>
                <Button
                  type={"button"}
                  size={"small"}
                  onClick={handleReturnToCodeEntry}
                  disabled={loading}
                >
                  {`Already have a code? Enter the one sent to ${codeSentToEmail}`}
                </Button>
              </Box>
            )}
            <Box display={"flex"} justifyContent={"flex-end"}>
              <Button type={"submit"} variant={"contained"} disabled={loading}>
                {codeSent ? "Sign In" : "Send Code"}
              </Button>
            </Box>
          </Stack>
          <Typography variant={"body2"} color={"textSecondary"}>
            {"Having trouble? "}
            <Typography
              variant={"body2"}
              component={Link}
              color={"primary"}
              to={backupAuthHref}
            >
              {isLoginPage
                ? "Sign in with an email link instead"
                : "Sign up with an email link instead"}
            </Typography>
          </Typography>
        </Stack>
      </PageContent>
    </>
  );
}

export function Component() {
  return (
    <>
      <Head title={"Login"} />
      <OtpAuthPage isLoginPage />
    </>
  );
}
