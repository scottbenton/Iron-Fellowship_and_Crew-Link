import { Control, useWatch } from "react-hook-form";
import { StatComponent } from "components/features/characters/StatComponent";
import { StoredStat } from "types/homebrew/HomebrewRules.type";
export interface StatPreviewComponentProps {
  control: Control<StoredStat, unknown>;
}
export function StatPreviewComponent(props: StatPreviewComponentProps) {
  const { control } = props;

  const label = useWatch({
    control,
    name: "label",
    defaultValue: "Label",
  });

  return <StatComponent label={label} value={1} disableRoll />;
}
