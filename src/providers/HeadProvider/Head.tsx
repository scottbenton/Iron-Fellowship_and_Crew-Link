import { useGameSystemValue } from "hooks/useGameSystemValue";
import { Helmet } from "react-helmet-async";
import { GAME_SYSTEMS, GameSystemChooser } from "types/GameSystems.type";

export interface HeadProps {
  title: string;
  description?: string;
  openGraphImageSrc?: string;
}

const appDetails: GameSystemChooser<{ title: string; icon: string }> = {
  [GAME_SYSTEMS.IRONSWORN]: {
    title: "Iron Fellowship for Ironsworn",
    icon: "/iron-fellowship-logo.svg",
  },
  [GAME_SYSTEMS.STARFORGED]: {
    title: "Crew Link for Starforged",
    icon: "/crew-link-logo.svg",
  },
};

export function Head(props: HeadProps) {
  const { title, description, openGraphImageSrc } = props;

  const details = useGameSystemValue(appDetails);

  return (
    <Helmet>
      <title>
        {title} | {details.title}
      </title>
      <meta property="og:title" content={`${title} | ${details.title}`} />
      <link rel="icon" type="image/svg+xml" href={details.icon} />
      {description && <meta property="og:description" content={description} />}
      {openGraphImageSrc && (
        <>
          <meta property="og:image" content={openGraphImageSrc} />
          <meta property="og:image:secure_url" content={openGraphImageSrc} />
          <meta property="twitter:image" content={openGraphImageSrc} />
        </>
      )}
    </Helmet>
  );
}
