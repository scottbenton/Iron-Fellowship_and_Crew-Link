import { Box, Input, InputAdornment, List, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useFilterOracles } from "./useFilterOracles";
import { EmptyState } from "components/shared/EmptyState";
import { OracleCollection } from "./OracleCollection";
import { AskTheOracleButtons } from "./AskTheOracleButtons";

export function OracleSection() {
  const {
    oracleCollections,
    setSearch,
    oracles,
    visibleOracleCollectionIds,
    visibleOracleIds,
    isSearchActive,
    isEmpty,
    rootOracles,
    enhancesCollections,
  } = useFilterOracles();

  return (
    <>
      <Box
        color={(theme) => theme.palette.darkGrey.contrastText}
        bgcolor={(theme) => theme.palette.darkGrey.dark}
        borderBottom={(theme) => `1px solid ${theme.palette.darkGrey.dark}`}
      >
        <Box
          color={(theme) => theme.palette.darkGrey.contrastText}
          bgcolor={(theme) => theme.palette.darkGrey.dark}
          borderBottom={(theme) => `1px solid ${theme.palette.darkGrey.dark}`}
        >
          <Typography
            variant={"body2"}
            component={"div"}
            textAlign={"center"}
            fontFamily={(theme) => theme.fontFamilyTitle}
          >
            Ask the Oracle
          </Typography>
          <AskTheOracleButtons />
        </Box>
        <Input
          fullWidth
          startAdornment={
            <InputAdornment position={"start"}>
              <SearchIcon
                sx={(theme) => ({ color: theme.palette.grey[300] })}
              />
            </InputAdornment>
          }
          aria-label={"Filter Oracles"}
          placeholder={"Filter Oracles"}
          onChange={(evt) => setSearch(evt.currentTarget.value)}
          color={"primary"}
          sx={(theme) => ({
            backgroundColor: theme.palette.darkGrey.main,
            color: "#fff",
            px: 2,
            borderBottomColor: theme.palette.darkGrey.light,
          })}
        />
      </Box>
      {!isEmpty ? (
        <List
          sx={{
            overflow: "auto",
            flexGrow: 1,
            py: 0,
          }}
        >
          {rootOracles.map((collectionId) => (
            <OracleCollection
              key={collectionId}
              collectionId={collectionId}
              collections={oracleCollections}
              oracles={oracles}
              forceOpen={isSearchActive}
              visibleCollections={visibleOracleCollectionIds}
              visibleOracles={visibleOracleIds}
              enhancesCollections={enhancesCollections}
            />
          ))}
        </List>
      ) : (
        <Box
          sx={{
            overflow: "auto",
            flexGrow: 1,
          }}
        >
          <EmptyState message={"No Oracles Found"} sx={{ pb: 2 }} />
        </Box>
      )}
    </>
  );
}
