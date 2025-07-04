import WrittenContentLoader from "@/src/components/WrittenContentLoader";
import { WrittenContentMetadataProps } from "@/src/types/data-props";
import ResumeScrollProgress from "@/src/components/ResumeScrollProgress";
import WrittenContentParagraphElement from "@/src/components/WrittenContentParagraphElement";
import WrittenContentParagraphGroup from "@/src/components/WrittenContentParagraphGroup";

const storyData: WrittenContentMetadataProps = {
  title: "My Final Thought",
  subtitle: "Shane Bonkowski",
  date: "December 8, 2024",
  coverImageUrl: "/webps/writing/my-final-thought.webp",
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
            fontStyle="normal"
            textAlign="justify"
          >
            As I sit here and watch the unforgiving grains of sand trickle down
            from my hourglass, there is nothing left to do but ponder.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            <em>Tick. Tick. Tick.</em>
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            I always figured I&apos;d be at peace when my time comes, but here I
            find myself restless and worried. Why couldn&apos;t I have just been
            hit by a bus? Something quick and painless. Those are the lucky
            ones. The ones who aren&apos;t trapped with this burden of
            frantically trying to make sense of it all at the end.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            I&apos;m sure the thought of what final words they will mutter
            crosses most people&apos;s minds when they find themselves in my
            situation. Maybe I&apos;ve grown cynical, but I&apos;ve lived enough
            to know that what we say is not always how we feel. As my clock
            creeps to midnight with my family by my side, will I be honest? Will
            I tell them how I truly feel? How afraid I am? Or will I try to
            ensure that their last memory of me is a good one?
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            I wonder what I&apos;ll be thinking about when that last grain of
            sand falls.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Is it better if it&apos;s a mundane thought? In another life, maybe
            I&apos;m thinking about what errands to run or what groceries to get
            when that bus hits me. Boring, yes, but at least it&apos;s not a sad
            thought or an awful thought. I try to rationalize it this way at
            least, but if I&apos;m being honest I&apos;m too selfish to want it
            to be a mundane thought. Let it be something grand.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Growing up hunting with my dad, I learned a lot about life and
            death. He used to say that it&apos;s the knowledge and fear of death
            that sets us apart as humans. When you shoot a deer, you&apos;d be
            surprised by how calm they are before they pass on. Sure, depending
            on how good of a shot you are, sometimes they violently flail.
            Almost as if their soul is desperately trying to escape their body
            before the gateway to the other side closes. It is the ugliest, most
            haunting sight imaginable. Yet somehow, a strange, almost serene
            sense of beauty lingers in their calmness.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            I wasn&apos;t always the best shot and for that I am remorseful.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            <em>Tick. Tick.</em>
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            I remember what it was like as a young child shooting one of my
            first deer. It was a cold autumn day, and we had already been in the
            treestand for hours. My dad used to wake me up well before the crack
            of dawn whenever we went hunting. By this point in the day, I would
            drift in and out of consciousness, catching up on the sleep I had
            lost. Somehow, he was always wide awake—a mystery to me, given how
            much rest he deserved.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            This was a man who carried the weight of the world on his shoulders:
            long, grueling days of manual labor and the demands of supporting a
            family. Yet something about those woods allowed his restless mind
            and weary body to find peace—a rare opportunity to clear the fog and
            think. It was in these quiet moments, perched high in the trees,
            that we shared some of our deepest conversations about life, the
            universe, and our place within it—whispering, of course, so the deer
            couldn&apos;t hear us.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            A gentle tap on my shoulder woke me from a light, dreamless nap. My
            dad pointed to a decent buck just behind us, and I instantly knew
            that this was the moment you do it all for. All the waiting, the
            preparing, and the early mornings that began in darkness. Slowly, I
            rose and turned toward the deer. My arms trembled, and my breath
            grew shallow and quick with a mixture of nerves and excitement that
            coursed through me.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            The long, cold barrel of the 12-gauge carefully stretched out as I
            centered my aim on its upper midsection. With a slow pull of the
            trigger, one ounce of death screamed from the barrel with a powerful
            crack that could be heard a mile away. The gun kicked back just as
            hard and bruised my shoulder. In an instant, death made contact, and
            the entire symphony of the forest drew to a close.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            There we watched the majestic beast flail in eerie silence. Only the
            rustling of leaves and snapping of branches could be heard. Perhaps
            he was overwhelmed by strange new thoughts and feelings, or perhaps
            his mind had found peace even as his body struggled to catch up.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Eventually, the flailing ceased, and a heavy stillness took over. I
            looked to my dad, and together we offered a quiet prayer for the
            animal, asking for a safe passage to the other side. We thanked it
            for the sustenance it would provide, a solemn exchange of life and
            death. At first gradually, and then all at once, the forest hummed
            its song again.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            <em>Tick.</em>
          </WrittenContentParagraphElement>
        </WrittenContentParagraphGroup>
      </WrittenContentLoader>
    </>
  );
}
