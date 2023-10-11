import { useEffect, useRef, useState } from "react";

export function useDebouncedState<State>(
  persistChanges: (state: State) => void,
  initialState: State
): [State, (value: State) => void, () => void] {
  const [state, setState] = useState<State>(initialState);
  const stateRef = useRef<State>(state);

  const lastUpdateState = useRef<State>(initialState);

  useEffect(() => {
    setState(initialState);
    stateRef.current = initialState;
    lastUpdateState.current = initialState;
  }, [initialState]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (
        (state !== undefined || state !== null) &&
        state !== lastUpdateState.current
      ) {
        lastUpdateState.current = state;
        persistChanges(state);
      }
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [state]);

  useEffect(() => {
    return () => {
      if (stateRef.current !== lastUpdateState.current) {
        persistChanges(stateRef.current);
      }
    };
  }, []);

  return [
    state,
    (newState: State) => {
      stateRef.current = newState;
      setState(newState);
    },
    () => {},
  ];
}
