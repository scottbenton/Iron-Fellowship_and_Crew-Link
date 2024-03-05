import { SvgIcon, SvgIconProps } from "@mui/material";

export interface ActionIconProps extends SvgIconProps {}

export function ActionIcon(props: ActionIconProps) {
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
      <g clipPath='url(#clip0_390_216)'>
        <rect
          x='60.7431'
          y='60.8697'
          width='45'
          height='45'
          rx='6.5'
          transform='rotate(-21 60.7431 60.8697)'
          fill='white'
          strokeWidth='3'
        />
        <path
          d='M77.3719 67.9054L101.043 47.6216C101.363 47.3474 101.857 47.5677 101.868 47.989L102.633 79.1522L88.8377 76.1444L77.3719 67.9054Z'
          strokeWidth='3'
        />
        <path d='M78.0463 100.383L89.2316 75.2603' strokeWidth='3' />
        <path d='M63.549 66.5619L78.3723 67.6885' strokeWidth='3' />
        <path d='M102.124 78.2638L112.88 88.5259' strokeWidth='3' />
        <rect
          x='17.1317'
          y='49.8715'
          width='45'
          height='45'
          rx='6.5'
          transform='rotate(-57 17.1317 49.8715)'
          fill='white'
          strokeWidth='3'
        />
        <path
          d='M34.7203 45.7896L41.9478 15.4664C42.0455 15.0565 42.5753 14.9438 42.8313 15.2786L61.7675 40.0405L48.8392 45.7156L34.7203 45.7896Z'
          strokeWidth='3'
        />
        <path d='M54.3555 71.6676L48.6379 44.7686' strokeWidth='3' />
        <path d='M22.7477 52.8279L35.4022 45.0264' strokeWidth='3' />
        <path d='M60.8341 39.6206L75.5677 41.6006' strokeWidth='3' />
        <rect
          x='24.5'
          y='58.5'
          width='45'
          height='45'
          rx='6.5'
          fill='white'
          strokeWidth='3'
        />
        <mask id='path-12-inside-1_390_216' fill='white'>
          <path d='M15.3497 69.3472L25.6136 59.0833L68.9214 102.391L58.6575 112.655L15.3497 69.3472Z' />
        </mask>
        <path
          d='M15.3497 69.3472L25.6136 59.0833L68.9214 102.391L58.6575 112.655L15.3497 69.3472Z'
          fill='white'
        />
        <path
          d='M17.4711 71.4685L27.735 61.2046L23.4923 56.9619L13.2284 67.2258L17.4711 71.4685ZM66.8001 100.27L56.5362 110.534L60.7789 114.776L71.0428 104.512L66.8001 100.27Z'
          fill='currentcolor'
          mask='url(#path-12-inside-1_390_216)'
        />
        <rect
          x='14.5'
          y='68.5'
          width='45'
          height='45'
          rx='6.5'
          fill='white'
          strokeWidth='3'
        />
      </g>
      <defs>
        <clipPath id='clip0_390_216'>
          <rect width='128' height='128' fill='white' />
        </clipPath>
      </defs>
    </SvgIcon>
  );
}
