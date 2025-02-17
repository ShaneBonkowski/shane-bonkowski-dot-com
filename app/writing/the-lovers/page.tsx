import StoryContentLoader from "@/src/components/StoryContentLoader";
import { theLoversData } from "@/src/data/writing/the-lovers-data";
import ResumeScrollProgress from "@/src/components/ResumeScrollProgress";
import Head from "next/head";

const storyData = theLoversData;

export default function TheLovers() {
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
        <meta
          property="og:image"
          // Open graph needs absolute url!
          content={`https://shanebonkowski.com${storyData.imageUrl}`}
        />
        <meta property="og:image:alt" content={storyData.title} />
      </Head>
      <div>
        <ResumeScrollProgress pageName={storyData.title} threshold={200} />
        <StoryContentLoader {...storyData} />
      </div>
    </>
  );
}
