import WrittenContentLoader from "@/src/components/WrittenContentLoader";
import { WrittenContentMetadataProps } from "@/src/types/data-props";
import ResumeScrollProgress from "@/src/components/ResumeScrollProgress";
import WrittenContentParagraphElement from "@/src/components/WrittenContentParagraphElement";
import WrittenContentParagraphGroup from "@/src/components/WrittenContentParagraphGroup";

const storyData: WrittenContentMetadataProps = {
  title: "Before the World Dried Up",
  subtitle: "Shane Bonkowski",
  date: "June 20, 2024",
  coverImageUrl: "/webps/writing/before-the-world-dried-up.webp",
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
      <WrittenContentLoader {...storyData}>
        <WrittenContentParagraphGroup>
          <WrittenContentParagraphElement
            fontStyle="italic"
            textAlign="justify"
          >
            It was a year so far in the distant future that they decided to stop
            counting altogether. Whether they lost count or it simply
            didn&apos;t matter anymore remains a mystery. Two cosmic
            archaeologists, armed with the goal of tracking the origins of man,
            find themselves in a long-forgotten corner of some
            long-since-forgotten galaxy.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="italic"
            textAlign="justify"
          >
            How they ended up here was unclear, but the planet they sighted was
            scorched beyond recognition. It was a small, rocky planet orbiting a
            dim White Dwarf with just enough energy to glow, and nothing more.
            Clearly inhospitable, but perhaps one day, years and years ago, it
            would have been ripe for life. Or so the faint biosignatures
            radiating off of it led them to believe.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="italic"
            textAlign="justify"
          >
            They almost decided against landing altogether. Time and time again,
            they had stopped to visit a rocky planet with faint biosignatures to
            no avail. But today was different. Maybe it was because it had been
            many millions of miles since their last expedition, and they were
            growing restless. Or perhaps it was some sort of cosmic intervention
            pointing them to this lonely planet. Regardless, they landed in what
            appeared to be a long-dried riverbed, evidenced by the long,
            branching channels resembling the rivers from their home planet.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="italic"
            textAlign="justify"
          >
            Just when they thought they had explored enough to conclude this was
            in fact just another lifeless rocky planet, one of them had spotted
            something strange off in the distance: a lonely vessel in
            surprisingly good shape. This was especially peculiar, considering
            that everything else in this godforsaken wasteland had been scorched
            beyond recognition. Its pure white frame stood out against the burnt
            black landscape like a star in the empty night sky. Inside, they
            found a pristine skeleton clutching some sort of ancient recording
            device. They pressed play.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            They ask me why I plan on sticking around this place, why I
            haven&apos;t jumped ship with the rest of them. I let out a sigh as
            I gaze off across the lifeless desertscape from the helm of my
            beached vessel, its dry, relentless blight siphoning every ounce of
            life that crosses its path.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement fontStyle="normal" textAlign="center">
            Before me lay a boneyard.<br></br>
            Devoid of life.<br></br>
            Devoid of movement.<br></br>
            Devoid of soul.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            I remember a time when Angels graced this planet with their delicate
            songs. Who shimmered and flocked by the thousands in perfect harmony
            like the stars above. Lighting the way through the deepest, darkest
            depths no man had ever laid eyes on before.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement fontStyle="normal" textAlign="center">
            A time of mystery and wonder. <br></br>
            Sunken cities, lost treasures,<br></br>
            Fantastic Aquatic Beasts, just out of reach,<br></br>
            Waiting to be discovered.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            I remember a time when the mighty, unforgiving sea was King. A
            gentle beast of immense, unrelenting power that was not to be
            underestimated. Whose chaotic waves upheld order and prosperity on
            this planet.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement fontStyle="normal" textAlign="center">
            Gone are those days, they say.<br></br>
            Or so they say, at least.<br></br>
            For as long as I am here to tell the story,<br></br>
            Those days will live on.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Or maybe it was our lonely Lunar Guardian who was King. Who, with
            each pass, commanded the ravenous tides to devour the earth, waging
            war amidst the threshold between land and sea. Each pass signaling a
            new dawn. A new opportunity to begin again.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement fontStyle="normal" textAlign="center">
            Maybe I stick around to pay my respects.<br></br>
            To watch after the throne.<br></br>
            Maybe I stick around to admire it all.<br></br>
            To bask in the absurdity.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            As the years pass, my memory fades like the paint on this hull. I
            wipe a thick coating of dust from the windshield and ease into the
            captain&apos;s seat, trying to remind myself what it was like to
            cruise on this vessel. When we rode, not even the mighty sea could
            hold us back.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement fontStyle="normal" textAlign="center">
            No land in sight for miles.<br></br>
            Just me, this boat, and Infinity.<br></br>
            What I&apos;d do for one more ride.<br></br>
            One final trip to the edge of the world.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            They say that our tired Stellar Guardian doesn&apos;t have much time
            left. I wipe the sweat off my neck as its fiery fury beats down on
            me. I&apos;m seventy-three years old today. These days, it&apos;s
            starting to feel like neither do I.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement fontStyle="normal" textAlign="center">
            Here I sit in the wake of its death throes.<br></br>
            Watching as its hellish flames grow closer.<br></br>
            Ever larger.<br></br>
            Ever hotter.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Maybe I&apos;m old-fashioned, but I have no intentions of following
            the droves of those escaping. Those who plan to find a new Stellar
            Guardian, dooming their descendants to this same fate. No, I think
            I&apos;ll wait this one out as the universe intended.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement fontStyle="normal" textAlign="center">
            Sitting here on my long-since beached vessel.<br></br>
            Dreaming of the days that have long since passed,<br></br>
            What is yet to come for those who never knew<br></br>
            The days before the world dried up.
          </WrittenContentParagraphElement>
        </WrittenContentParagraphGroup>
      </WrittenContentLoader>
    </>
  );
}
