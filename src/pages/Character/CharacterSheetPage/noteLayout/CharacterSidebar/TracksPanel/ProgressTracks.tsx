import {
  ProgressTracks as SharedProgressTracks,
  type ProgressTracksProps as SharedProgressTracksProps,
} from "components/features/ProgressTrack/ProgressTracks";

export type ProgressTracksProps = Omit<
  SharedProgressTracksProps,
  "headingBreakContainer"
>;

export function ProgressTracks(props: ProgressTracksProps) {
  return <SharedProgressTracks {...props} headingBreakContainer />;
}
