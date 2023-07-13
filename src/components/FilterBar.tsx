import { Box, InputAdornment, Stack, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export interface FilterBarProps {
  search: string;
  setSearch: (search: string) => void;
  searchPlaceholder: string;
  action: React.ReactNode;
}

export function FilterBar(props: FilterBarProps) {
  const { search, setSearch, searchPlaceholder, action } = props;

  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyContent={"space-between"}
      flexWrap={"wrap"}
      px={2}
      py={1.5}
      bgcolor={(theme) => theme.palette.background.paper}
      sx={{
        "&>*": {
          my: 0.5,
        },
      }}
    >
      <TextField
        InputProps={{
          startAdornment: (
            <InputAdornment position={"start"}>
              <SearchIcon
                sx={(theme) => ({ color: theme.palette.grey[300] })}
              />
            </InputAdornment>
          ),
        }}
        aria-label={searchPlaceholder}
        placeholder={searchPlaceholder}
        value={search}
        onChange={(evt) => setSearch(evt.currentTarget.value)}
        sx={(theme) => ({
          mr: 1,
          minWidth: 250,
        })}
        size={"small"}
      />
      {action}
    </Box>
  );
}
