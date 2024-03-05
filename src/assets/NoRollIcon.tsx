import { SvgIcon, SvgIconProps } from "@mui/material";

export interface NoRollIconProps extends SvgIconProps {}

export function NoRollIcon(props: NoRollIconProps) {
  const { sx, ...rest } = props;
  return (
    <SvgIcon
      viewBox='0 0 128 128'
      sx={[
        {
          width: 128,
          height: 128,
          stroke: "currentcolor",
          fill: "white",
          strokeWidth: 0,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      fill={"none"}
      {...rest}
    >
      <rect
        x='22'
        y='22'
        width='84'
        height='84'
        rx='13'
        fill='white'
        stroke='currentcolor'
        strokeWidth='6'
      />
      <rect
        x='34'
        y='87.2954'
        width='75'
        height='7.5'
        rx='3.75'
        transform='rotate(-45 34 87.2954)'
        fill='currentcolor'
      />
      <rect
        x='39.3031'
        y='34.2632'
        width='75'
        height='7.5'
        rx='3.75'
        transform='rotate(45 39.3031 34.2632)'
        fill='currentcolor'
      />
    </SvgIcon>
  );
}
