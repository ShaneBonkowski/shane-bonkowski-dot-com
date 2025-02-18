export interface GameDataProps {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
}

export interface ContentDataProps {
  type: "h1" | "h2" | "h3" | "paragraph" | "list";
  text?: string;
  items?: string[];
}

export interface StoryDataContentProps {
  content: string;
  fontStyle: "normal" | "italic" | "bold";
  textAlign: "left" | "center" | "right" | "justify";
  splitParagraphs?: boolean;
}

export interface StoryDataProps {
  title: string;
  subtitle: string;
  date: string;
  imageUrl: string;
  body: StoryDataContentProps[];
}
