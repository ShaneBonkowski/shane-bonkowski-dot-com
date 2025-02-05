export interface ContentBoxProps {
  imageUrl: string;
  linkUrl: string;
  title: string;
  description: string;
  searchTags: string;
  contentType: "games" | "writing" | "art";
  openInNewTab: boolean;
}

export interface ContentItemProps {
  type: "h1" | "h2" | "h3" | "paragraph" | "list";
  text?: string;
  items?: string[];
}

export interface ContentLoaderProps {
  contentData: ContentItemProps[];
}

export interface ContentSearchBarProps {
  contentData: ContentBoxProps[];
  setFilteredContent: (filtered: ContentBoxProps[]) => void;
}
