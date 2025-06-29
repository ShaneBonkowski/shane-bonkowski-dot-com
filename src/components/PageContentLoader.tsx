"use client";

import Image from "next/image";
import React from "react";
import { ContentDataProps } from "@/src/types/data-props";
import { sanitizeHtml } from "@/src/utils/sanitize";

const PageContentLoader: React.FC<{
  contentData: ContentDataProps[];
  id: string;
}> = ({ contentData, id }) => {
  return (
    <div
      className="ml-common-ml mr-common-ml sm:px-common-p-sm text-left"
      id={id}
      aria-label={`Page content for ${id}`}
    >
      {contentData.map((item, index) => {
        switch (item.type) {
          case "h1":
            return <h1 key={index}>{item.text}</h1>;
          case "h2":
            return <h2 key={index}>{item.text}</h2>;
          case "h3":
            return <h3 key={index}>{item.text}</h3>;
          case "paragraph":
            return (
              <p
                key={index}
                className="leading-relaxed"
                // eslint-disable-next-line no-restricted-syntax
                dangerouslySetInnerHTML={{
                  __html: item.text ? sanitizeHtml(item.text) : "",
                }}
              />
            );
          case "list":
            return (
              <ul key={index} className="list-disc pl-6">
                {item.items?.map((listItem, listIndex) => (
                  <li
                    key={listIndex}
                    className="leading-relaxed"
                    // eslint-disable-next-line no-restricted-syntax
                    dangerouslySetInnerHTML={{
                      __html: listItem ? sanitizeHtml(listItem) : "",
                    }}
                  />
                ))}
              </ul>
            );
          case "image":
            return (
              <div
                key={index}
                className={`my-8 flex justify-center w-3/4 h-3/4 sm:w-1/2 sm:h-1/2`}
              >
                <Image
                  src={item.contentImageData!.src}
                  alt={item.contentImageData!.alt}
                  width={item.contentImageData!.width}
                  height={item.contentImageData!.height}
                  className="object-contain"
                />
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

export default PageContentLoader;
