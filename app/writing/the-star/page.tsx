import WrittenContentLoader from "@/src/components/WrittenContentLoader";
import { WrittenContentMetadataProps } from "@/src/types/data-props";
import ResumeScrollProgress from "@/src/components/ResumeScrollProgress";
import WrittenContentParagraphElement from "@/src/components/WrittenContentParagraphElement";
import WrittenContentParagraphGroup from "@/src/components/WrittenContentParagraphGroup";

const storyData: WrittenContentMetadataProps = {
  title: "The Star",
  subtitle: "Shane Bonkowski",
  date: "August 12, 2024",
  coverImageUrl: "/webps/writing/the-star.webp",
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
            She was the healer. The silent observer. The glue that held it all
            together until the very end. Great fires would rage and she would
            drag the ocean down from the heavens. In times of famine, she would
            summon wilted crops from their eternal slumber and breathe life back
            into the fields. The ground would shake with thunderous roars, and
            she would rip the tectonic plates back together.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="italic"
            textAlign="justify"
          >
            I hopelessly watch as they depart by the thousands heading for the
            red planet. I am reminded of an ancient story the inhabitants used
            to pass on. Its name translates to &quot;The Woman Who Swallowed the
            Sky.&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Where they lived was a utopia. The kind you hear about in stories
            and can only see with your imagination. Dense green jungles framed
            every village, yielding the fertile fruit of prosperity. Each tree
            stood mightier and taller than a hundred men. A single harvest of
            sap could feed the village for a year. In every direction, vast
            oceans stretched across the perfect landscape as far as the eye
            could see. It was said that if you gazed into the depths of the
            Crystal Sea, you could see all that was and ever would be. And the
            creatures that roamed its waters were enormous, gentle beasts who
            lived in total harmony with the inhabitants.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            And they never grew bored of their simple, harmonious lives. And
            patiently, she always watched over from her palace among the clouds.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            When they weren&apos;t tending to the jungles or livestock with whom
            they peacefully coexisted, they would construct grand displays as a
            gesture to her. Mile-wide temples filled with shrines and sculptures
            in her image, where day and night they would go to worship her. A
            gratitude for the protection and tranquility that she granted them.
            Flattered, she would thank and remind them never to take more than
            what they needed, even if it was a gift to her.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            This went on for many years, and the gestures would only get more
            extravagant as time went on. Eventually, they set their sights on
            their magnum opus. It was a project that spanned many, many
            centuries. It began long before the technology existed in the first
            place to reach such heights&mdash;a project to <em>infinity</em>.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Their first attempt came at the cost of their precious jungles.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Year after year, the noble goddess watched in horror as the lush
            landscape gradually faded into extinction. With each fallen tree,
            she felt a part of herself wither away. Never did she stop warning
            her inhabitants of the repercussions of their actions.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            But the view from the tower was magnificent. It was built just at
            the edge of utopia, where the land met the Crystal Sea. It reached
            so high that the sea looked more like a mirror than glass from its
            peak. They used to say there were two towers: one to the top of the
            world, and the other to the edge. Still, there was a long way to go
            before they could achieve their goal of ripping through the heavens
            and dipping into infinity.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            One lonely moonless night, their goddess grew overwhelmed with a
            feeling of imminent danger. Wasting no time, she snuck into what
            remained of the jungle and dug up a seed for safekeeping. The next
            morning, before the sun even had a chance to grace the landscape
            with its warm embrace, the great fires erupted. It felt intentional,
            like a cruel lesson that Mother Nature was trying to teach. The
            flames raged like a blight that spread through the land,
            indiscriminately devouring anything they could sink their teeth
            into.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Tirelessly, she fought with everything she had to extinguish the
            beasts of destruction. Churning up the mighty Crystal Sea, she sent
            a storm of mile-high waves over the shore. One after another, the
            waves would crash against the impending wall of fire which would
            briefly settle, only to rise again angrier and stronger. With all
            her strength, she reached high into the sky above and ripped down
            clouds, wringing them out over the land. She fought with everything
            she had, but the blaze eventually grew too intense to resist. In a
            final act of desperation, she draped herself in as much of the
            heavens as she could bear and latched onto the Tower of Timber. The
            fires raged on, nipping at her heels, burning any bit of exposed
            skin they could find. Yet still, she endured. There she remained
            until the beasts ran out of fury.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            When the dust finally settled, the beautiful, lush green fields and
            jungles were reduced to a graveyard of charred skeletons.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            All they had left was their tower. And their wounded goddess, who
            slipped away before anyone could see her.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Sentiment for their goddess never fully recovered. Unaware of the
            unrelenting battle she fought through the night, &quot;How could she
            let this happen?&quot; they would whisper to each other.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;The goddess has a plan for all of us,&quot; her loyal
            supporters would object. &quot;Do not question her reasoning.&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Despite this major setback, the increasingly poor living conditions,
            and the growing resentment festering for their goddess, they picked
            up where they left off. This time, they would fortify the tower with
            stone to resist the flames.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Without their lush forests to bear fruit and sustenance, it
            wasn&apos;t long before they turned to eating the wildlife they
            coexisted with. The same wildlife they swore never to consume. Day
            in and day out she watched in disappointment as they carved every
            bit of stone their precious utopia had to offer. They would
            construct elaborate pulley and roller systems powered by thousands
            of men, dragging away chunks of utopia to feed the tower&apos;s
            unending hunger. Time previously spent tending to the jungles and
            wildlife was now spent excavating and consuming the wildlife. Her
            warnings fell on deaf ears as she watched the inhabitants devour
            every last animal in utopia, leaving only two behind, which she
            cared for in her palace among the clouds.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            But the tower was even more magnificent than before, its slate gray
            exterior sharply contrasting with the pale blue sky behind it. It
            reached so high into the heavens that the fluffy white clouds danced
            around it like cherubs. From the top, it was whispered they could
            ever so slightly make out the silhouette of her palace. Like an
            ancient beast that had always existed, it looked immortal.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Undying as the sun that would burn with unprecedented fury, so too
            the great fires would rage on. Yet, unburdened as the bedrock that
            held their quarries afloat, the stone exterior would resist. Despite
            the tower&apos;s resistance to the flames, she always intervened to
            protect her inhabitants. That was until the tremors came.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            After centuries of digging and quarrying, the natural order that
            held the ground intact had become irreparably damaged. Her poor
            utopia had grown epileptic. It would shake and shake uncontrollably,
            crying to its mother to stop the convulsions. When the ground storms
            would rumble, she would rush to the tectonic plates and with all her
            strength rip them back together. There she would endure for as long
            as it took waiting for the storm to pass, fighting the endless
            battle to hold the world intact.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            One day, the ground trembled with a vengeance. A spiteful, roaring
            tremor set forth with one goal: total devastation. It erupted like a
            supervolcano from every corner of utopia and spewed its hatred
            through its booming echos. She rushed to the nearest plates to the
            tower and squeezed with all her might. She fought that unending
            battle for days, her muscles tearing like fibers on a rope as she
            struggled to keep the world from tearing itself apart.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            In the end, she was not enough.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            With a loud creaking whine she watched as the Tower of Stone came
            tumbling back into the ground from which it came. An enormous pile
            of rubble and bodies filled the quarry from which it was birthed.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            When the other inhabitants arrived, they found their goddess alone,
            clutching the rubble at the tower&apos;s base. Her hands trembled,
            and her face was frozen with a look of shock. The sight was
            ominous&mdash;as if she had been caught in the act. She slipped away
            before they could question her.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            It didn&apos;t take long for them to jump to their own conclusions.
            To them, all the destruction&mdash;the fires, the tremors, the
            famine&mdash;was her doing, a punishment for their failure to heed
            her warnings.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            And they never forgave her.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Slowly, over the decades that ensued, they built themselves back up.
            They fished the Crystal Sea for food and scavenged amidst the rubble
            for materials to fortify and restore their colony. Each body they
            uncovered in the wreckage only fueled their hatred for their fallen
            goddess further. The old shrines and temples erected in her name
            were demolished and plundered for resources.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            As years passed, pressure on the leaders to act was growing
            insurmountable. Thousands marched, demanding the execution of their
            leaders for their failure to take action against the atrocities of
            their former goddess. All across utopia, violence escalated; anyone
            suspected of any association with her faced execution.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            With unrest spiraling out of control, the leaders hastily devised a
            plan no one anticipated. They would <em>rebuild</em> the
            tower&mdash;but this time with a far more sinister goal.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            In their many excursions across the Crystal Sea, the inhabitants had
            long ago discovered a strong, resilient metal and reserves of fuel
            they could use to power their forges. While they previously had
            little use for this material, they had recently devised an alloy
            that stood up remarkably well against the ground storms&mdash;a new
            blend for which they had their fallen zealots to thank.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            And so, they pumped the sea for everything it had to offer and
            watched as it regressed into an opaque sludge. The pumps endlessly
            churned and spewed dark toxic clouds into the air. The forges raged
            with the beasts of destruction, and the heat only grew harsher.
            Despite their deep hatred for her, she still warned them. Some
            things are beyond even her control, she would tell them. The natural
            order is not to be tampered with. These well-intentioned warnings
            only angered them more. &quot;Your threats don&apos;t scare
            us!&quot; they would scream back up to her.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            With each trip around their Stellar Guardian, it seemed to grow
            closer and closer, hotter and hotter. Helplessly, she watched her
            inhabitants sit idly by as thousand-year storms became ten-year
            storms, ten-year storms became five-year storms, and five-year
            storms became one-year storms&mdash;architects of their own
            destruction. When the heat grew too much to bear, she watched what
            was left of their once beautiful sea evaporate into the cold, dark
            expanse above.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            She took one final scoop with her mighty glass before the sea
            vanished into oblivion.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            But the Tower of Metal was even more magnificent than its
            predecessor. It was a glittering, shiny chrome that could not be
            directly observed in the daylight. It looked biblical, like how
            angels should look. It was so tall and imposing that it seemed to
            curve in on itself. As the hellfire seared the ground it stood on,
            it remained unburdened and unscathed. Not even the mighty tremors
            that rattled within the core could shake this chrome portal to the
            heavens.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Each day, the tower grew closer to her palace and the pale white
            clouds that framed it slowly faded to a repulsive hue. They had a
            thick, blinding mirror-finished yellow that reflected light in all
            directions. She was growing very sick, bedridden most days with a
            foul cough she could not shake. Her lungs would fight for any bit of
            oxygen they could find among the poison.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            The fires continued to burn, the ground shook with force and
            purpose, and the tower endured, growing ever closer. Just as they
            could see the entrance to the palace from atop their Tower of Metal,
            so came another thousand-year storm. This was not a typical
            thousand-year storm, however. This one was fueled with the venom and
            hatred from the tainted clouds above. The inhabitants watched in
            horror as the yellow drops of acid burned holes through the metal
            exterior of their tower. The storm was as vicious as it was
            unending. Like the inhabitants from within its walls, the tower
            screamed in agony as its flesh melted away. Those who could still
            walk cried for help as they evacuated in droves through the tower.
            It was so tall at this point, that a trip to the bottom would take
            days. For some, it was quicker and less painful to jump.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Then came the lightning screaming from the clouds above, striking
            the metal surface like it was drawn to it. Each strike would bring
            the passion of their Stellar Guardian to the night sky for a brief
            moment. The electricity would course through the structure like the
            rivers that once carved through their utopia. Anything that stood in
            its path would burn and seize with unimaginable pain. The jolts
            would stop their hearts, only to start them back up again with
            ensuing pulses. A never-ending cycle of life and death. The torture
            of thinking one had finally escaped the agony only to be brought
            back just before they reached their peace.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            She could not stand to watch them suffer any longer. With the little
            strength she had left, she rose from her resting location. Her lungs
            were tight and overinflated, like balloons ready to burst. She
            dragged herself to the courtyard and carefully exhaled, briefly
            expelling the poison from deep within her lungs. And with a deep,
            wheezing breath she drew in with every fiber of her being. The
            clouds whirled like the end of days and spiraled on their way
            through her gasping breath like tornados. The lightning zapped to
            try to stave her off but she resisted. Her skin burned as the acid
            from the clouds fell upon her. She heaved for an eternity.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Eventually, devoid of sufficient clouds to keep afloat, her palace
            came crashing down onto the creaking Tower of Metal below. Still,
            she continued to heave for an eternity longer.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            When the storm finally passed, so too did the faint blue backdrop,
            all the poison, and all the other innocent clouds that framed the
            sky. All that was left was a stark, empty black backdrop. Somehow,
            with a deep, prolonged inhale, she achieved the impossible.
            <em> She swallowed the sky</em>.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            The inhabitants gathered themselves and made what repairs they could
            before celebrating their apparent victory. To them, they had bravely
            withstood her relentless onslaught. Nothing she could throw at them
            could stand a chance against their Tower of Metal. Not the poison,
            not the lightning, not the tornados. More determined than ever, they
            marched by the thousands through the ruins of the palace that once
            rested among the clouds. Fully prepared to exact their vengeance,
            they forced themselves through her living quarters only to find her
            on her deathbed. Beside her, the two livestock stood as silent
            companions, comforting her on her way to the other side. Clutching
            her glass of water and the seed in either hand, she softly asked for
            one final wish.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="italic"
            textAlign="justify"
          >
            No one knows for sure what her final wish was, or whether the
            inhabitants even gave her the chance to fulfill it.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="italic"
            textAlign="justify"
          >
            I like to believe that, blessed with the opportunity to begin anew,
            she musters the little strength she has left and travels to the
            rocky shores of the twin sister planet with her two companions. She
            walks for a while along the bone-dry landscape in silence.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="italic"
            textAlign="justify"
          >
            Eventually, she kneels at the edge of a dried lava bed and gently
            empties her glass. Before her eyes, she watches the ensuing flood
            wash over the desolate rocky planet, transforming every
            far-stretching crevice and valley into mighty raging rivers. Armed
            with the seed of life, she digs a small hole and nestles it in,
            taking a small scoop of the raging river with her cupped hands and
            drizzling over the soil. With a sigh, she takes it all in one final
            time before she sees herself off to face her fate, bidding her
            companions farewell.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="italic"
            textAlign="justify"
          >
            It is said if you gaze above in the night sky you can still see her
            forgotten kingdom on the Morning Star glowing with a peculiar
            blinding light so intense that it outshines all its neighboring
            stars and wanderers.
          </WrittenContentParagraphElement>
        </WrittenContentParagraphGroup>
      </WrittenContentLoader>
    </>
  );
}
