"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaGamepad, FaPenNib, FaPaintBrush } from "react-icons/fa";
import { ContentBoxProps } from "@/components/layout/ContentSearchBar";

const getIcon = (contentType: string) => {
  switch (contentType) {
    case "games":
      return (
        <FaGamepad className="text-primary-text-color text-1xl sm:text-2xl" />
      );
    case "writing":
      return (
        <FaPenNib className="text-primary-text-color text-1xl sm:text-2xl" />
      );
    case "art":
      return (
        <FaPaintBrush className="text-primary-text-color text-1xl sm:text-2xl" />
      );
    default:
      return null;
  }
};

const ContentBox: React.FC<ContentBoxProps> = ({
  imageUrl,
  linkUrl,
  title,
  description,
  contentType,
  openInNewTab,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex items-stretch w-content-box-w sm:content-box-w-sm mx-auto bg-button-color text-primary-text-color rounded-lg overflow-hidden">
      {/* Image on the Left */}
      <Link
        href={linkUrl}
        target={openInNewTab ? "_blank" : "_self"}
        rel="noopener noreferrer"
        className="link w-1/2 sm:w-1/5 h-content-box-content-h sm:h-content-box-content-h-sm"
      >
        <Image
          src={imageUrl}
          alt={title}
          width={500}
          height={422}
          className={`w-full h-full object-cover transform transition-transform duration-0 ${
            isHovered ? "scale-110" : "scale-100"
          } cursor-pointer`}
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
        />
      </Link>

      {/* Content Box on the Right */}
      <div className="flex flex-col items-start justify-center w-4/5 h-content-box-content-h sm:h-content-box-content-h-sm p-3 sm:p-5 space-y-2 sm:space-y-3">
        {/* Icon + Title */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {getIcon(contentType)}
          <Link
            href={linkUrl}
            target={openInNewTab ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className="link"
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
          >
            <h3
              className={`font-bold m-0 text-content-box-title sm:text-content-box-title-sm ${
                isHovered
                  ? "text-primary-text-color underline decoration-white"
                  : "text-primary-text-color no-underline"
              }`}
            >
              {title}
            </h3>
          </Link>
        </div>

        {/* Description */}
        <p className="text-secondary-text-color text-content-box-subtitle sm:text-content-box-subtitle-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ContentBox;
