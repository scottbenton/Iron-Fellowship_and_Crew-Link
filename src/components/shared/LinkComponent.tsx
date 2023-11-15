import { PropsWithChildren, forwardRef } from "react";
import { Link } from "react-router-dom";

export const LinkComponent = forwardRef<
  HTMLAnchorElement,
  PropsWithChildren<{ href: string }>
>((props, ref) => {
  const { href, ...rest } = props;
  return <Link ref={ref} to={href} {...rest} />;
});
