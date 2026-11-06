import {
  Alert,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  TextField,
  Typography,
  capitalize,
} from "@mui/material";
import { SectionHeading } from "components/shared/SectionHeading";
import { useEffect, useState } from "react";
import { useStore } from "stores/store";
import { dataswornVersion } from "config/datasworn.config";
import { PackageTypes } from "api-calls/homebrew/_homebrewCollection.type";
import { InviteEditorDialog } from "./InviteEditorDialog";
import { useSnackbar } from "providers/SnackbarProvider";
import { constructHomebrewEditorPath } from "pages/Homebrew/routes";
import { UserList } from "./UserList";
import { useConfirm } from "material-ui-confirm";
import { arrayRemove } from "firebase/firestore";
import { removeSelfAsEditor } from "api-calls/homebrew/editorFunction/removeSelfAsEditor";
import { useNavigate } from "react-router-dom";
import { BASE_ROUTES, basePaths } from "routes";
import { Description } from "./Description";

export interface AboutSectionProps {
  id: string;
  isEditor: boolean;
  isViewer: boolean;
  isOwner: boolean;
}

export function AboutSection(props: AboutSectionProps) {
  const { id, isEditor, isViewer, isOwner } = props;

  const { success } = useSnackbar();

  const details = useStore((store) => store.homebrew.collections[id].base);
  const updateDetails = useStore((store) => store.homebrew.updateExpansion);

  const originalTitle = details.title;
  const [title, setTitle] = useState(details.title ?? "");

  useEffect(() => {
    if (originalTitle) {
      setTitle(originalTitle);
    }
  }, [originalTitle]);

  const [inviteEditorDialogOpen, setInviteEditorDialogOpen] = useState(false);

  const handleCopy = () => {
    const viewerLink = constructHomebrewEditorPath(id);
    navigator.clipboard
      .writeText(window.location.origin + viewerLink)
      .then(() => {
        success("Copied URL to clipboard");
      });
  };

  const deleteCollection = useStore((store) => store.homebrew.deleteExpansion);
  const updateExpansion = useStore((store) => store.homebrew.updateExpansion);

  const uid = useStore((store) => store.auth.uid);

  const navigate = useNavigate();

  const confirm = useConfirm();

  const removeSelf = () => {
    const promises: Promise<unknown>[] = [];
    if (isViewer) {
      promises.push(updateExpansion(id, { viewers: arrayRemove(uid) }));
    }
    if (isEditor) {
      promises.push(removeSelfAsEditor(id));
    }
    Promise.all(promises)
      .then(() => {
        location.reload();
      })
      .catch(() => {
        location.reload();
      });
  };

  const handleDeleteCollection = () => {
    confirm({
      title: "Delete Homebrew Collection",
      description:
        "Are you sure you want to delete this homebrew expansion? Characters and campaigns that use this expansion will no longer be able to use it.",
      confirmationText: "Delete",
      confirmationButtonProps: {
        variant: "contained",
        color: "error",
      },
    })
      .then(() => {
        deleteCollection(id)
          .then(() => {
            navigate(basePaths[BASE_ROUTES.HOMEBREW]);
          })
          .catch(() => {});
      })
      .catch(() => {});
  };

  return (
    <Box
      sx={{
        ["&>:not(:last-of-type)"]: {
          mb: 2,
        },
      }}
    >
      <SectionHeading label="Collection Details" breakContainer />
      <Grid container spacing={2}>
        {isEditor && (
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label={"Title"}
              value={title}
              onChange={(evt) => setTitle(evt.currentTarget.value)}
              onBlur={(evt) =>
                updateDetails(id, { title: evt.currentTarget.value }).catch(
                  () => {}
                )
              }
              fullWidth
            />
          </Grid>
        )}
        {(!!details.description || isEditor) && (
          <Grid item xs={12}>
            <Description
              expansionId={id}
              description={details.description ?? ""}
              isEditor={isEditor}
            />
          </Grid>
        )}
        {details.type === PackageTypes.Expansion && (
          <Grid item xs={12}>
            <Typography variant="overline">Expansion For</Typography>
            <Typography>{capitalize(details.rulesetId)}</Typography>
          </Grid>
        )}
        <Grid item xs={12}>
          <Typography variant={"overline"}>Datasworn Version</Typography>
          <Typography>{dataswornVersion}</Typography>
        </Grid>
        <Grid item xs={12}>
          <SectionHeading
            label={isEditor ? "Content Sharing" : "Author Info"}
            breakContainer
          />
        </Grid>
        {isEditor && (
          <Grid item xs={12}>
            <Alert severity={"info"}>
              Players and Guides in the campaigns you run will automatically be
              able to view enabled homebrew content within their character
              sheets and Guide screens, but will not be able to edit content
              unless you invite them as an editor.
            </Alert>
          </Grid>
        )}
        <Grid item xs={12} sm={6}>
          <Card variant={"outlined"} sx={{ p: 2 }}>
            <Typography variant={"h6"} component={"h3"}>
              Editors
            </Typography>
            {isEditor && (
              <>
                <Typography color={"textSecondary"} variant={"body2"}>
                  Editors can create, update, or delete any content within this
                  collection.
                </Typography>
                <Button
                  variant={"outlined"}
                  color={"inherit"}
                  sx={{ mt: 2 }}
                  onClick={() => setInviteEditorDialogOpen(true)}
                >
                  Invite Editors
                </Button>

                <Divider sx={{ my: 2 }} />
              </>
            )}
            <Box>
              {isEditor && (
                <Typography variant={"overline"}>Editors</Typography>
              )}
              <UserList userIds={details.editors} />
            </Box>
          </Card>
        </Grid>
        {isEditor && (
          <Grid item xs={12} sm={6}>
            <Card variant={"outlined"} sx={{ p: 2 }}>
              <Typography variant={"h6"} component={"h3"}>
                Viewers
              </Typography>
              <Typography color={"textSecondary"} variant={"body2"}>
                Viewers will be able to add this content to their own homebrew
                libraries to use for characters and campaigns, but will not be
                allowed to edit anything.
              </Typography>
              <Button
                variant={"outlined"}
                color={"inherit"}
                sx={{ mt: 2 }}
                onClick={() => handleCopy()}
              >
                Copy Viewer Link
              </Button>

              <Box mt={2}>
                <Typography color={"textSecondary"}>
                  {details.viewers?.length ?? 0}{" "}
                  {(details.viewers?.length ?? 0) === 1 ? "person " : "people "}
                  added this to their homebrew library
                </Typography>
              </Box>
            </Card>
          </Grid>
        )}
        {(isOwner || isEditor || isViewer) && (
          <>
            <Grid item xs={12}>
              <SectionHeading label={"Danger Zone"} breakContainer />
            </Grid>
            <Grid item xs={12}>
              {isOwner && (
                <Button
                  variant={"outlined"}
                  color={"error"}
                  onClick={handleDeleteCollection}
                >
                  Delete Homebrew Collection
                </Button>
              )}
              {((!isOwner && isEditor) || isViewer) && (
                <Button
                  variant={"outlined"}
                  color={"error"}
                  onClick={() => removeSelf()}
                >
                  Remove from your Homebrew Collections
                </Button>
              )}
            </Grid>
          </>
        )}
      </Grid>
      {isEditor && (
        <InviteEditorDialog
          open={inviteEditorDialogOpen}
          onClose={() => setInviteEditorDialogOpen(false)}
          homebrewId={id}
        />
      )}
    </Box>
  );
}
