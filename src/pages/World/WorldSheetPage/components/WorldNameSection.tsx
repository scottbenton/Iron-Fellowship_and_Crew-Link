import { TextField } from "@mui/material";
import { SectionHeading } from "components/SectionHeading";
import { useEffect, useState } from "react";
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
  }, [worldName]);

  return (
    <>
      <SectionHeading breakContainer label={"World Name"} />

      <TextField
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
