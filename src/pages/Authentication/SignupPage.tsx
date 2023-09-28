import { LoginOrSignupPage } from "components/LoginOrSignupPage";
import { Head } from "providers/HeadProvider/Head";

export function Component() {
  return (
    <>
      <Head title={"Create an Account"} />
      <LoginOrSignupPage isLoginPage={false} />
    </>
  );
}
