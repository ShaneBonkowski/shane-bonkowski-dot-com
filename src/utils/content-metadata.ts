type ContentMetadata = {
  title: string;
  description: string;
  coverImageUrl: string;
  imageAlt?: string;
};

export function createContentMetadata(content: ContentMetadata, path: string) {
  const image = `https://shanebonkowski.com${content.coverImageUrl}`;
  const alt = content.imageAlt ?? content.description;

  return {
    title: content.title,
    description: content.description,
    openGraph: {
      title: content.title,
      description: content.description,
      url: `https://shanebonkowski.com${path}`,
      images: [{ url: image, alt }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      site: "@ShaneBonkowski",
      title: content.title,
      description: content.description,
      image,
      imageAlt: alt,
    },
  };
}
