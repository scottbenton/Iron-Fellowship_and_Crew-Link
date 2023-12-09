import { NAV_ROUTES } from "hooks/useActiveNavRoute";
import { CharacterMenu } from "./CharacterMenu";
import { CampaignMenu } from "./CampaignMenu";
import { WorldMenu } from "./WorldMenu";
import { HomebrewMenu } from "./HomebrewMenu";

export interface NavRailFlyoutProps {
  openMenu: NAV_ROUTES;
}

export function NavRailFlyouts(props: NavRailFlyoutProps) {
  const { openMenu } = props;

  if (openMenu === NAV_ROUTES.CHARACTER) {
    return <CharacterMenu />;
  } else if (openMenu === NAV_ROUTES.CAMPAIGN) {
    return <CampaignMenu />;
  } else if (openMenu === NAV_ROUTES.WORLD) {
    return <WorldMenu />;
  } else if (openMenu === NAV_ROUTES.HOMEBREW) {
    return <HomebrewMenu />;
  }

  return <></>;
}
