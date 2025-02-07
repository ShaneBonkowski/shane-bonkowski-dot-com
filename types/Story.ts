export interface StoryContentProps {
  content: string;
  fontStyle: "normal" | "italic" | "bold";
  textAlign: "left" | "center" | "right" | "justify";
  splitParagraphs?: boolean;
}

export interface StoryProps {
  title: string;
  subtitle: string;
  date: string;
  imageUrl: string;
  body: StoryContentProps[];
}
