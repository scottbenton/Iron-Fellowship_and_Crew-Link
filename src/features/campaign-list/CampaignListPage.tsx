import {
  Box,
  Button,
  Card,
  CardActionArea,
  Grid,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { useSnackbar } from "../../hooks/useSnackbar";
import { constructCampaignSheetUrl } from "../../routes";
import { useCampaignStore } from "../../stores/campaigns.store";
import { CreateCampaignDialog } from "./components/CreateCampaignDialog";

export function CampaignListPage() {
  const { error } = useSnackbar();

  const campaigns = useCampaignStore((store) =>
    Object.keys(store.campaigns).sort((key1, key2) => {
      const name1 = store.campaigns[key1].name;
      const name2 = store.campaigns[key2].name;

      if (name1 < name2) {
        return -1;
      } else if (name1 > name2) {
        return 1;
      }
      return 0;
    })
  );
  const campaignMap = useCampaignStore((store) => store.campaigns);

  const [createCampaignDialogOpen, setCreateCampaignDialogOpen] =
    useState<boolean>(false);

  // const handleDelete = (characterId: string) => {
  //   const shouldDelete = confirm(
  //     // `Are you sure you want to delete ${characters[characterId].name}?`
  //   );
  //   if (shouldDelete) {
  //     deleteCharacter(characterId).catch((e) => {
  //       error("Error deleting your character.");
  //     });
  //   }
  // };

  return (
    <>
      {campaigns.length === 0 ? (
        <EmptyState
          imageSrc="/assets/nature.svg"
          title={"No Campaigns"}
          message={"Create your first campaign to get started"}
          callToAction={
            <Button
              onClick={() => setCreateCampaignDialogOpen(true)}
              variant={"contained"}
            >
              Create a Campaign
            </Button>
          }
        />
      ) : (
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant={"h5"}
              fontFamily={(theme) => theme.fontFamilyTitle}
            >
              Your Campaigns
            </Typography>
            <Button
              onClick={() => setCreateCampaignDialogOpen(true)}
              variant={"contained"}
            >
              Create a Campaign
            </Button>
          </Grid>
          {campaigns.map((campaignId, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card variant={"outlined"}>
                <CardActionArea
                  component={Link}
                  to={constructCampaignSheetUrl(campaignId)}
                  sx={{ p: 2 }}
                >
                  <Box display={"flex"} alignItems={"center"}>
                    <Typography variant={"h6"}>
                      {campaignMap[campaignId].name}
                    </Typography>
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <CreateCampaignDialog
        open={createCampaignDialogOpen}
        handleClose={() => setCreateCampaignDialogOpen(false)}
      />
    </>
  );
  // return (
  //   <>
  //       <Grid container spacing={2}>
  //         <Grid
  //           item
  //           xs={12}
  //           sx={{
  //             display: "flex",
  //             justifyContent: "space-between",
  //             alignItems: "center",
  //           }}
  //         >
  //           <Typography
  //             variant={"h5"}
  //             fontFamily={(theme) => theme.fontFamilyTitle}
  //           >
  //             Your Characters
  //           </Typography>
  //           <Button
  //             component={Link}
  //             to={paths[ROUTES.CHARACTER_CREATE]}
  //             variant={"contained"}
  //           >
  //             Create a Character
  //           </Button>
  //         </Grid>
  //         {Object.keys(characters).map((characterKey, index) => {
  //           const hue = getHueFromString(characterKey);

  //           return (
  //             <Grid item xs={12} sm={6} md={4} key={index}>
  //               <Card variant={"outlined"}>
  //                 <CardActionArea
  //                   component={Link}
  //                   to={constructCharacterSheetUrl(characterKey)}
  //                   sx={{ p: 2 }}
  //                 >
  //                   <Box display={"flex"} alignItems={"center"}>
  //                     <Avatar
  //                       sx={{
  //                         backgroundColor: `hsl(${hue}, 60%, 85%)`,
  //                         color: `hsl(${hue}, 80%, 20%)`,
  //                       }}
  //                     >
  //                       {characters[characterKey].name[0]}
  //                     </Avatar>
  //                     <Typography variant={"h6"} ml={2}>
  //                       {characters[characterKey].name}
  //                     </Typography>
  //                   </Box>
  //                 </CardActionArea>
  //                 <Box
  //                   display={"flex"}
  //                   justifyContent={"flex-end"}
  //                   sx={(theme) => ({
  //                     backgroundColor: theme.palette.grey[100],
  //                     color: "white",
  //                   })}
  //                 >
  //                   <Button
  //                     color={"error"}
  //                     onClick={() => handleDelete(characterKey)}
  //                   >
  //                     Delete
  //                   </Button>
  //                 </Box>
  //               </Card>
  //             </Grid>
  //           );
  //         })}
  //       </Grid>
  // );
}
