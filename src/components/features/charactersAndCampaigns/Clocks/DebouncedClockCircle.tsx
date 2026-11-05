import { useDebouncedState } from "hooks/useDebouncedState";
import { ClockCircle, ClockSize } from "./ClockCircle";
import { useStore } from "stores/store";
import { getClockValueText } from "functions/trackValueText";

export interface DebouncedClockCircleProps {
  segments: number;
  value: number;
  onFilledSegmentsChange?: (value: number) => void;
  size?: ClockSize;
  voiceLabel: string;
}

export function DebouncedClockCircle(props: DebouncedClockCircleProps) {
  const { segments, value, onFilledSegmentsChange, size, voiceLabel } = props;

  const [localFilledSegments, setLocalFilledSegments] = useDebouncedState(
    onFilledSegmentsChange ? onFilledSegmentsChange : () => {},
    value
  );

  const announce = useStore((store) => store.appState.announce);

  const handleIncrement = () => {
    const newValue =
      localFilledSegments + 1 > segments ? 0 : localFilledSegments + 1;
    setLocalFilledSegments(newValue);
    // Announced here rather than in a state updater, which React may run
    // twice.
    announce(
      newValue === 0
        ? `Cleared clock ${getClockValueText(voiceLabel, 0, segments)}`
        : getClockValueText(voiceLabel, newValue, segments)
    );
  };

  return (
    <ClockCircle
      segments={segments}
      value={localFilledSegments}
      size={size}
      onClick={onFilledSegmentsChange ? handleIncrement : undefined}
      label={voiceLabel}
    />
  );
}
