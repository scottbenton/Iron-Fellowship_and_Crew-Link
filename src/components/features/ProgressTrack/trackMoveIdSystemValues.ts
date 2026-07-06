import { GAME_SYSTEMS, GameSystemChooser } from "types/GameSystems.type";
import { ProgressTracks, TrackTypes } from "types/Track.type";

export const trackMoveIdSystemValues: GameSystemChooser<{
  [key in ProgressTracks | TrackTypes.SceneChallenge]: string;
}> = {
  [GAME_SYSTEMS.IRONSWORN]: {
    [TrackTypes.Vow]: "move:classic/quest/fulfill_your_vow",
    [TrackTypes.Journey]: "move:classic/adventure/reach_your_destination",
    [TrackTypes.Fray]: "move:classic/combat/end_the_fight",
    [TrackTypes.DelveSite]: "move:delve/delve/locate_your_objective",
    [TrackTypes.SceneChallenge]: "",
    [TrackTypes.BondProgress]: "",
  },
  [GAME_SYSTEMS.STARFORGED]: {
    [TrackTypes.Vow]: "move:starforged/quest/fulfill_your_vow",
    [TrackTypes.Journey]: "move:starforged/exploration/finish_an_expedition",
    [TrackTypes.Fray]: "move:starforged/combat/take_decisive_action",
    [TrackTypes.DelveSite]: "",
    [TrackTypes.BondProgress]: "move:starforged/connection/forge_a_bond",
    [TrackTypes.SceneChallenge]:
      "move:starforged/scene_challenge/finish_the_scene",
  },
};
