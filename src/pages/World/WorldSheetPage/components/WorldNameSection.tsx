import { TextField } from "@mui/material";
import { SectionHeading } from "components/SectionHeading";
import { useEffect, useRef, useState } from "react";
import { useStore } from "stores/store";

export function WorldNameSection() {
  const worldName = useStore(
    (store) => store.worlds.currentWorld.currentWorld?.name ?? ""
  );
  const [tmpWorldName, setTmpWorldName] = useState(worldName);

  const [loading, setLoading] = useState(false);
  const updateWorld = useStore(
    (store) => store.worlds.currentWorld.updateCurrentWorld
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setLoading(true);
    updateWorld({ name: tmpWorldName })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setTmpWorldName(worldName);
    if (worldName === "New World") {
      inputRef.current?.focus();
    }
  }, [worldName]);

  return (
    <>
      <SectionHeading breakContainer label={"World Name"} />

      <TextField
        inputRef={inputRef}
        sx={{ mt: 2 }}
        label={"World Name"}
        value={tmpWorldName}
        onChange={(evt) => setTmpWorldName(evt.currentTarget.value)}
        onBlur={() => handleSave()}
        disabled={loading}
      />
    </>
  );
}
