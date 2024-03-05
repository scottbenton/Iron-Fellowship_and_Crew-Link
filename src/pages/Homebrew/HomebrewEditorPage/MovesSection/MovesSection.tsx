import { SectionWithSidebar } from "components/shared/Layout/SectionWithSidebar";
import { MovesEditorPane } from "./MovesEditorPane";
import { ExampleMoves } from "./ExampleMoves";
import { useStore } from "stores/store";
import { LinearProgress } from "@mui/material";

export interface MovesSectionProps {
  homebrewId: string;
}

export function MovesSection(props: MovesSectionProps) {
  const { homebrewId } = props;

  const moveCategories = useStore(
    (store) => store.homebrew.collections[homebrewId]?.moveCategories?.data
  );
  const moves = useStore(
    (store) => store.homebrew.collections[homebrewId]?.moves?.data
  );

  if (!moveCategories || !moves) {
    return <LinearProgress />;
  }

  return (
    <SectionWithSidebar
      sx={{ mt: 2 }}
      sidebar={<ExampleMoves />}
      mainContent={
        <MovesEditorPane
          homebrewId={homebrewId}
          moves={moves}
          categories={moveCategories}
        />
      }
    />
  );
}
