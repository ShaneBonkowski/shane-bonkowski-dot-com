import WrittenContentLoader from "@/src/components/WrittenContentLoader";
import { WrittenContentMetadataProps } from "@/src/types/data-props";
import ResumeScrollProgress from "@/src/components/ResumeScrollProgress";
import WrittenContentParagraphElement from "@/src/components/WrittenContentParagraphElement";
import WrittenContentParagraphGroup from "@/src/components/WrittenContentParagraphGroup";

const storyMetadata: WrittenContentMetadataProps = {
  title: "Wheel of Fortune",
  subtitle: "Shane Bonkowski",
  description: "A short story by Shane Bonkowski.",
  date: "February 10, 2026",
  coverImageUrl: "/webps/writing/wheel-of-fortune.webp",
  contentImageUrl: "/webps/writing/wheel-of-fortune.webp",
  contentImageWidth: 500,
  contentImageHeight: 422,
};

export const metadata = {
  title: storyMetadata.title,
  description: storyMetadata.description,
  openGraph: {
    title: storyMetadata.title,
    description: storyMetadata.description,
    url: "https://shanebonkowski.com",
    images: [
      {
        url: `https://shanebonkowski.com${storyMetadata.coverImageUrl}`,
        alt: storyMetadata.description,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@ShaneBonkowski",
    title: storyMetadata.title,
    description: storyMetadata.description,
    image: `https://shanebonkowski.com${storyMetadata.coverImageUrl}`,
    imageAlt: storyMetadata.description,
  },
};

export default function Page() {
  return (
    <>
      <ResumeScrollProgress pageName={storyMetadata.title} threshold={200} />
      <WrittenContentLoader {...storyMetadata}>
        <WrittenContentParagraphGroup>
          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            At the end of a long, mundane, tedious life of ups, downs, hope,
            happiness, sorrow, and regret, the man of fortune found himself
            slumped across his deathbed, looking back at his life to figure out
            exactly where it all went wrong. While he was not particularly
            extraordinary in any way, by no means was he an ordinary man. This
            was the man of fortune. The man who, in his prime, owned one of the
            largest industrial farms on the planet. The atrocities he oversaw on
            a daily basis would make the ordinary man sick to his stomach. Row
            after row of pigs, cows, and chickens crammed shoulder-to-shoulder
            in their prisons, bathing in their own filth and excrement,
            patiently waiting for their turn with the executioner. The fear and
            despair they must have felt. The horror of it all.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Slumped across that deathbed, the man of fortune fought until the
            bitter end, not because he wanted to live, but because he was too
            stubborn to die. At his hour of reckoning, with three long, heavy
            blinks, the universe around him gently faded to black, and the pain
            subsided. He rested in that darkness for an eternity. And it would
            have been an eternity and a day if not for the beam of light that
            ripped an opening through the midnight clouds above. From this
            opening emerged a massive golden disc with unintelligible
            hieroglyphs along its perimeter. The disc was escorted by a posse of
            winged humanoid figures who shared their faces with woodland
            critters. The bunnies and the birds and the fawns danced around the
            disc in laughter and play as it descended toward the cold, dark
            ground. And the fox gently rested, draped across the disc without a
            care in the world.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            As the disc kissed the ground, the man rose from what was his final
            resting place. All the critters who had previously paid no mind
            suddenly stopped their laughter and play to glare through him. Even
            the fox had risen from his careless perch to glare through the man.
            Fighting through the weight of their judgment, he approached. It was
            now evident that the floating hunk of gold was less a disc and more
            a wheel like that of a game show. He could just barely make out the
            strange markings along its perimeter. Some looked like the
            judgmental forest creatures that carefully watched his every move, a
            few like ordinary people, and even fewer like extraordinary people.
            And there was a fox.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            At this point, the man was trembling. Nervously, he opened his mouth
            and began to speak, but was immediately cut off by the fox, who made
            it very clear that this was not a negotiation. He didn&apos;t
            hesitate to tell the man just how lucky he was that they found him.
            With one spin of this wheel, he said, the man would live again. All
            he needed to do was give in and let fate choose his new form.
            Otherwise, he could retain his identity and return to his long,
            dark, eternal slumber for the rest of time.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Just as any of us would do if faced with such a dilemma, the man
            first hesitated, then deliberated, then ultimately made the
            not-so-reasonable decision: he would try his luck. And so, with a
            mighty yank, he heaved the wheel and watched it spin and spin and
            spin. It spun so many times that he lost count out there in
            eternity. When it finally began to slow down, equally anxious and
            excited, the man of fortune carefully watched the options tick by.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Farmer. Banker. Dog. Elephant. Deer. Politician. Rabbit.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            The sly fox smirked as the final option ticked by.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Pig.
          </WrittenContentParagraphElement>
        </WrittenContentParagraphGroup>
      </WrittenContentLoader>
    </>
  );
}
