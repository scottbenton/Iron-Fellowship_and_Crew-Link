import { Box, Typography } from "@mui/material";

export interface RollTitleProps {
  overline?: string;
  title: string;
  isExpanded: boolean;
  // Width kept clear for the buttons in the card's top corner.
  reservedSpace: number;
}

export function RollTitle(props: RollTitleProps) {
  const { isExpanded, title, overline, reservedSpace } = props;

  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <div>
        {overline && isExpanded && (
          <Typography
            lineHeight={1.2}
            variant={"overline"}
            component={"p"}
            fontFamily={(theme) => theme.fontFamilyTitle}
          >
            {overline}
          </Typography>
        )}
        <Typography
          variant={isExpanded ? "h6" : "subtitle1"}
          component={"p"}
          fontFamily={(theme) => theme.fontFamilyTitle}
          sx={{ mr: 1 }}
        >
          {title}
        </Typography>
      </div>
      {reservedSpace > 0 && (
        // Holds action space
        <Box height={40 - 16} width={reservedSpace - 16} />
      )}
    </Box>
  );
}
