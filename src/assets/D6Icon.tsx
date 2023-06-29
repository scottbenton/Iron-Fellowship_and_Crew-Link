import { SvgIcon, SvgIconProps } from "@mui/material";

export interface D6IconProps extends SvgIconProps {}

export function D6Icon(props: D6IconProps) {
  const { sx, ...rest } = props;
  return (
    <SvgIcon
      viewBox="0 0 512 512"
      sx={[
        {
          width: 24,
          height: 24,
          strokeLinejoin: "round",
          strokeWidth: 16,
          stroke: "currentcolor",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      color={"inherit"}
      {...rest}
    >
      <g transform="translate(0)">
        <path
          d="m255.7 44.764c-6.176 0-12.353 1.384-17.137 4.152l-152.75 88.36c-9.57 5.535-9.57 14.29 0 19.826l152.75 88.359c9.57 5.536 24.703 5.536 34.272 0l152.75-88.36c9.57-5.534 9.57-14.289 0-19.824l-152.75-88.361c-4.785-2.77-10.96-4.152-17.135-4.152zm180.16 129.05c-1.938 0.074-4.218 0.858-6.955 2.413l-146.94 84.847c-9.57 5.527-17.14 18.638-17.14 29.69v157.7c0 11.05 7.57 15.419 17.14 9.89l146.94-84.843c9.57-5.527 17.137-18.636 17.137-29.688v-157.7c-2.497-8.048-5.23-12.495-10.184-12.308zm-359.76 0.48c-6.227 0-10.033 5.325-10.155 11.825v157.7c0 11.052 7.57 24.163 17.14 29.69l146.93 84.848c9.57 5.526 17.141 1.156 17.141-9.895v-157.7c0-11.051-7.57-24.159-17.14-29.687l-146.93-84.847c-2.567-1.338-4.911-1.93-6.986-1.93z"
          fill="none"
        />
      </g>
    </SvgIcon>
  );
}
