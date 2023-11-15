import { SvgIcon, SvgIconProps } from "@mui/material";

export function OracleIcon(props: SvgIconProps) {
  const { sx, ...rest } = props;
  return (
    <SvgIcon
      viewBox="0 0 512 512"
      fillRule="evenodd"
      clipRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      sx={[
        {
          width: 16,
          height: 16,
          strokeLinejoin: "round",
          strokeWidth: 16,
          stroke: "currentcolor",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      color={"inherit"}
      {...rest}
    >
      <path d="m148.01 392.32a196.79 196.79 0 0 1 108.19-361.32 196.96 196.96 0 0 1 108.19 361.32l60.557 60.557v28.125h-337.5v-28.125zm-11.162-283.8a168.79 168.79 0 0 0 238.71 238.71c-56.777 28.828-140.19 14.941-196.87-41.836-56.777-56.689-70.664-140.1-41.836-196.87zm189.67-21.27-18.633 51.68-51.68 18.633 51.68 18.633 18.633 51.68 18.633-51.68 51.68-18.633-51.68-18.633z" />
    </SvgIcon>
  );
}
