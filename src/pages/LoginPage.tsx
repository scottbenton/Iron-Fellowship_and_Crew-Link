import { LoginOrSignupPage } from "components/LoginOrSignupPage";
import { Head } from "providers/HeadProvider/Head";

export function LoginPage() {
  return (
    <>
      <Head title={"Login"} />
      <LoginOrSignupPage isLoginPage />
    </>
  );
}
