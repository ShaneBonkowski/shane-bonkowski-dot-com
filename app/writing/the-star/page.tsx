import StoryContentLoader from "@/components/utils/StoryContentLoader";
import { theStarData } from "@/data/writing/the-star-data";
import ResumeScrollProgress from "@/components/utils/ResumeScrollProgress";
import Head from "next/head";

const storyData = theStarData;

export default function TheStar() {
  return (
    <>
      <Head>
        <title>{storyData.title}</title>
        <meta name="description" content="A short story by Shane Bonkowski." />
        <meta property="og:title" content={storyData.title} />
        <meta
          property="og:description"
          content="A short story by Shane Bonkowski."
        />
        <meta property="og:image" content={storyData.imageUrl} />
        <meta property="og:image:alt" content={storyData.title} />
      </Head>
      <div>
        <ResumeScrollProgress pageName={storyData.title} threshold={200} />
        <StoryContentLoader {...storyData} />
      </div>
    </>
  );
}
