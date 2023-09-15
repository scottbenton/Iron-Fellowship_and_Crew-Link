import { SvgIcon, SvgIconProps } from "@mui/material";

export interface HexboxUncheckedProps extends SvgIconProps {}

export function HexboxUnchecked(props: HexboxUncheckedProps) {
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
          stroke: "currentcolor",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      color={"inherit"}
      {...rest}
    >
      <g>
        <path
          fill={"none"}
          d="M 22.123318,15.081002 9.8694724,22.155763 -2.3843729,15.081002 -2.3843728,0.93147988 9.8694726,-6.143281 22.123318,0.93147998 Z"
          transform="matrix(0.9994478,0,0,0.9994478,6.1359774,8.0597962)"
        />
      </g>
    </SvgIcon>
  );
}
