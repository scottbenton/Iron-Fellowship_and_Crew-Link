import { useGameSystemValue } from "hooks/useGameSystemValue";
import { Helmet } from "react-helmet-async";
import { appDetails } from "./HeadProvider";

export interface HeadProps {
  title: string;
  description?: string;
  openGraphImageSrc?: string;
}

export function Head(props: HeadProps) {
  const { title, description, openGraphImageSrc } = props;

  const details = useGameSystemValue(appDetails);

  return (
    <Helmet>
      <title>
        {title} | {details.title}
      </title>
      <meta property="og:title" content={`${title} | ${details.title}`} />
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
