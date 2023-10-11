import { LoginOrSignupPage } from "components/shared/LoginOrSignupPage";
import { Head } from "providers/HeadProvider/Head";

export function Component() {
  return (
    <>
      <Head title={"Login"} />
      <LoginOrSignupPage isLoginPage />
    </>
  );
}
