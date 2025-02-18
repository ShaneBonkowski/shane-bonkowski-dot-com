export interface ContentBoxProps {
  imageUrl: string;
  linkUrl: string;
  title: string;
  description: string;
  searchTags: string;
  contentType: "games" | "writing" | "art";
  openInNewTab: boolean;
}
