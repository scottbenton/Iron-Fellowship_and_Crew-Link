import { SvgIcon, SvgIconProps } from "@mui/material";

export interface SpecialTrackIconProps extends SvgIconProps {}

export function SpecialTrackIcon(props: SpecialTrackIconProps) {
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
      <g clipPath='url(#clip0_390_295)'>
        <rect
          x='-25.5'
          y='69.5'
          width='45'
          height='45'
          rx='6.5'
          fill='white'
          stroke='currentcolor'
          strokeWidth='3'
        />
        <rect
          x='19.5'
          y='69.5'
          width='45'
          height='45'
          rx='6.5'
          fill='white'
          stroke='currentcolor'
          strokeWidth='3'
        />
        <rect
          x='64.5'
          y='69.5'
          width='45'
          height='45'
          rx='6.5'
          fill='white'
          stroke='currentcolor'
          strokeWidth='3'
        />
        <rect
          x='-17.8491'
          y='79.979'
          width='4'
          height='38'
          rx='2'
          transform='rotate(-45 -17.8491 79.979)'
          fill='currentcolor'
        />
        <rect
          x='-22'
          y='94'
          width='4'
          height='38'
          rx='2'
          transform='rotate(-90 -22 94)'
          fill='currentcolor'
        />
        <rect
          x='-15.0208'
          y='106.849'
          width='4'
          height='38'
          rx='2'
          transform='rotate(-135 -15.0208 106.849)'
          fill='currentcolor'
        />
        <rect
          x='109.5'
          y='69.5'
          width='45'
          height='45'
          rx='6.5'
          fill='white'
          stroke='currentcolor'
          strokeWidth='3'
        />
        <rect x='40' y='73' width='4' height='38' rx='2' fill='currentcolor' />
        <rect
          x='27.1509'
          y='79.979'
          width='4'
          height='38'
          rx='2'
          transform='rotate(-45 27.1509 79.979)'
          fill='currentcolor'
        />
        <rect
          x='23'
          y='94'
          width='4'
          height='38'
          rx='2'
          transform='rotate(-90 23 94)'
          fill='currentcolor'
        />
        <rect
          x='29.9792'
          y='106.849'
          width='4'
          height='38'
          rx='2'
          transform='rotate(-135 29.9792 106.849)'
          fill='currentcolor'
        />
        <rect x='85' y='73' width='4' height='38' rx='2' fill='currentcolor' />
        <rect
          x='72.1509'
          y='79.979'
          width='4'
          height='38'
          rx='2'
          transform='rotate(-45 72.1509 79.979)'
          fill='currentcolor'
        />
        <rect
          x='74.9792'
          y='106.849'
          width='4'
          height='38'
          rx='2'
          transform='rotate(-135 74.9792 106.849)'
          fill='currentcolor'
        />
        <rect
          x='-25.5'
          y='13.5'
          width='45'
          height='45'
          rx='6.5'
          fill='white'
          stroke='currentcolor'
          strokeWidth='3'
        />
        <rect
          x='19.5'
          y='13.5'
          width='45'
          height='45'
          rx='6.5'
          fill='white'
          stroke='currentcolor'
          strokeWidth='3'
        />
        <rect
          x='64.5'
          y='13.5'
          width='45'
          height='45'
          rx='6.5'
          fill='white'
          stroke='currentcolor'
          strokeWidth='3'
        />
        <rect
          x='-17.8491'
          y='23.979'
          width='4'
          height='38'
          rx='2'
          transform='rotate(-45 -17.8491 23.979)'
          fill='currentcolor'
        />
        <rect
          x='-22'
          y='38'
          width='4'
          height='38'
          rx='2'
          transform='rotate(-90 -22 38)'
          fill='currentcolor'
        />
        <rect
          x='-15.0208'
          y='50.8491'
          width='4'
          height='38'
          rx='2'
          transform='rotate(-135 -15.0208 50.8491)'
          fill='currentcolor'
        />
        <rect
          x='109.5'
          y='13.5'
          width='45'
          height='45'
          rx='6.5'
          fill='white'
          stroke='currentcolor'
          strokeWidth='3'
        />
        <rect x='40' y='17' width='4' height='38' rx='2' fill='currentcolor' />
        <rect
          x='27.1509'
          y='23.979'
          width='4'
          height='38'
          rx='2'
          transform='rotate(-45 27.1509 23.979)'
          fill='currentcolor'
        />
        <rect
          x='23'
          y='38'
          width='4'
          height='38'
          rx='2'
          transform='rotate(-90 23 38)'
          fill='currentcolor'
        />
        <rect
          x='29.9792'
          y='50.8491'
          width='4'
          height='38'
          rx='2'
          transform='rotate(-135 29.9792 50.8491)'
          fill='currentcolor'
        />
        <rect x='85' y='17' width='4' height='38' rx='2' fill='currentcolor' />
        <rect
          x='72.1509'
          y='23.979'
          width='4'
          height='38'
          rx='2'
          transform='rotate(-45 72.1509 23.979)'
          fill='currentcolor'
        />
        <rect
          x='68'
          y='38'
          width='4'
          height='38'
          rx='2'
          transform='rotate(-90 68 38)'
          fill='currentcolor'
        />
        <rect
          x='74.9792'
          y='50.8491'
          width='4'
          height='38'
          rx='2'
          transform='rotate(-135 74.9792 50.8491)'
          fill='currentcolor'
        />
        <rect
          x='117.151'
          y='23.979'
          width='4'
          height='38'
          rx='2'
          transform='rotate(-45 117.151 23.979)'
          fill='currentcolor'
        />
      </g>
      <defs>
        <clipPath id='clip0_390_295'>
          <rect width='128' height='128' fill='white' />
        </clipPath>
      </defs>
    </SvgIcon>
  );
}
