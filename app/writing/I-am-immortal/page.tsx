import StoryContentLoader from "@/src/components/StoryContentLoader";
import { StoryMetadataProps } from "@/src/types/data-props";
import ResumeScrollProgress from "@/src/components/ResumeScrollProgress";
import StoryParagraphElement from "@/src/components/StoryParagraphElement";

const storyData: StoryMetadataProps = {
  title: "I am Immortal",
  subtitle: "Shane Bonkowski",
  date: "March 16, 2024",
  coverImageUrl: "/webps/writing/I-am-immortal.webp",
  coverImageWidth: 500,
  coverImageHeight: 422,
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
        url: `https://shanebonkowski.com${storyData.coverImageUrl}`,
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
    image: `https://shanebonkowski.com${storyData.coverImageUrl}`,
    imageAlt: "A short story by Shane Bonkowski.",
  },
};

export default function Page() {
  return (
    <>
      <ResumeScrollProgress pageName={storyData.title} threshold={200} />
      <StoryContentLoader {...storyData}>
        <StoryParagraphElement
          fontStyle="normal"
          textAlign="justify"
          isFirst={true}
        >
          If you ask me, I&apos;m at least 13.8 billion years old. Born in the
          aftermath of the Big Bang. My life began the same way it will end:
        </StoryParagraphElement>

        <StoryParagraphElement fontStyle="normal" textAlign="center">
          Scattered across Infinity.
        </StoryParagraphElement>

        <StoryParagraphElement fontStyle="normal" textAlign="justify">
          When I was less coalesced, I was a mess of bits and bobs, buzzing
          around the molten slurry that this explosion of existence left in its
          wake. It beckoned me, like a distant mirage amid the endless sea of
          sand in the Sahara. Or maybe the faint glow of the River Styx guiding
          this lost soul to paradise. And so, I followed it.
        </StoryParagraphElement>

        <StoryParagraphElement fontStyle="normal" textAlign="justify">
          Before long, I found myself engulfed in the beating heart of a Stellar
          Beast, forged by the deafening roar of infernos that burned with
          unimaginable heat all around me. It was deep in the core of these
          magnificent beasts who paint the cosmos in hues of blistering orange
          and scorching red that I began to coalesce.
        </StoryParagraphElement>

        <StoryParagraphElement fontStyle="normal" textAlign="justify">
          It&apos;s hard to piece together exactly how I got here, but somehow
          somewhere along the way I found myself here in this blue utopia.
          Amidst the delicate cosmic dance of this Solar System, heavenly bodies
          crashing together to the symphony of orderly chaos, here I lie among
          the rubble with the opportunity to bear witness to its greatness.
        </StoryParagraphElement>

        <StoryParagraphElement fontStyle="normal" textAlign="justify">
          In my short time here in Infinity, I have already done so much.
          I&apos;ve rained down from the heavens with the hellfire of molten
          rock. I&apos;ve raged with the great rivers, tearing rifts through
          continents. I&apos;ve breathed life into the atmosphere with my mighty
          lungs of creation. I&apos;ve played my part in this ensemble, and
          shaped this planet into what it is.
        </StoryParagraphElement>

        <StoryParagraphElement fontStyle="normal" textAlign="center">
          And so have you.
        </StoryParagraphElement>

        <StoryParagraphElement fontStyle="normal" textAlign="justify">
          I&apos;ve come to realize I abhor the word <em>Death</em>. Who are you
          to deny our greatness with that term? <em>Death</em>. You and I,
          we&apos;re the lucky ones. We lucky few, through sheer determination
          and the right string of collisions, find ourselves with the gift of{" "}
          <em>Life</em>. The most precious stage of all cosmic transformations.
          We get the opportunity to think, to speak, to write, to love deeply,
          to witness it all.
        </StoryParagraphElement>

        <StoryParagraphElement fontStyle="normal" textAlign="center">
          And as much as I hate to say it, to <em>die</em>.
        </StoryParagraphElement>

        <StoryParagraphElement fontStyle="normal" textAlign="justify">
          <em>Death</em> as I see it is not the end, but a new beginning. A
          chance to return to the order from which we were granted the
          opportunity for <em>life</em> in the first place. Maybe we will live
          again. This time a much smaller part of some much smaller,
          insignificant species. Or perhaps something far greater. All just a
          break for a weary traveler on their journey through the Infinity.
        </StoryParagraphElement>

        <StoryParagraphElement fontStyle="normal" textAlign="justify">
          I&apos;ve always found myself running towards something. Something
          growing infinitely further. And yet, just out of reach. Will I ever
          reach it? Will <em>we</em> ever reach it? I hope so. At least we have
          forever to find out.
        </StoryParagraphElement>

        <StoryParagraphElement
          fontStyle="normal"
          textAlign="center"
          isLast={true}
        >
          If you ask me, I am immortal and so are you.
        </StoryParagraphElement>
      </StoryContentLoader>
    </>
  );
}
