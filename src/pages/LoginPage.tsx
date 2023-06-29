import { Button } from "@mui/material";
import { EmptyState } from "components/EmptyState/EmptyState";
import { PageContent, PageHeader } from "components/Layout";
import { loginWithGoogle } from "lib/auth.lib";
import { useNavigate } from "react-router-dom";
import { BASE_ROUTES, basePaths } from "routes";

export function LoginPage() {
  const navigate = useNavigate();

  const handleLoginWithGoogle = () => {
    loginWithGoogle().then(() => {
      navigate(basePaths[BASE_ROUTES.CHARACTER]);
    });
  };
  return (
    <>
      <PageHeader label={"Login or Sign Up"} />
      <PageContent isPaper>
        <EmptyState
          sx={{ mt: 12 }}
          imageSrc="/assets/nature.svg"
          title={"Get Started on Iron Fellowship"}
          message={"Create your account or login to start"}
          callToAction={
            <Button
              size={"large"}
              variant={"contained"}
              onClick={() => handleLoginWithGoogle()}
            >
              Login with Google
            </Button>
          }
        />
      </PageContent>
    </>
  );
}
