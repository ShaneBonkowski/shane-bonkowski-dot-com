import React from "react";
import { ContentLoaderProps } from "@/types/Content";

const ContentLoader: React.FC<ContentLoaderProps> = ({ contentData }) => {
  return (
    <div className="ml-common-ml mr-common-ml p-common-padding text-left">
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
                dangerouslySetInnerHTML={{ __html: item.text || "" }}
              />
            );
          case "list":
            return (
              <ul key={index} className="list-disc pl-6">
                {item.items?.map((listItem, listIndex) => (
                  <li
                    key={listIndex}
                    className="leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: listItem }}
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

export default ContentLoader;
