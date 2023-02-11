import { useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useGetUserDoc } from "api/user/getUserDoc";

interface GMInfoProps {
  gmId: string;
}

const GMInfo = ({ gmId }: GMInfoProps) => {
  const { getUserDoc, data: gm } = useGetUserDoc();

  useEffect(() => {
    getUserDoc({ uid: gmId }).catch(() => {});
  }, [gmId]);

  if (!gm) return null;

  return (
    <Stack
      direction="row"
      sx={{
        m: 2,
        alignItems: "center",
      }}
      spacing={2}
    >
      <Avatar alt={gm.displayName} src={gm.photoURL} />
      <Typography variant="h6">{gm.displayName}</Typography>
    </Stack>
  );
};

export default GMInfo;
