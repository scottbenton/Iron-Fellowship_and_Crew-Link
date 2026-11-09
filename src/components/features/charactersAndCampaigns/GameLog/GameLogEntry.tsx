import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import { useStore } from "stores/store";
import { Roll } from "types/DieRolls.type";
import { RollDisplay } from "../RollDisplay";
import { NormalRollActions } from "../RollDisplay/NormalRollActions";

export interface GameLogEntryProps {
  logId: string;
  log: Roll;
}

export function GameLogEntry(props: GameLogEntryProps) {
  const { logId, log } = props;

  const uid = useStore((store) => store.auth.uid);

  const characterId = useStore(
    (store) => store.characters.currentCharacter.currentCharacterId
  );
  const character = useStore(
    (store) => store.characters.currentCharacter.currentCharacter
  );
  const campaignCharacters = useStore(
    (store) => store.campaigns.currentCampaign.characters.characterMap
  );

  const logCreatorName = useStore(
    (store) => store.users.userMap[log.uid]?.doc?.displayName
  );

  const isYourEntry = log.characterId
    ? log.characterId === characterId
    : log.uid === uid;

  let rollerName = "";
  if (!log.characterId) {
    rollerName = logCreatorName ?? "Loading";
  } else if (log.characterId === characterId) {
    rollerName = character?.name ?? "Loading";
  } else {
    rollerName =
      campaignCharacters[log.characterId]?.name ?? logCreatorName ?? "Loading";
  }

  const logUid = log.uid;
  const loadUserDoc = useStore((store) => store.users.loadUserDocument);
  useEffect(() => {
    loadUserDoc(logUid);
  }, [logUid, loadUserDoc]);

  const getLogTimeString = (d: Date) => {
    return d.toLocaleString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const timeString = getLogTimeString(log.timestamp);

  // Screen readers hear the entry as one piece: who rolled, the roll, and
  // when. The name and time drawn above and below the card are hidden from
  // them so they are not read twice.
  return (
    <Box
      p={2}
      display={"flex"}
      flexDirection={"column"}
      alignItems={isYourEntry ? "flex-end" : "flex-start"}
    >
      <Typography aria-hidden>{rollerName}</Typography>
      <RollDisplay
        roll={log}
        isExpanded
        descriptionPrefix={`${rollerName}:`}
        descriptionSuffix={`${timeString}.`}
        actions={<NormalRollActions rollId={logId} roll={log} />}
      />
      <Typography color={"textSecondary"} variant={"caption"} aria-hidden>
        {timeString}
      </Typography>
    </Box>
  );
}
