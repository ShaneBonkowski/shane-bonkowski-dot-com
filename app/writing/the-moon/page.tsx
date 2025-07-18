import WrittenContentLoader from "@/src/components/WrittenContentLoader";
import { WrittenContentMetadataProps } from "@/src/types/data-props";
import ResumeScrollProgress from "@/src/components/ResumeScrollProgress";
import WrittenContentParagraphElement from "@/src/components/WrittenContentParagraphElement";
import WrittenContentParagraphGroup from "@/src/components/WrittenContentParagraphGroup";

const storyData: WrittenContentMetadataProps = {
  title: "The Moon",
  subtitle: "Shane Bonkowski",
  date: "July 13, 2024",
  coverImageUrl: "/webps/writing/the-moon.webp",
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
            Step by step, I trudge on through the long night. My body aches and
            my bones tremble under the weight of her gaze, a constant reminder
            of my imprisonment. There is no backward, only forward. It&apos;s
            all I&apos;ve ever known.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            On the horizon, gently nestled between two colossal towers lay my
            captor. Ancient beasts of stone and mortar with no apparent entrance
            or exit. They look as if they have always existed&mdash;as if they
            will exist long after the universe lets out its last whimper and
            fades into the night.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="italic"
            textAlign="justify"
          >
            And so does she.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            My gaze lay trapped in her orbit. Her look of disappointment taunts
            me with silent judgment. No matter how hard I try I cannot look
            away. Nor can I remember how I got here, or what I seek, for that
            matter. At this point, I carry on to spite her.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            The road I travel is as lonely as it is unending, winding through
            barren hills and desolate valleys. The landscape stretches out in
            stark emptiness, with jagged rocks and twisted trees grasping at the
            empty sky for anything it has to offer. There are no signs of life
            along its path, no comforting sounds of nature. I am joined only by
            those who shimmer in the shadows. Manifestations of horror and evil,
            whispering and laughing. Those who I cannot directly observe, but
            whose presence haunts me. They laugh and laugh with awful sounds of
            metal creaking and whining. They whisper of my weakness. The things
            they would do to me if not for their ruler holding them back.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Pausing briefly to catch my breath and rest my tired limbs, I sit
            and ponder for a moment. Drowning out the voices surrounding me, I
            dwell on questions of existence and purpose. What wicked things must
            I have done in my past life to have deserved such cruel treatment?
            My introspection is short-lived, as the voices grow impossible to
            ignore any longer. They circle all around me with their silent
            threats, growing closer by the second. Everything in my being tells
            me to give in to these dark forces and let them devour me. Just
            before they have the chance to close in and snatch me away, I
            conjure up the strength to stand.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;Why do you do this to me?&quot; I shout into the void at my
            captor.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            I am reminded why I do not usually ask these questions aloud.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;The answer lies at the end of the road,&quot; the same
            response as always.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            And so, defeated as ever, I embark again. And with that, the shadows
            retreat to the safety of darkness. My body burns with fatigue and my
            heart burns with rage. I do not eat. I do not sleep. I only march.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            I&apos;ve been on this journey as long as I can remember, and no
            matter how far I push forward, the towers never seem to grow closer.
            They lurk on the horizon waiting and watching, their colossal forms
            permanently etched against the starless sky. Their surfaces, worn
            down by eons of existence, bear silent witness to the countless
            souls who have sought what lies at the end of the road.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            With each step, my silence grows deeper. Many, many paces come and
            go before I decide to speak again.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;Why won&apos;t you just let me die already?&quot; I mutter
            under my breath, pausing for a brief moment.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Before she gets the chance to reply, the ever-lurking shadows seize
            upon my moment of vulnerability. Their cold presence surrounds me,
            squeezing the air from my lungs. They won&apos;t be letting me go as
            easily this time.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Somehow I find a way to break my gaze and stare into the
            indiscriminate reflections on their mirror-finished skin. Their
            grotesque bodies contort and shimmer in the night, making it
            impossible to make out their form.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;Why do you torment me?&quot; I cry out.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Their response is immediate and violent. In an instant, I am
            enveloped by their darkness. Their forms twist and writhe around me,
            and I am lost in a sea of shadows. Their whispers invade my mind,
            drowning out my thoughts with promises of pain and despair. They
            pull at my limbs, their touch like ice, sending a chill through
            every fiber of my being.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            An eternity passes in a blur of torment. I am trapped in a
            never-ending cycle of agony, each moment more excruciating than the
            last. My body left battered, my spirit broken. Just when I think I
            cannot endure another second, I catch a glimpse of my captor. Her
            gaze still upon me, unyielding as ever.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;The answer lies at the end of the road,&quot; she speaks
            softly with a warm embrace.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            The shadows retreat, and I am left gasping for breath. My body
            trembles with immeasurable pain, my mind a broken shell, my soul
            burdened with despair.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            And there she lay gently suspended against the empty sky, her pale
            face etched with ancient wisdom and silent observation. Emitting a
            brilliant radiant light, illuminating the way for this weary
            traveler.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;Thank you,&quot; I whisper through the pain, left with no
            other option but to rise again and resume my unending march.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Another indeterminate amount of time passes. Maybe weeks. Maybe
            years. Maybe centuries. All this time I have not been able to shake
            that phrase from my mind, nor their shimmering image from my eyes.
            My bones ache and whine, my lungs fight for each whimpering breath,
            and my lips left sealed shut from lack of use. Somehow, I find it in
            me to force a sentence through.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;Are you God?&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;The answer lies at the end of the road,&quot; she states, sure
            as the unending night.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;What do you want from me?&quot; I plead.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;The answer lies at the end of the road.&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            As I march on, the whispers only grow louder. Silent screams
            surround me, begging me to give in. Begging for another soul to add
            to their collection. I have put up with this for so long, but I grow
            frail and weak. I do not know how much longer I can put up with this
            torment.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;Would you stop them again if they came for me?&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;The answer lies&mdash;&quot; she begins, but she cannot finish
            her sentence before my legs give out. My body contorts and spins,
            and the back of my head slams onto the paved path before me. My eyes
            still locked onto her like a magnet, my body twisted and knotted.
            Sparing no time, the shimmering shadows swoop in to envelop me. They
            creak with their awful grating sounds. Their whispers infest me like
            termites in an old rotting log. I am fully prepared to be ripped to
            pieces.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Just as they reach for me, I catch a glimpse of her in the
            reflection of their shining skin. Peering back at me with a face
            that has seen it all, she gently winks and nods her head.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;&mdash;at the end of the road,&quot; she concludes. Her look
            of disappointment now a soft smile.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            In an act of desperation and newfound courage, I lunge at one of the
            abominations, my gaze unbroken on her perfect image. And suddenly,
            in an awful cascade of broken glass, it explodes into a million
            pieces before me. And so too the other shadows begin to shatter one
            by one. I cannot confirm with my eyes, but my ears tell me that the
            towers followed suit.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Amidst the magnificent glitter of the rubble, there her image lay
            before me in perfect form, unbroken and unphased. I sit and admire
            her for a long while before dozing off for a long-needed rest.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            As I wake, sure enough there they are again. The two towers in all
            their colossal might. Only this time, a new entity nestled between
            them. Radiating a blinding light so intense that I have no choice
            but to cover it up with her image. Everything about this direction
            is the same as before, except now the long night has passed and she
            has grown a fiery mane around her.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            I approach the base of the towers as her fire grows fiercer. I am
            left with no choice but to close my eyes for protection against her
            blinding light. My strides grow short and careful. Step by step, I
            trudge on through the inferno. I stretch forward to test the path
            ahead only to realize there is no more ground beneath me. I open my
            eyes and let the white blinding light flood in.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            I glance at my mighty ruler for guidance. In her eternal wisdom, she
            looks at peace with my decision. I cast the shard and watch as it
            sparkles into infinity below me.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            With a deep breath, I step into the light as the curtains close
            behind me. With one last glimpse to take it all in, I watch as all
            that glitters among the rubble ascends to the sky above to keep her
            company through the long night. Until we meet again.
          </WrittenContentParagraphElement>
        </WrittenContentParagraphGroup>
      </WrittenContentLoader>
    </>
  );
}
