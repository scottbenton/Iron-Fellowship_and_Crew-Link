import { ForwardedRef, PropsWithChildren, forwardRef } from "react";
import { Link } from "react-router-dom";

export const NewLink = (
  props: PropsWithChildren<{ href: string }>,
  ref: ForwardedRef<HTMLAnchorElement>
) => {
  const { href, ...rest } = props;
  return <Link ref={ref} to={href} {...rest} />;
};

export const LinkComponent = forwardRef<
  HTMLAnchorElement,
  PropsWithChildren<{ href: string }>
>(NewLink);
