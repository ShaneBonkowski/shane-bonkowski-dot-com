import React from "react";

export interface GameMetadataProps {
  title: string;
  description: string;
  coverImageUrl: string;
  imageAlt: string;
}

export interface WrittenContentMetadataProps {
  title: string;
  subtitle: string;
  description: string;
  date: string;
  coverImageUrl: string;
  contentImageUrl: string;
  contentImageWidth: number;
  contentImageHeight: number;
  artContent?: boolean;
  children?: React.ReactNode;
}

export interface ComicMetadataProps {
  title: string;
  subtitle: string;
  description: string;
  coverImageUrl: string;
}
