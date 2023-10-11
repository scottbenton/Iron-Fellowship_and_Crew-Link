import { LoginOrSignupPage } from "components/shared/LoginOrSignupPage";
import { Head } from "providers/HeadProvider/Head";

export function Component() {
  return (
    <>
      <Head title={"Create an Account"} />
      <LoginOrSignupPage isLoginPage={false} />
    </>
  );
}
