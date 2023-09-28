import { SvgIcon, SvgIconProps } from "@mui/material";

export interface HexboxCheckedProps extends SvgIconProps {}

export function HexboxChecked(props: HexboxCheckedProps) {
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
      <defs>
        <clipPath id="clipPath2">
          <path
            d="m6.601 15.966-7.6042-7.6042 1.901-1.901 5.7031 5.7031 12.24-12.24 1.901 1.9011z"
            display="none"
            strokeWidth=".033352"
          />
          <path
            d="m-8.3048-12.064h36.349v40.14h-36.349zm14.906 28.029 14.141-14.141-1.901-1.9011-12.24 12.24-5.7031-5.7031-1.901 1.901z"
            strokeWidth=".033352"
          />
        </clipPath>
      </defs>
      <path
        transform="matrix(.99945 0 0 .99945 6.136 8.0598)"
        d="m22.123 15.081-12.254 7.0748-12.254-7.0748 1e-7 -14.15 12.254-7.0748 12.254 7.0748z"
        clipPath="url(#clipPath2)"
        strokeLinejoin="round"
        strokeWidth="1.8409"
      />
    </SvgIcon>
  );
}
