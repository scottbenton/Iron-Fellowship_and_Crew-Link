import { Helmet } from "react-helmet-async";

export interface HeadProps {
  title: string;
  description?: string;
  openGraphImageSrc?: string;
}

export function Head(props: HeadProps) {
  const { title, description, openGraphImageSrc } = props;

  return (
    <Helmet>
      <title>{title} | Iron Fellowship</title>
      <meta property="og:title" content={title + " | Iron Fellowship"} />
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
