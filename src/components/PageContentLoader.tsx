import React from "react";
import { ContentDataProps } from "@/src/types/data-props";
import DOMPurify from "dompurify";

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
                  __html: item.text ? DOMPurify.sanitize(item.text) : "",
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
                      __html: listItem ? DOMPurify.sanitize(listItem) : "",
                    }}
                  />
                ))}
              </ul>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

export default PageContentLoader;
