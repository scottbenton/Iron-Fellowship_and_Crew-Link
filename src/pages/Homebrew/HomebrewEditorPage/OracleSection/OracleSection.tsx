import { Box, LinearProgress } from "@mui/material";
import { EmptyState } from "components/shared/EmptyState";
import { OracleCollectionList } from "components/sharedIronsworn/NewOracles";
import { useOracles } from "data/hooks/useOracles";
import { useStore } from "stores/store";

export interface OracleSectionProps {
  id: string;
}

export function OracleSection(props: OracleSectionProps) {
  const { id } = props;

  const oracles = useStore(
    (store) => store.homebrew.collections[id].oracles?.data ?? {}
  );
  const loading = useStore(
    (store) => !store.homebrew.collections[id].oracles?.loaded
  );

  const testOracles = useOracles();

  return (
    <Box sx={{ mt: 2 }}>
      <OracleCollectionList oracles={testOracles} />
    </Box>
  );

  if (loading) {
    return <LinearProgress sx={{ mx: { xs: -2, sm: -3 } }} />;
  }

  if (Object.keys(oracles).length === 0) {
    return (
      <EmptyState
        showImage
        title={"No Oracles Found"}
        message={"Create your first Homebrew Oracle Collection"}
      />
    );
  }

  return <>Oracles Section</>;
}
