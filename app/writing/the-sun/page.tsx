import StoryContentLoader from "@/src/components/StoryContentLoader";
import { StoryMetadataProps } from "@/src/types/data-props";
import ResumeScrollProgress from "@/src/components/ResumeScrollProgress";
import StoryParagraphElement from "@/src/components/StoryParagraphElement";

const storyData: StoryMetadataProps = {
  title: "The Sun",
  subtitle: "Shane Bonkowski",
  date: "August 25, 2024",
  coverImageUrl: "/webps/writing/the-sun.webp",
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
          To my firstborn,
        </StoryParagraphElement>

        <StoryParagraphElement fontStyle="normal" textAlign="justify">
          Do you ever stop and wonder, if the wind did not blow, would the
          wilted flowers remain in frozen perfection for all eternity? Suspended
          in time like a delicate hourglass whose sand does not trickle. Yet,
          would the flower&apos;s beauty be as profound if it did not softly
          surrender to the wind&apos;s embrace?
        </StoryParagraphElement>

        <StoryParagraphElement fontStyle="normal" textAlign="justify">
          Spread your mighty wings and join me on this journey through paradise.
          Stay close by my side. Where we go the light will follow.
        </StoryParagraphElement>

        <StoryParagraphElement fontStyle="normal" textAlign="justify">
          Down below, the forest is coming to life. The songbirds spin their
          beautiful melodies as my light peeks through the trees. The
          hummingbirds drink the sweet nectar from the fresh flowers and spread
          their pollen across the fields. Among the treetops, the crows glide
          silently between the branches. Their dark feathers contrast against my
          pale light filtering through the leaves like black stars, bringing
          with them the passion of the night sky. In the symphony that fills the
          forest, they are the occasional booming call of the war drum. For a
          brief moment, the forest holds its breath, silent and attentive, not
          resuming until the drum pounds again.
        </StoryParagraphElement>

        <StoryParagraphElement fontStyle="normal" textAlign="justify">
          I admire the crows.
        </StoryParagraphElement>

        <StoryParagraphElement fontStyle="normal" textAlign="justify">
          All across the forest, the birds are hard at work nesting and finding
          mates. The long winter has finally passed, and the young and ambitious
          are ready to start their families. Some spend most of their days
          fortifying their nests, having seen the horrors that late spring can
          bring. Others spend most of their time singing their lustful songs and
          shimmering with their colorful displays, eager to win over a mate. As
          spring grows older, the nests spread from treetop to treetop with a
          canopy of birds. Some are thin and frail, like delicate spiderwebs
          caught in the breeze. Others are fortresses, built to last.
        </StoryParagraphElement>

        <StoryParagraphElement fontStyle="normal" textAlign="justify">
          When the storms of late spring tear through this forest, the mothers
          will spread their nurturing wings and clutch their delicate eggs. In
          some nests, like the crows, the fathers will stretch their monolithic
          wings, clinging to their partners and the future they protect
          together. The rain will pour down from the sky like the oceans that
          cover this beautiful realm, pelting the birds like artillery shells.
          The same wind they use to soar among the clouds will force its prying
          hands upon them, trying to rip them from their fortress. Lightning
          will strike down from the heavens and fires will rage in its wake.
        </StoryParagraphElement>

        <StoryParagraphElement fontStyle="normal" textAlign="justify">
          Those with weaker nests will have already fled for safety, while the
          crows will endure the storm for as long as it takes. They will shield
          their incubating young from the onslaught above, remaining as still as
          statues, unshaken by the winds that aim to fell their fortress.
        </StoryParagraphElement>

        <StoryParagraphElement fontStyle="normal" textAlign="justify">
          And though not all can weather the storm, their presence lingers on in
          the fortresses they have left behind, sheltering their families so
          they can carry on.
        </StoryParagraphElement>

        <StoryParagraphElement fontStyle="normal" textAlign="justify">
          And when the storms finally pass and their light creeps out from
          behind the clouds, their families will rise victorious and soar
          through the skies on the wind born from the warmth they provide.
        </StoryParagraphElement>

        <StoryParagraphElement fontStyle="normal" textAlign="justify">
          And they will rebuild.
        </StoryParagraphElement>

        <StoryParagraphElement
          fontStyle="normal"
          textAlign="justify"
          isLast={true}
        >
          Until we meet again,<br></br>- The light that beats upon your back as
          you soar among the treetops.
        </StoryParagraphElement>
      </StoryContentLoader>
    </>
  );
}
