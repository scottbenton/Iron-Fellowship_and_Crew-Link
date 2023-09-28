import { SvgIcon, SvgIconProps } from "@mui/material";

export interface HexradioCheckedProps extends SvgIconProps {}

export function HexradioChecked(props: HexradioCheckedProps) {
  const { sx, ...rest } = props;
  return (
    <SvgIcon
      viewBox="0 0 32 32"
      sx={[
        {
          width: 24,
          height: 24,
          strokeLinejoin: "round",
          strokeWidth: 3,
          fill: "currentcolor",
          stroke: "currentcolor",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      color={"inherit"}
      {...rest}
    >
      <path
        transform="matrix(.99945 0 0 .99945 6.136 8.0598)"
        d="m22.123 15.081-12.254 7.0748-12.254-7.0748 1e-7 -14.15 12.254-7.0748 12.254 7.0748z"
        fill="none"
      />
      <path
        transform="matrix(.61535 0 0 .61535 9.9268 11.104)"
        d="m22.123 15.081-12.254 7.0748-12.254-7.0748 1e-7 -14.15 12.254-7.0748 12.254 7.0748z"
        fill="currentColor"
        strokeWidth="1.4938"
      />
    </SvgIcon>
  );
}
