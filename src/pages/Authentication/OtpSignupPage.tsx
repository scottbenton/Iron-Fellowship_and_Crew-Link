import { Head } from "providers/HeadProvider/Head";
import { OtpAuthPage } from "./OtpAuthPage";

export function Component() {
  return (
    <>
      <Head title={"Create an Account"} />
      <OtpAuthPage isLoginPage={false} />
    </>
  );
}
