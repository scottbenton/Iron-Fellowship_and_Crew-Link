import { useEffect, useState } from "react";
import { StoredCampaign } from "../../../types/Campaign.type";
import { getDoc } from "firebase/firestore";
import { getUsersDoc } from "../../../lib/firebase.lib";
import { UserDocument } from "../../../types/User.type";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

interface GMInfoProps {
  campaign: StoredCampaign;
}

const GMInfo = ({ campaign }: GMInfoProps) => {
  const [gm, setGm] = useState<UserDocument>({
    displayName: "",
    photoURL: "",
  });

  const gmId = campaign.gmId as string;

  const fetchGM = async () => {
    const gmSnap = await getDoc(getUsersDoc(gmId));
    const gmData = gmSnap.data() as UserDocument;
    setGm(gmData);
  };

  useEffect(() => {
    fetchGM();
  }, []);

  return gm.displayName === "" ? (
    <></>
  ) : (
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
