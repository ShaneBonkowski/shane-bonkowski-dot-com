export interface ContentBoxProps {
  imageUrl: string;
  linkUrl: string;
  title: string;
  dateISO: string;
  description: string;
  searchTags: string;
  contentType: "games" | "writing" | "art";
  openInNewTab: boolean;
}
