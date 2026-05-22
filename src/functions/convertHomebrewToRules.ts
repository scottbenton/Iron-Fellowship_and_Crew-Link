import { Datasworn } from "@datasworn/core";
import { HomebrewConditionMeterDocument } from "api-calls/homebrew/rules/conditionMeters/_homebrewConditionMeters.type";
import { HomebrewImpactCategoryDocument } from "api-calls/homebrew/rules/impacts/_homebrewImpacts.type";
import { HomebrewLegacyTrackDocument } from "api-calls/homebrew/rules/legacyTracks/_homebrewLegacyTrack.type";
import { HomebrewStatDocument } from "api-calls/homebrew/rules/stats/_homebrewStat.type";

export function convertHomebrewToRules(
  homebrewStats: Record<string, HomebrewStatDocument>,
  homebrewConditionMeters: Record<string, HomebrewConditionMeterDocument>,
  homebrewImpactCategories: Record<string, HomebrewImpactCategoryDocument>,
  homebrewSpecialTracks: Record<string, HomebrewLegacyTrackDocument>
): Datasworn.Rules {
  const stats: Record<string, Datasworn.StatRule> = {};
  Object.values(homebrewStats).forEach((stat) => {
    stats[stat.dataswornId] = {
      label: stat.label,
      description: stat.description ?? "",
    };
  });

  const conditionMeters: Record<string, Datasworn.ConditionMeterRule> = {};
  Object.values(homebrewConditionMeters).forEach((conditionMeter) => {
    conditionMeters[conditionMeter.dataswornId] = {
      label: conditionMeter.label,
      description: conditionMeter.description ?? "",
      min: conditionMeter.min,
      max: conditionMeter.max,
      value: conditionMeter.value,
      shared: conditionMeter.shared,
      rollable: conditionMeter.rollable,
    } as Datasworn.ConditionMeterRule;
  });

  const impactCategories: Record<string, Datasworn.ImpactCategory> = {};
  Object.entries(homebrewImpactCategories).forEach(
    ([impactCategoryId, impactCategory]) => {
      const impacts: Record<string, Datasworn.ImpactRule> = {};
      Object.values(impactCategory.contents).forEach((impact) => {
        impacts[impact.dataswornId] = {
          label: impact.label,
          description: impact.description ?? "",
          shared: impact.shared,
          permanent: impact.permanent,
          prevents_recovery: impact.preventsRecovery,
        };
      });
      impactCategories[impactCategoryId] = {
        label: impactCategory.label,
        description: impactCategory.description ?? "",
        contents: impacts,
      };
    }
  );

  const specialTracks: Record<string, Datasworn.SpecialTrackRule> = {};
  Object.values(homebrewSpecialTracks).forEach((specialTrack) => {
    specialTracks[specialTrack.dataswornId] = {
      label: specialTrack.label,
      description: specialTrack.description ?? "",
      shared: specialTrack.shared,
      optional: specialTrack.optional,
    };
  });

  return {
    stats,
    condition_meters: conditionMeters,
    impacts: impactCategories,
    special_tracks: specialTracks,
    tags: {},
  };
}
