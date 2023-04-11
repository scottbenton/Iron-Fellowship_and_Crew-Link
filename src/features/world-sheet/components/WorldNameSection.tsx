import { TextField } from "@mui/material";
import { useRenameWorld } from "api/worlds/renameWorld";
import { SectionHeading } from "components/SectionHeading";
import { useEffect, useState } from "react";

export interface WorldNameSectionProps {
  worldName: string;
  worldId: string;
}

export function WorldNameSection(props: WorldNameSectionProps) {
  const { worldName, worldId } = props;

  const [tmpWorldName, setTmpWorldName] = useState(worldName);

  const { renameWorld, loading } = useRenameWorld();
  const handleSave = () => {
    renameWorld(worldId, tmpWorldName).catch(() => {});
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
