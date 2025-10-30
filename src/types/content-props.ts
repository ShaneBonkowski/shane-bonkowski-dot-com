export interface ContentBoxProps {
  imageUrl: string;
  linkUrl: string;
  title: string;
  dateISO: string;
  description: string;
  searchTags: string;
  contentType: "games" | "writing" | "art" | "comics";
  openInNewTab: boolean;
  childDataKey: string | null;
}

export interface ComicDataProps {
  imageUrl: string;
  captionOrTitle: string;
  dateISO: string;
  contentImageWidth: number;
  contentImageHeight: number;
  comicNum: number;
}
