import { useGameSystemValue } from "hooks/useGameSystemValue";
import { PropsWithChildren } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { GAME_SYSTEMS, GameSystemChooser } from "types/GameSystems.type";

export const appDetails: GameSystemChooser<{
  title: string;
  description: string;
  icon: string;
  game: string;
}> = {
  [GAME_SYSTEMS.IRONSWORN]: {
    title: "Iron Fellowship for Ironsworn",
    description:
      "A character sheet and campaign manager for players and GMs playing Ironsworn",
    icon: "/iron-fellowship-logo.svg",
    game: "Ironsworn",
  },
  [GAME_SYSTEMS.STARFORGED]: {
    title: "Crew Link for Starforged",
    description:
      "A character sheet and campaign manager for players and GMs playing Starforged",
    icon: "/crew-link-logo.svg",
    game: "Starforged",
  },
};

export function HeadProvider(props: PropsWithChildren) {
  const { children } = props;

  const pathname = useLocation().pathname;
  const url = window.location.origin + pathname;

  const details = useGameSystemValue(appDetails);

  return (
    <HelmetProvider>
      <Helmet>
        <title>{details.title}</title>
        <meta property="og:site_name" content={details.title} />
        <meta property="og:title" content={details.title} />
        <link rel="icon" type="image/svg+xml" href={details.icon} />
        <meta property="og:description" content={details.description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="/assets/ironsworn-opengraph-default.png"
        />
        <meta
          property="og:image:secure_url"
          content="/assets/ironsworn-opengraph-default.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:image"
          content="/assets/ironsworn-opengraph-default.png"
        />
      </Helmet>
      {children}
    </HelmetProvider>
  );
}
