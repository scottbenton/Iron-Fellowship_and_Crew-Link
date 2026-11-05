import { useGameSystemValue } from "hooks/useGameSystemValue";
import { Helmet } from "react-helmet-async";
import { appDetails } from "config/appDetails.config";
import { getPageTitle } from "./getPageTitle";

export interface HeadProps {
  title: string;
  description?: string;
  openGraphImageSrc?: string;
}

export function Head(props: HeadProps) {
  const { title, description, openGraphImageSrc } = props;

  const details = useGameSystemValue(appDetails);
  const pageTitle = getPageTitle(title, details.title);

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta property="og:title" content={pageTitle} />
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
