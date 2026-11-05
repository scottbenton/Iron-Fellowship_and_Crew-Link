import {
  Box,
  Button,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Typography,
} from "@mui/material";
import { DialogTitleWithCloseButton } from "../DialogTitleWithCloseButton";
import { themes } from "providers/ThemeProvider/themes";
import { Themes } from "providers/ThemeProvider/themes/theme.types";
import { useToggleTheme } from "providers/ThemeProvider";
import CheckIcon from "@mui/icons-material/CheckCircle";
import { useStore } from "stores/store";

export interface ThemeChooserDialogProps {
  open: boolean;
  onClose: () => void;
}
export function ThemeChooserDialog(props: ThemeChooserDialogProps) {
  const { open, onClose } = props;

  const { themeType, theme: currentThemeKey } = useToggleTheme();

  const hasCampaign = useStore(
    (store) => !!store.campaigns.currentCampaign.currentCampaignId
  );
  const updateCampaign = useStore(
    (store) => store.campaigns.currentCampaign.updateCampaign
  );
  const hasCharacter = useStore(
    (store) => !!store.characters.currentCharacter.currentCharacterId
  );
  const updateCharacter = useStore(
    (store) => store.characters.currentCharacter.updateCurrentCharacter
  );

  const setTheme = (key: Themes) => {
    if (hasCampaign) {
      updateCampaign({ theme: key }).catch(() => {});
    }
    if (hasCharacter) {
      updateCharacter({ theme: key }).catch(() => {});
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitleWithCloseButton onClose={onClose}>
        Choose Theme
      </DialogTitleWithCloseButton>
      <DialogContent>
        <Grid container spacing={2}>
          {Object.keys(themes).map((themeKey) => {
            const theme = themes[themeKey as Themes];
            const themeConfig = theme.configs[themeType];
            return (
              <Grid item xs={12} sm={6} key={themeKey}>
                <ButtonBase
                  aria-pressed={currentThemeKey === themeKey}
                  sx={{
                    border: `1px solid ${
                      (theme.palette.primary as { main: string }).main
                    }`,
                    bgcolor: themeConfig.background.paperInlay,
                    borderRadius: theme.borderRadius + "px",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 1,
                    position: "relative",
                  }}
                  onClick={() => setTheme(themeKey as Themes)}
                >
                  {currentThemeKey === themeKey && (
                    <CheckIcon
                      sx={(currTheme) => ({
                        position: "absolute",
                        top: currTheme.spacing(1),
                        right: currTheme.spacing(1),
                        color: (theme.palette.primary as { main: string }).main,
                      })}
                    />
                  )}
                  <Typography variant={"overline"}>{theme.name}</Typography>

                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    alignSelf={"stretch"}
                    p={2}
                  >
                    <img width={40} height={40} src={theme.iconPath} alt={""} />
                  </Box>
                </ButtonBase>
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant={"contained"} onClick={onClose}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
