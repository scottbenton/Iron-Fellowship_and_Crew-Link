import { Box, Card, Typography, Button } from "@mui/material";
import { useListenToCampaignCustomMoves } from "api/campaign/settings/moves/listenToCampaignCustomMoves";

export interface CampaignCustomMovesProps {
  campaignId: string;
}

const CampaignCustomMovesList = ({ campaignId }: CampaignCustomMovesProps) => {
  const { moves } = useListenToCampaignCustomMoves(campaignId);

  return (
    <Box>
      {moves?.map((move, index) => (
        <Card
          variant={"outlined"}
          sx={{
            width: "40%",
            marginTop: 2,
          }}
          key={index}
        >
          <Box p={2}>
            <Typography
              gutterBottom
              variant={"h6"}
              fontFamily={(theme) => theme.fontFamilyTitle}
            >
              {move.name}
            </Typography>
            <Typography variant={"body1"}>{move.text}</Typography>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"flex-end"}
            sx={(theme) => ({
              backgroundColor: theme.palette.grey[100],
              color: "white",
            })}
          >
            <Button>Edit</Button>
            <Button color={"error"}>Delete</Button>
          </Box>
        </Card>
      ))}
    </Box>
  );
};

export default CampaignCustomMovesList;
