import {
  Alert,
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  ChangeEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useConfirm } from "material-ui-confirm";
import { SectionHeading } from "components/shared/SectionHeading";
import { RtcRichTextEditor } from "components/shared/RichTextEditor/RtcRichTextEditor";
import { LoreTagsAutocomplete } from "./LoreTagsAutocomplete";
import { useStore } from "stores/store";
import { LoreDocumentWithGMProperties } from "stores/world/currentWorld/lore/lore.slice.type";
import { useListenToCurrentLoreDocument } from "stores/world/currentWorld/lore/useListenToCurrentLoreDocument";
import { ItemHeader } from "../ItemHeader";
import { useWorldPermissions } from "../useWorldPermissions";
import { ImageBanner } from "../ImageBanner";
import AddPhotoIcon from "@mui/icons-material/AddPhotoAlternate";
import { MAX_FILE_SIZE, MAX_FILE_SIZE_LABEL } from "lib/storage.lib";
import { useSnackbar } from "providers/SnackbarProvider";

export interface OpenLoreProps {
  worldId: string;
  loreId: string;
  lore: LoreDocumentWithGMProperties;
  closeLore: () => void;
  tagList: string[];
  showImages: boolean;
}

export function OpenLore(props: OpenLoreProps) {
  const { worldId, loreId, lore, closeLore, tagList, showImages } = props;

  const { isSinglePlayer, showGMFields, showGMTips } = useWorldPermissions();

  useListenToCurrentLoreDocument(loreId);

  const { error } = useSnackbar();
  const confirm = useConfirm();

  const [loreName, setLoreName] = useState<string>(lore.name);

  const initialLoreName = lore.name;
  useEffect(() => {
    setLoreName(initialLoreName);
  }, [initialLoreName]);

  const updateLore = useStore(
    (store) => store.worlds.currentWorld.currentWorldLore.updateLore
  );
  const updateLoreGMNotes = useStore(
    (store) => store.worlds.currentWorld.currentWorldLore.updateLoreGMNotes
  );
  const deleteLore = useStore(
    (store) => store.worlds.currentWorld.currentWorldLore.deleteLore
  );
  const updateLoreNotes = useStore(
    (store) => store.worlds.currentWorld.currentWorldLore.updateLoreNotes
  );
  const uploadLoreImage = useStore(
    (store) => store.worlds.currentWorld.currentWorldLore.uploadLoreImage
  );
  const removeLoreImage = useStore(
    (store) => store.worlds.currentWorld.currentWorldLore.removeLoreImage
  );

  const nameInputRef = useRef<HTMLInputElement>(null);
  const initialLoadRef = useRef<boolean>(true);

  useLayoutEffect(() => {
    if (initialLoadRef.current && nameInputRef.current) {
      if (lore.name === "New Lore Document") {
        nameInputRef.current.select();
      }
      initialLoadRef.current = false;
    }
  }, [lore]);

  const handleLoreDelete = () => {
    confirm({
      title: `Delete ${lore.name}`,
      description:
        "Are you sure you want to delete this lore document? It will be deleted from ALL of your characters and campaigns that use this world. This cannot be undone.",
      confirmationText: "Delete",
      confirmationButtonProps: {
        variant: "contained",
        color: "error",
      },
    })
      .then(() => {
        deleteLore(loreId)
          .catch(() => {})
          .then(() => {
            closeLore();
          });
      })
      .catch(() => {});
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileUpload = (evt: ChangeEvent<HTMLInputElement>) => {
    const files = evt.target.files;
    const file = files?.[0];
    if (file) {
      if (files[0].size > MAX_FILE_SIZE) {
        error(
          `File is too large. The max file size is ${MAX_FILE_SIZE_LABEL}.`
        );
        evt.target.value = "";
        return;
      }
      uploadLoreImage(loreId, file).catch(() => {});
    }
  };

  return (
    <Box
      overflow={"auto"}
      bgcolor={(theme) => theme.palette.background.paper}
      width={"100%"}
      sx={(theme) => ({ borderLeft: `1px solid ${theme.palette.divider}` })}
    >
      <input
        type="file"
        accept={"image/*"}
        hidden
        ref={fileInputRef}
        onChange={onFileUpload}
      />
      {showImages && (
        <ImageBanner
          title={lore.name}
          src={lore.imageUrl}
          removeImage={() => removeLoreImage(loreId)}
        />
      )}

      <ItemHeader
        itemName={loreName}
        updateName={(name) => updateLore(loreId, { name }).catch(() => {})}
        closeItem={closeLore}
        actions={
          <>
            {showImages && (
              <Tooltip title={"Upload Image"}>
                <IconButton onClick={() => fileInputRef?.current?.click()}>
                  <AddPhotoIcon />
                </IconButton>
              </Tooltip>
            )}
            {showGMFields && (
              <Tooltip title={"Delete Document"}>
                <IconButton onClick={() => handleLoreDelete()}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
          </>
        }
      />
      <Box
        sx={(theme) => ({
          mt: 1,
          px: 3,
          [theme.breakpoints.down("sm")]: { px: 2 },
        })}
      >
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} lg={6}>
            <LoreTagsAutocomplete
              tagList={tagList}
              tags={lore.tags}
              updateTags={(tags) =>
                updateLore(loreId, { tags }).catch(() => {})
              }
            />
          </Grid>
          {showGMFields && (
            <>
              {showGMTips && (
                <>
                  <Grid item xs={12}>
                    <SectionHeading label={"GM Only"} breakContainer />
                  </Grid>
                  <Grid item xs={12}>
                    <Alert severity={"info"}>
                      Information in this section will not be shared with your
                      players.
                    </Alert>
                  </Grid>
                </>
              )}
              {!isSinglePlayer && (
                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{ alignItems: "center", display: "flex" }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={lore.sharedWithPlayers ?? false}
                        onChange={(evt, value) =>
                          updateLore(loreId, {
                            sharedWithPlayers: value,
                          }).catch(() => {})
                        }
                      />
                    }
                    label="Visible to Players"
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <RtcRichTextEditor
                  id={loreId}
                  roomPrefix={`iron-fellowship-${worldId}-lore-gmnotes-`}
                  documentPassword={worldId}
                  onSave={updateLoreGMNotes}
                  initialValue={lore.gmProperties?.gmNotes}
                />
              </Grid>
            </>
          )}
          {!isSinglePlayer && (
            <>
              {showGMTips && (
                <>
                  <Grid item xs={12}>
                    <SectionHeading
                      label={"GM & Player Notes"}
                      breakContainer
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Alert severity={"info"}>
                      Notes in this section will only be visible to gms &
                      players in campaigns. Notes for singleplayer games should
                      go in the above section.
                    </Alert>
                  </Grid>
                </>
              )}
              {!lore.sharedWithPlayers && (
                <Grid item xs={12}>
                  <Alert severity="warning">
                    These notes are not yet visible to players because this
                    location is hidden from them.
                  </Alert>
                </Grid>
              )}
              <Grid item xs={12}>
                {(lore.notes || lore.notes === null) && (
                  <RtcRichTextEditor
                    id={loreId}
                    roomPrefix={`iron-fellowship-${worldId}-lore-`}
                    documentPassword={worldId}
                    onSave={updateLoreNotes}
                    initialValue={lore.notes || undefined}
                  />
                )}
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </Box>
  );
}
