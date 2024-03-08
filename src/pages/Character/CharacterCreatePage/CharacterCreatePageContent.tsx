import { PageContent, PageHeader } from "components/shared/Layout";
import { useAppName } from "hooks/useAppName";
import { Head } from "providers/HeadProvider/Head";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSyncHomebrewContent } from "./hooks/useSyncHomebrewContent";
import { useState } from "react";
import { CharacterDetails } from "./components/CharacterDetails";
import { ExpansionsAndHomebrew } from "./components/ExpansionsAndHomebrew";
import { Stats } from "./components/Stats";
import { Assets } from "./components/Assets";
import { StoredAsset } from "types/Asset.type";
import { Box, Button } from "@mui/material";
import { useStore } from "stores/store";
import { addCharacterToCampaign } from "api-calls/campaign/addCharacterToCampaign";
import {
  CAMPAIGN_ROUTES,
  constructCampaignSheetPath,
} from "pages/Campaign/routes";
import { constructCharacterSheetPath } from "../routes";

export interface Form {
  name: string;
  portrait?: {
    image: File | string;
    scale: number;
    position: {
      x: number;
      y: number;
    };
  };
  enabledExpansionMap: Record<string, boolean>;
  stats: Record<string, number>;
  assets: StoredAsset[];
}

export function CharacterCreatePageContent() {
  const uid = useStore((store) => store.auth.uid);
  const campaignId = useSearchParams()[0].get("campaignId");

  const navigate = useNavigate();

  const appName = useAppName();

  const [loading, setLoading] = useState(false);

  const stats = useStore((store) => store.rules.stats);
  const createCharacter = useStore((store) => store.characters.createCharacter);

  const { control, watch, handleSubmit } = useForm<Form>({
    disabled: loading,
  });

  useSyncHomebrewContent(watch, campaignId ?? undefined);

  const onSubmit: SubmitHandler<Form> = (values) => {
    setLoading(true);
    const parsedStats: Record<string, number> = {};
    Object.keys(stats ?? {}).forEach((statKey) => {
      parsedStats[statKey] = values.stats[statKey];
    });

    const expansionIds = Object.keys(values.enabledExpansionMap ?? {}).filter(
      (expansionId) => values.enabledExpansionMap[expansionId]
    );

    createCharacter(
      values.name,
      parsedStats,
      values.assets,
      values.portrait,
      expansionIds
    )
      .then((characterId) => {
        if (campaignId) {
          addCharacterToCampaign({ uid, campaignId, characterId }).finally(
            () => {
              // add character to campaign
              navigate(
                constructCampaignSheetPath(campaignId, CAMPAIGN_ROUTES.SHEET)
              );
            }
          );
        } else {
          navigate(constructCharacterSheetPath(characterId));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Head
        title={"Create a Character"}
        description={`Create a character on ${appName}`}
      />
      <PageHeader label={"Create your Character"} />
      <PageContent
        isPaper
        sx={{
          "&>form": { display: "flex", flexDirection: "column" },
          "&>form>:not(*:first-of-type)": { mt: 2 },
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <CharacterDetails control={control} watch={watch} />
          <ExpansionsAndHomebrew control={control} />
          <Stats control={control} />
          <Assets control={control} />
          <Box display={"flex"} justifyContent={"flex-end"}>
            <Button
              variant={"contained"}
              type={"submit"}
              onClick={() => {}}
              disabled={loading}
            >
              Create Character
            </Button>
          </Box>
        </form>
      </PageContent>
    </>
  );
}
