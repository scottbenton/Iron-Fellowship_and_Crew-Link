import { useEffect, useState } from "react";
import { getDoc } from "firebase/firestore";
import { getUsersDoc } from "../../../lib/firebase.lib";
import { UserDocument } from "../../../types/User.type";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

interface GMInfoProps {
  gmId: string;
}

const GMInfo = ({ gmId }: GMInfoProps) => {
  const [gm, setGm] = useState<UserDocument>();

  useEffect(() => {
    getDoc(getUsersDoc(gmId)).then((gmSnap) => {
      setGm(gmSnap.data());
    });
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
