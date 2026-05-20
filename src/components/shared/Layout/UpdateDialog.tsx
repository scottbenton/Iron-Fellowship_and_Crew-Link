import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useStore } from "stores/store";
import { DialogTitleWithCloseButton } from "../DialogTitleWithCloseButton";
import { HomebrewUpdate } from "./UpdateComponents/HomebrewUpdate";
import { MapsUpdate } from "./UpdateComponents/MapsUpdate";

const updateComponents: Record<
  string,
  { title: string; component: React.ReactNode }
> = {
  "3.0.0": {
    title: "Homebrew Updates",
    component: <HomebrewUpdate />,
  },
  "3.3.0": {
    title: "Locations have updated!",
    component: <MapsUpdate />,
  },
};

const appVersion = APP_VERSION;

export function UpdateDialog() {
  const user = useStore((store) => store.auth.userDoc);
  const [shouldOpenIfUpdateHasComponent, setShouldOpenIfUpdateHasComponent] =
    useState(false);
  const updateUser = useStore((store) => store.auth.updateUserDoc);

  useEffect(() => {
    if (user && user.appVersion && appVersion !== user.appVersion) {
      setShouldOpenIfUpdateHasComponent(true);
    } else if (user && !user.appVersion) {
      updateUser({ appVersion });
    }
  }, [user, updateUser]);

  const activeAlert = updateComponents[appVersion];

  if (!activeAlert || !user) {
    return null;
  }

  const handleClose = () => {
    setShouldOpenIfUpdateHasComponent(false);
    updateUser({ appVersion });
  };

  return (
    <Dialog open={shouldOpenIfUpdateHasComponent} onClose={handleClose}>
      <DialogTitleWithCloseButton onClose={handleClose}>
        {activeAlert.title}
      </DialogTitleWithCloseButton>
      <DialogContent>{activeAlert.component}</DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
