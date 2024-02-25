import { Box, Typography, TypographyProps } from "@mui/material";
import { ReactNode } from "react";

export interface SimpleTableColumnDefinition<T> {
  label: string;
  renderer: (row: T, index: number) => ReactNode;
  textColor?: TypographyProps["color"];
}

export interface SimpleTableProps<T> {
  columns: SimpleTableColumnDefinition<T>[];
  rows: T[];
}

export function SimpleTable<T>(props: SimpleTableProps<T>) {
  const { columns, rows } = props;

  return (
    <Box
      sx={{
        display: "flex",
        overflowX: "auto",
        mx: { xs: -3, sm: 0 },
        px: { xs: 3, sm: 0 },
      }}
    >
      <Box
        component={"table"}
        mt={1}
        borderColor={"divider"}
        sx={{
          borderCollapse: "separate",
          borderRadius: 1,
          overflow: "hidden",
          borderSpacing: 0,
          borderWidth: "1px",
          borderStyle: "solid",
          overflowX: "auto",
          width: "100%",
        }}
      >
        <Box component={"thead"} bgcolor={"background.paperInlayDarker"}>
          <tr>
            {columns.map((column, index) => (
              <Typography
                key={index}
                component={"th"}
                variant={"body2"}
                textAlign={"left"}
                p={1}
                minWidth={"8ch"}
                fontWeight={700}
              >
                {column.label}
              </Typography>
            ))}
          </tr>
        </Box>
        <tbody>
          {rows.map((row, index) => {
            return (
              <Box
                key={index}
                component={"tr"}
                sx={(theme) => ({
                  "&:nth-of-type(even)": {
                    backgroundColor: theme.palette.background.paperInlay,
                  },
                })}
              >
                {columns.map((column, columnIndex) => (
                  <Typography
                    key={columnIndex}
                    component={"td"}
                    px={1}
                    py={0.5}
                    variant={"body2"}
                    color={column.textColor}
                  >
                    {column.renderer(row, index)}
                  </Typography>
                ))}
              </Box>
            );
          })}
        </tbody>
      </Box>
    </Box>
  );
}
