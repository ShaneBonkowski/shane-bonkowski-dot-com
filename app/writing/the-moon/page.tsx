import StoryContentLoader from "@/components/utils/StoryContentLoader";
import { theMoonData } from "@/data/writing/the-moon-data";
import ResumeScrollProgress from "@/components/utils/ResumeScrollProgress";
import Head from "next/head";

const storyData = theMoonData;

export default function TheMoon() {
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
