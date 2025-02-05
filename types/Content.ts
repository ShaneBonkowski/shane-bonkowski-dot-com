export interface PageContentItemProps {
  type: "h1" | "h2" | "h3" | "paragraph" | "list";
  text?: string;
  items?: string[];
}

export interface PageContentLoaderProps {
  contentData: PageContentItemProps[];
}

export interface ContentBoxProps {
  imageUrl: string;
  linkUrl: string;
  title: string;
  description: string;
  searchTags: string;
  contentType: "games" | "writing" | "art";
  openInNewTab: boolean;
}

export interface ContentSearchBarProps {
  contentData: ContentBoxProps[];
  setFilteredContent: (filtered: ContentBoxProps[]) => void;
}
