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
  date: string;
  coverImageUrl: string;
  coverImageWidth: number;
  coverImageHeight: number;
  artContent?: boolean;
  children?: React.ReactNode;
}
