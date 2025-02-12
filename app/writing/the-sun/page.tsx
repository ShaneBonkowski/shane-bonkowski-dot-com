import StoryContentLoader from "@/src/components/StoryContentLoader";
import { theSunData } from "@/src/data/writing/the-sun-data";
import ResumeScrollProgress from "@/src/components/ResumeScrollProgress";
import Head from "next/head";

const storyData = theSunData;

export default function TheSun() {
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
