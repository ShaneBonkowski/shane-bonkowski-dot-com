import PageContentLoader from "@/src/components/PageContentLoader";
import { ContentDataProps } from "@/src/types/data-props";

const aboutData: ContentDataProps[] = [
  { type: "h1", text: "Shane Bonkowski" },
  {
    type: "h2",
    text: "Engineering, Games, Art, Writing, and anything in between.",
  },
  {
    type: "paragraph",
    text: "I'm a lifelong learner with a degree in Aerospace Engineering from the University of Maryland, College Park. I love creating—whether it's games, short stories, art, or even this custom website.",
  },
  {
    type: "paragraph",
    text: "Everything on this website is open source and available on my <a href='https://github.com/ShaneBonkowski' target='_blank rel='noopener noreferrer'>GitHub</a>. Feel free to use my code as a starting point to create your own content.",
  },
  {
    type: "paragraph",
    text: "Shanes Games embodies the recreational side of me. If you'd like to learn more about my professional background, visit my <a href='https://www.linkedin.com/in/shanebonkowski/' target='_blank' rel='noopener noreferrer'>LinkedIn</a> profile. I'm always eager to collaborate, exchange ideas, and make new connections!",
  },
];

export default function Page() {
  return <PageContentLoader contentData={aboutData} id="about" />;
}
