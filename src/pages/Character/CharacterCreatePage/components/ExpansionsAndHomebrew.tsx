import { Control, Controller } from "react-hook-form";
import { Form } from "../CharacterCreatePageContent";
import { SectionHeading } from "components/shared/SectionHeading";
import { ExpansionSelector } from "components/features/charactersAndCampaigns/ExpansionSelector";

export interface CharacterDetailsProps {
  control: Control<Form>;
}

export function ExpansionsAndHomebrew(props: CharacterDetailsProps) {
  const { control } = props;

  return (
    <>
      <SectionHeading breakContainer label={"Expansions & Homebrew"} />
      <Controller
        name={"enabledExpansionMap"}
        control={control}
        defaultValue={{}}
        render={({ field }) => (
          <ExpansionSelector
            enabledExpansionMap={field.value}
            toggleEnableExpansion={(expansionId, enabled) =>
              field.onChange({
                ...field.value,
                [expansionId]: enabled,
              })
            }
          />
        )}
      />
    </>
  );
}
