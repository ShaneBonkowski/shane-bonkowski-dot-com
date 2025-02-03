import { aboutData } from "data/about-data";

export default function AboutMe() {
  return (
    <div className="ml-common-ml mr-common-ml p-common-padding text-left">
      <h1 className="font-bold">{aboutData.title}</h1>
      <h2>{aboutData.subtitle}</h2>
      {aboutData.paragraphs.map((text, index) => (
        <p
          key={index}
          className="leading-relaxed"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      ))}
    </div>
  );
}
