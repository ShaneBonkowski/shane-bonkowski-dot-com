import React from "react";

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
  coverImageUrl: string;
  coverImageWidth: number;
  coverImageHeight: number;
  artContent?: boolean;
  children?: React.ReactNode;
}
