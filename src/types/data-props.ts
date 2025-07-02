export interface GameMetadataProps {
  title: string;
  description: string;
  logoImageUrl: string;
  imageAlt: string;
}

export interface StoryMetadataProps {
  title: string;
  subtitle: string;
  date: string;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  artContent?: boolean;
  body: StoryContentDataProps[];
}

export interface StoryContentDataProps {
  content: string;
  fontStyle: "normal" | "italic" | "bold";
  textAlign: "left" | "center" | "right" | "justify";
  splitParagraphs?: boolean;
}
