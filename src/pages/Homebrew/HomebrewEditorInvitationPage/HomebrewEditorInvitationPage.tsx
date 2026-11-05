import { LoadingButton } from "@mui/lab";
import { Box, LinearProgress } from "@mui/material";
import { acceptEditorInvite } from "api-calls/homebrew/editorFunction/acceptEditorInvite";
import { getHomebrewCollectionFromInviteUrl } from "api-calls/homebrew/editorFunction/getHomebrewCollectionFromInviteUrl";
import { EmptyState } from "components/shared/EmptyState";
import { PageContent, PageHeader } from "components/shared/Layout";
import { Head } from "providers/HeadProvider/Head";
import { useSnackbar } from "providers/SnackbarProvider";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useListenToHomebrewContent } from "stores/homebrew/useListenToHomebrewContent";
import { useStore } from "stores/store";
import { constructHomebrewEditorPath } from "../routes";

export function HomebrewEditorInvitationPage() {
  const { editorInviteKey } = useParams<{ editorInviteKey: string }>();
  const [homebrewId, setHomebrewId] = useState<string>();

  useEffect(() => {
    if (editorInviteKey) {
      getHomebrewCollectionFromInviteUrl(editorInviteKey)
        .then((parsedHomebrewId) => {
          setHomebrewId(parsedHomebrewId ?? undefined);
        })
        .catch((e) => console.error(e));
    } else {
      setHomebrewId(undefined);
    }
  }, [editorInviteKey]);

  const homebrewIds = useMemo(() => {
    if (homebrewId) {
      return [homebrewId];
    }
    return [];
  }, [homebrewId]);

  useListenToHomebrewContent(homebrewIds);

  const homebrewDetails = useStore(
    (store) =>
      homebrewId ? store.homebrew.collections[homebrewId]?.base : undefined,
    (a, b) => JSON.stringify(a) === JSON.stringify(b)
  );

  const navigate = useNavigate();
  const { success, error } = useSnackbar();
  const [acceptLoading, setAcceptLoading] = useState(false);
  const handleAccept = useCallback(() => {
    if (homebrewId && editorInviteKey) {
      setAcceptLoading(true);
      acceptEditorInvite(homebrewId, editorInviteKey)
        .then((result) => {
          if (result) {
            success("You have been added as an editor");
            navigate(constructHomebrewEditorPath(homebrewId));
          } else {
            error("Failed to add you as an editor.");
          }
        })
        .catch(() => {
          error("Failed to add you as an editor.");
        })
        .finally(() => {
          setAcceptLoading(false);
        });
    }
  }, [homebrewId, editorInviteKey, success, error, navigate]);

  if (!homebrewDetails) {
    return <LinearProgress />;
  }

  return (
    <>
      <Head title={`Join ${homebrewDetails.title}`} />
      <PageHeader label={`Join ${homebrewDetails.title}`} />
      <PageContent isPaper>
        <Box display={"flex"} mt={4} justifyContent={"center"}>
          <EmptyState
            title={"Invitation to Edit"}
            message={`By accepting this invitation, you will be allowed to edit the contents of the homebrew collection ${homebrewDetails.title}.`}
            showImage
            callToAction={
              <LoadingButton
                loading={acceptLoading}
                variant={"contained"}
                onClick={handleAccept}
              >
                Accept Invitation
              </LoadingButton>
            }
          />
        </Box>
      </PageContent>
    </>
  );
}
