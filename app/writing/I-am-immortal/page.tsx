import WrittenContentLoader from "@/src/components/WrittenContentLoader";
import { WrittenContentMetadataProps } from "@/src/types/data-props";
import ResumeScrollProgress from "@/src/components/ResumeScrollProgress";
import WrittenContentParagraphElement from "@/src/components/WrittenContentParagraphElement";
import WrittenContentParagraphGroup from "@/src/components/WrittenContentParagraphGroup";

const storyData: WrittenContentMetadataProps = {
  title: "I am Immortal",
  subtitle: "Shane Bonkowski",
  description: "A short story by Shane Bonkowski.",
  date: "March 16, 2024",
  coverImageUrl: "/webps/writing/I-am-immortal.webp",
  contentImageUrl: "/webps/writing/I-am-immortal.webp",
  contentImageWidth: 500,
  contentImageHeight: 422,
};

export const metadata = {
  title: storyData.title,
  description: storyData.description,
  openGraph: {
    title: storyData.title,
    description: storyData.description,
    url: "https://shanebonkowski.com",
    images: [
      {
        url: `https://shanebonkowski.com${storyData.coverImageUrl}`,
        alt: storyData.description,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@ShaneBonkowski",
    title: storyData.title,
    description: storyData.description,
    image: `https://shanebonkowski.com${storyData.coverImageUrl}`,
    imageAlt: storyData.description,
  },
};

export default function Page() {
  return (
    <>
      <ResumeScrollProgress pageName={storyData.title} threshold={200} />
      <WrittenContentLoader {...storyData}>
        <WrittenContentParagraphGroup>
          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            If you ask me, I&apos;m at least 13.8 billion years old. Born in the
            aftermath of the Big Bang. My life began the same way it will end:
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement fontStyle="normal" textAlign="center">
            Scattered across Infinity.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            When I was less coalesced, I was a mess of bits and bobs, buzzing
            around the molten slurry that this explosion of existence left in
            its wake. It beckoned me, like a distant mirage amid the endless sea
            of sand in the Sahara. Or maybe like the faint glow of the River
            Styx guiding this lost soul to paradise. And so, I followed it.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Before long, I found myself engulfed in the beating heart of a
            Stellar Beast, forged by the deafening roar of infernos that burned
            with unimaginable heat all around me. It was deep in the core of
            these magnificent beasts who paint the cosmos in hues of blistering
            orange and scorching red that I began to coalesce.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            It&apos;s difficult to piece together exactly how I got here, but
            somehow, somewhere along the way, I found myself here in this blue
            utopia. Amidst the delicate cosmic dance of this Solar System,
            heavenly bodies crashing together to the symphony of orderly chaos,
            here I lie among the rubble with the opportunity to bear witness to
            its greatness.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            In my short time here in Infinity, I have already done so much.
            I&apos;ve rained down from the heavens with the hellfire of molten
            rock. I&apos;ve raged with the great rivers, tearing rifts through
            continents. I&apos;ve breathed life into the atmosphere with my
            mighty lungs of creation. I&apos;ve played my part in this ensemble
            and helped shape this planet.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement fontStyle="normal" textAlign="center">
            And so have you.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            I&apos;ve come to realize that I abhor the word <em>Death</em>. Who
            are you to deny our greatness with that term? <em>Death</em>. You
            and I, we&apos;re the lucky ones. We lucky few, through sheer
            determination and the right string of collisions, find ourselves
            with this beautiful gift. The most precious stage of all cosmic
            transformations. We get the opportunity to think, to speak, to
            write, to love deeply, to witness it all.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement fontStyle="normal" textAlign="center">
            And as much as I hate to say it, to die.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            <em>Death,</em> as I see it, is not the end, but a new beginning. A
            chance to return to the order from which we were granted this
            opportunity in the first place. Maybe we will live again. This time,
            a much smaller part of some much smaller, insignificant species. Or
            perhaps something far greater. All just a break for a weary traveler
            on their journey through the Infinity.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement fontStyle="normal" textAlign="center">
            If you ask me, I am immortal, and so are you.
          </WrittenContentParagraphElement>
        </WrittenContentParagraphGroup>
      </WrittenContentLoader>
    </>
  );
}
