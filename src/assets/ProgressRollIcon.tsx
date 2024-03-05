import { SvgIcon, SvgIconProps } from "@mui/material";

export interface ProgressRollIconProps extends SvgIconProps {}

export function ProgressRollIcon(props: ProgressRollIconProps) {
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
      <g clipPath='url(#clip0_390_257)'>
        <rect
          x='15.1316'
          y='52.869'
          width='45'
          height='45'
          rx='6.5'
          transform='rotate(-57 15.1316 52.869)'
          fill='white'
          stroke='currentcolor'
          strokeWidth='3'
        />
        <path
          d='M32.7204 48.7871L39.9479 18.464C40.0456 18.054 40.5755 17.9414 40.8314 18.2761L59.7676 43.0381L46.8393 48.7132L32.7204 48.7871Z'
          stroke='currentcolor'
          strokeWidth='3'
        />
        <path
          d='M52.3555 74.6652L46.6379 47.7661'
          stroke='currentcolor'
          strokeWidth='3'
        />
        <path
          d='M20.7478 55.8254L33.4023 48.0239'
          stroke='currentcolor'
          strokeWidth='3'
        />
        <path
          d='M58.834 42.6182L73.5676 44.5981'
          stroke='currentcolor'
          strokeWidth='3'
        />
        <rect
          x='52.7431'
          y='43.8697'
          width='45'
          height='45'
          rx='6.5'
          transform='rotate(-21 52.7431 43.8697)'
          fill='white'
          stroke='currentcolor'
          strokeWidth='3'
        />
        <path
          d='M69.3721 50.9054L93.0428 30.6216C93.3628 30.3474 93.8576 30.5677 93.868 30.989L94.6329 62.1522L80.838 59.1444L69.3721 50.9054Z'
          stroke='currentcolor'
          strokeWidth='3'
        />
        <path
          d='M70.0464 83.3828L81.2317 58.2603'
          stroke='currentcolor'
          strokeWidth='3'
        />
        <path
          d='M55.549 49.5619L70.3723 50.6885'
          stroke='currentcolor'
          strokeWidth='3'
        />
        <path
          d='M94.1247 61.2638L104.881 71.5259'
          stroke='currentcolor'
          strokeWidth='3'
        />
        <rect
          x='-25.5'
          y='64.5'
          width='45'
          height='45'
          rx='6.5'
          fill='white'
          stroke='currentcolor'
          strokeWidth='3'
        />
        <rect
          x='19.5'
          y='64.5'
          width='45'
          height='45'
          rx='6.5'
          fill='white'
          stroke='currentcolor'
          strokeWidth='3'
        />
        <rect
          x='64.5'
          y='64.5'
          width='45'
          height='45'
          rx='6.5'
          fill='white'
          stroke='currentcolor'
          strokeWidth='3'
        />
        <rect
          x='-17.8491'
          y='74.979'
          width='4'
          height='38'
          rx='2'
          transform='rotate(-45 -17.8491 74.979)'
          fill='currentcolor'
        />
        <rect
          x='-22'
          y='89'
          width='4'
          height='38'
          rx='2'
          transform='rotate(-90 -22 89)'
          fill='currentcolor'
        />
        <rect
          x='-15.0208'
          y='101.849'
          width='4'
          height='38'
          rx='2'
          transform='rotate(-135 -15.0208 101.849)'
          fill='currentcolor'
        />
        <rect
          x='109.5'
          y='64.5'
          width='45'
          height='45'
          rx='6.5'
          fill='white'
          stroke='currentcolor'
          strokeWidth='3'
        />
        <rect x='40' y='68' width='4' height='38' rx='2' fill='currentcolor' />
        <rect
          x='27.1509'
          y='74.979'
          width='4'
          height='38'
          rx='2'
          transform='rotate(-45 27.1509 74.979)'
          fill='currentcolor'
        />
        <rect
          x='23'
          y='89'
          width='4'
          height='38'
          rx='2'
          transform='rotate(-90 23 89)'
          fill='currentcolor'
        />
        <rect
          x='29.9792'
          y='101.849'
          width='4'
          height='38'
          rx='2'
          transform='rotate(-135 29.9792 101.849)'
          fill='currentcolor'
        />
        <rect x='85' y='68' width='4' height='38' rx='2' fill='currentcolor' />
        <rect
          x='72.1509'
          y='74.979'
          width='4'
          height='38'
          rx='2'
          transform='rotate(-45 72.1509 74.979)'
          fill='currentcolor'
        />
        <rect
          x='74.9792'
          y='101.849'
          width='4'
          height='38'
          rx='2'
          transform='rotate(-135 74.9792 101.849)'
          fill='currentcolor'
        />
      </g>
      <defs>
        <clipPath id='clip0_390_257'>
          <rect width='128' height='128' fill='white' />
        </clipPath>
      </defs>
    </SvgIcon>
  );
}
