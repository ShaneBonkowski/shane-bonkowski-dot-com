import StoryContentLoader from "@/components/utils/StoryContentLoader";
import { beforeTheWorldDriedUpData } from "@/data/writing/before-the-world-dried-up-data";
import ResumeScrollProgress from "@/components/utils/ResumeScrollProgress";
import Head from "next/head";

const storyData = beforeTheWorldDriedUpData;

export default function BeforeTheWorldDriedUp() {
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
