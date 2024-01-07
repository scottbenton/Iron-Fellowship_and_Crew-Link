import { LinearProgress } from "@mui/material";
import { SectionWithSidebar } from "components/shared/Layout/SectionWithSidebar";
import { useStore } from "stores/store";
import { ExampleOracles } from "./ExampleOracles";
import { OracleSectionContent } from "./OracleSectionContent";

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

  if (loading) {
    return <LinearProgress sx={{ mx: { xs: -2, sm: -3 } }} />;
  }

  return (
    <>
      <SectionWithSidebar
        sx={{ mt: 2 }}
        sidebar={<ExampleOracles homebrewId={id} />}
        mainContent={<OracleSectionContent homebrewId={id} oracles={oracles} />}
      />
    </>
  );
}
