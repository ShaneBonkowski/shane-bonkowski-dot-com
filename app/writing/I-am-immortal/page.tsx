import StoryContentLoader from "@/src/components/StoryContentLoader";
import { StoryMetadataProps } from "@/src/types/data-props";
import ResumeScrollProgress from "@/src/components/ResumeScrollProgress";

const storyData: StoryMetadataProps = {
  title: "I am Immortal",
  subtitle: "Shane Bonkowski",
  date: "March 16, 2024",
  imageUrl: "/webps/writing/I-am-immortal.webp",
  imageWidth: 500,
  imageHeight: 422,
  body: [
    {
      content: `If you ask me, I’m at least 13.8 billion years old. Born in the aftermath of the Big Bang. My life began the same way it will end:`,
      fontStyle: "normal",
      textAlign: "justify",
    },
    {
      content: `Scattered across Infinity.`,
      fontStyle: "normal",
      textAlign: "center",
    },
    {
      content: `When I was less coalesced, I was a mess of bits and bobs, buzzing around the molten slurry that this explosion of existence left in its wake. It beckoned me, like a distant mirage amid the endless sea of sand in the Sahara. Or maybe the faint glow of the River Styx guiding this lost soul to paradise. And so, I followed it. 

Before long, I found myself engulfed in the beating heart of a Stellar Beast, forged by the deafening roar of infernos that burned with unimaginable heat all around me. It was deep in the core of these magnificent beasts who paint the cosmos in hues of blistering orange and scorching red that I began to coalesce.

It’s hard to piece together exactly how I got here, but somehow somewhere along the way I found myself here in this blue utopia. Amidst the delicate cosmic dance of this Solar System, heavenly bodies crashing together to the symphony of orderly chaos, here I lie among the rubble with the opportunity to bear witness to its greatness.

In my short time here in Infinity, I have already done so much. I’ve rained down from the heavens with the hellfire of molten rock. I’ve raged with the great rivers, tearing rifts through continents. I’ve breathed life into the atmosphere with my mighty lungs of creation. I’ve played my part in this ensemble, and shaped this planet into what it is.`,
      fontStyle: "normal",
      textAlign: "justify",
    },
    {
      content: `And so have you.`,
      fontStyle: "normal",
      textAlign: "center",
    },
    {
      content: `I’ve come to realize I abhor the word <em>Death</em>. Who are you to deny our greatness with that term? <em>Death</em>. You and I, we’re the lucky ones. We lucky few, through sheer determination and the right string of collisions, find ourselves with the gift of <em>Life</em>. The most precious stage of all cosmic transformations. We get the opportunity to think, to speak, to write, to love deeply, to witness it all.`,
      fontStyle: "normal",
      textAlign: "justify",
    },
    {
      content: `And as much as I hate to say it, to <em>die</em>.`,
      fontStyle: "normal",
      textAlign: "center",
    },
    {
      content: `<em>Death</em> as I see it is not the end, but a new beginning. A chance to return to the order from which we were granted the opportunity for <em>life</em> in the first place. Maybe we will live again. This time a much smaller part of some much smaller, insignificant species. Or perhaps something far greater. All just a break for a weary traveler on their journey through the Infinity.

I’ve always found myself running towards something. Something growing infinitely further. And yet, just out of reach. Will I ever reach it? Will <em>we</em> ever reach it? I hope so. At least we have forever to find out.`,
      fontStyle: "normal",
      textAlign: "justify",
    },
    {
      content: `If you ask me, I am immortal and so are you.`,
      fontStyle: "normal",
      textAlign: "center",
    },
  ],
};

export const metadata = {
  title: storyData.title,
  description: "A short story by Shane Bonkowski.",
  openGraph: {
    title: storyData.title,
    description: "A short story by Shane Bonkowski.",
    url: "https://shanebonkowski.com",
    images: [
      {
        url: `https://shanebonkowski.com${storyData.imageUrl}`,
        alt: "A short story by Shane Bonkowski.",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@ShaneBonkowski",
    title: storyData.title,
    description: "A short story by Shane Bonkowski.",
    image: `https://shanebonkowski.com${storyData.imageUrl}`,
    imageAlt: "A short story by Shane Bonkowski.",
  },
};

export default function Page() {
  return (
    <>
      <ResumeScrollProgress pageName={storyData.title} threshold={200} />
      <StoryContentLoader {...storyData} />
    </>
  );
}
