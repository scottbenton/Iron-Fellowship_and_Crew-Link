import { PropsWithChildren } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useLocation } from "react-router-dom";

export function HeadProvider(props: PropsWithChildren) {
  const { children } = props;

  const pathname = useLocation().pathname;
  const url = window.location.origin + pathname;

  return (
    <HelmetProvider>
      <Helmet>
        <title>Iron Fellowship</title>
        <meta property="og:site_name" content="Iron Fellowship" />
        <meta property="og:title" content="Iron Fellowship" />
        <meta
          property="og:description"
          content="A collaborative app for players and GMs playing Ironsworn"
        />
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
