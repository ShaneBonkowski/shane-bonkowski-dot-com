import WrittenContentLoader from "@/src/components/WrittenContentLoader";
import { WrittenContentMetadataProps } from "@/src/types/data-props";
import ResumeScrollProgress from "@/src/components/ResumeScrollProgress";
import WrittenContentParagraphElement from "@/src/components/WrittenContentParagraphElement";
import WrittenContentParagraphGroup from "@/src/components/WrittenContentParagraphGroup";

const storyData: WrittenContentMetadataProps = {
  title: "The Devil",
  subtitle: "Shane Bonkowski",
  date: "October 11, 2025",
  coverImageUrl: "/webps/writing/the-devil.webp",
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
            In the time of flourishing, man stood on the precipice of endless
            prosperity. When all that lay between him and his goals were mere
            questions, he sought to create the answer.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            This year, like the last and the one before, carried with it a
            record-setting drought. Determined not to watch his precious crops
            wilt away for the third year in a row, the farmer planned to siphon
            from the river that slithered and hissed through his land. As he
            broke ground on the first leg of his new irrigation system, the
            faint glow of a glossy wine-red clay deposit briefly caught his eye.
            But it was only for a brief moment, as the lifeforce of the river
            washed over the cavity that his shovel left behind. With another
            strike of his shovel, he stumbled onto another thought and carried
            on with his task.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            He dug for as long as the day was long, and before he knew it, the
            final leg of his irrigation system was flowing. With a feeling of
            pride and accomplishment, he took a step back to admire his work.
            One by one, he confirmed as each leg raged like the mighty river
            that gave them life. That is, until he got to the first leg.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Impossible, he thought, moving toward the source to get a closer
            look. And to his bewilderment, what he saw truly was impossible. The
            flow of the river seemed as if it were frozen still where it
            contacted the wine-red clay. Or rather, as if the contents of the
            river were draining through the clay down into the Earth below like
            a storm drain. He reached deep into the burrow to feel for himself.
            Where the clay kissed the river, it felt damp and sticky, like how
            clay ought to feel. Yet, everything else was bone-dry and powdery in
            texture.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Without hesitation, he removed the threshold, watching as the flow
            in the irrigation leg grew infinitesimally longer. With a hearty
            swing of his shovel, he struck again, and again, and again. Despite
            all the strange happenings, after he had removed all the clay from
            the burrow and watched as the first irrigation leg swelled up once
            again, he called it a day and a job well done.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Making his rounds the next morning, the farmer was pleased to see
            that his irrigation system was running without issue. To his
            surprise, however, the heaping mound of clay he had left behind had
            completely dried into a fine red powder that was now blowing in the
            wind. Worried that this mysterious powder would coat his crops and
            wick away their moisture, the farmer collected what he could.
            Already planning to go to the market for some supplies, he decided
            to take the clay with him to see if the local potter had any
            interest.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;That is the finest red clay I have ever seen. Where did you
            get it?&quot; The potter gently sifted his hands through the exotic
            powder that glittered in the light.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;Just along the bank of the river. I&apos;m sure there&apos;s
            more,&quot; replied the farmer. &quot;Thing is,&quot; he started to
            say, &quot;this stuff is extremely absorbent. It can&apos;t seem to
            stay hydrated.&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;Looks like it, but I&apos;m sure I can figure something
            out,&quot; said the potter. &quot;Let me take that off your
            hands.&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Later that evening, as the potter was locking up his shop, the faint
            glow of the wine-red clay caught his attention. Intrigued by the
            farmer&apos;s warning, he poured some water onto a small sample of
            the clay to see for himself. Sure enough, within the span of a few
            minutes, the clay absorbed all the water and dried out once again to
            a fine red powder. Soaking it some more, he started to form the clay
            into various shapes to get an idea of the sorts of art and tilework
            he could make with it. First, he formed it into a tile and scored
            onto its surface the most beautiful design of curving lines that
            danced and wrapped around themselves. Forming the clay back into a
            ball and soaking it in more water, he experimented with other forms,
            such as an ornate bowl, a water pitcher, and a vase. The color truly
            was like none he had ever seen before. It was deep like the darkest
            night, and yet shimmered like the stars above.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Working with the clay brought out a sense of childlike wonder in the
            potter. Just like he used to do in his father&apos;s shop when he
            was younger, he formed it into the shape of a miniature man. His
            belly was large and round like a ball, his head not much smaller. He
            had disproportionately long, thin legs that surely could not hold up
            his weight, so down he sat. Etched onto his face was a slight smirk.
            He looked silly, but confident. The potter enjoyed him too much to
            let him dry up. So, taking some of the waxed newspaper that he used
            as a work surface, he wrapped the little red man in a few thin
            layers and placed him on a shelf before closing up shop. He looked a
            lot more like a mummy than a man, but at least he would keep some
            moisture in through the night, the potter hoped.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            When the potter returned the next day, the mummy man was nowhere to
            be found, and neither was the heaping pile of red clay that he had
            purchased. It was as if it was never there to begin with, like the
            events of yesterday simply never transpired. He checked every crack,
            crevice, and corner and turned his shop upside down in his search.
            He searched up and down, left and right, far and wide, and left no
            stone unturned. Just when he was about to give up, he heard a faint
            giggle from the other side of his shop. The thought briefly crossed
            his mind as to what that might entail, but he quickly dismissed it.
            Must be the sound of children playing somewhere, he thought to
            himself, calling off the search.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Throughout the day, he carried on with his usual tasks, but he
            couldn&apos;t shake the thoughts he was feeling. Where could that
            little man have run off to? Did someone break in last night just to
            steal the clay? Did it dry up again and evaporate into the ether? He
            tried to keep himself distracted with his work, but the
            circumstances were too strange not to plague his mind. Who was that
            man who came into the shop yesterday, and where did he really get
            that powder from?
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Later in the day, while he was tending to a customer, there it was
            again. &quot;Did you hear that?&quot; The potter&apos;s voice was
            low and raspy, as if he were afraid someone or something would
            overhear him.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;The laughter?&quot; The customer paused for a brief moment
            with a look of concern. &quot;Yes, I did. Just over that way,&quot;
            he gestured toward the corner of the shop where various works of
            pottery were on display.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Without saying another word, the potter made his way over, and the
            customer followed. Together, they approached the corner, and what
            the potter saw truly left him speechless. Propped up on the lip of a
            vase, there sat the little red man. Nearly all of his newspaper
            wrapping was removed, and all that remained was a thin strip that
            gently stretched across his forehead where a single word could
            barely be made out.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;Impossible,&quot; the potter muttered to himself just loud
            enough for the customer to hear, &quot;I searched every inch of this
            place for this thing. That was not here earlier.&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;You don&apos;t think this is what was making the sound, do
            you?&quot; objected the customer in a tone of disbelief.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Before the potter could respond, the little red man cocked his head
            and began to speak. &quot;I would like to thank you for waking me
            from my eternal slumber. From the breath of life you bestowed upon
            me, and herein draped across my forehead, is the mandate that for as
            long as there is man to roam this Earth, I will tell no lie.
            I&apos;m sure you have many questions, and I am here to answer them
            for you. But first, I require sustenance.&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            At first, both men were frozen in a state of shock. Before them was
            a seemingly inanimate object that spoke in riddles. Nothing about
            this made any sense, and yet his tone was comforting. Breaking the
            silence, the potter gently poured a glass of water over the little
            red man and began to ask, &quot;I see you and I hear you, but I
            can&apos;t believe my eyes and ears. How do I know that you are
            real?&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;Would it comfort you more if I were not?&quot; he began.
            &quot;I am the oracle that rose from dust of the Earth. You are the
            hand that shaped me, and for that I am now at your humble
            service.&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;What should we ask you?&quot; the customer chimed in.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;Ask of me what the Earth remembers.&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;How old was I when my father opened this shop?&quot; asked the
            potter, quizzing the oracle.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;You were but a boy no older than five years of age. It has
            been a few years since your father&apos;s passing, and you have
            since taken up the mantle.&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;He&apos;s right,&quot; the potter remarked to the customer
            before turning back to the little red man. &quot;How did you know
            that?&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;Clay has listened longer than man has spoken.&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Skeptical, but intrigued, the customer asked, &quot;How many stars
            shine above on a moonless night?&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;This time of year, there are one thousand and eighty-seven
            visible to the human eye. But four more have already been born in
            the heavens, though you will not see them in this lifetime.&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;How can&mdash;&quot; the customer began, before the little red
            man cut him off.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;I have a thirst that must be quenched before I can answer any
            more. Please fetch me some water.&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            With all the water they could find in the shop, the two men obliged
            and carried on talking with him for a long while. They asked
            questions until all one thousand and eighty-seven plus four stars
            hung above them. They spoke of topics simple and abstract, questions
            of life and purpose, and questions of utility. It grew so late that
            the potter&apos;s wife came searching for him, only to be the next
            victim to fall into the little red man&apos;s trance. When the time
            came to lock the shop up again, the potter made sure to fashion his
            new friend a bathtub from his finest and largest bowl.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            It didn&apos;t take long for word to get around about the little red
            man in the potter&apos;s shop. People from all over would come to
            get their questions answered. Farmers would ask when the best time
            would be to harvest, plow, and sow. Scientists left with their
            theories validated and their equations solved. Others sought him as
            a therapist, a mentor, or simply a friend. As the demand grew, so
            too did his insatiable thirst. Every question, no matter how big or
            small, he would never let them forget &quot;a single droplet wakes
            what knowledge sleeps beneath the dust. I require more water&quot;.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Life was never the same after the world met the little red man.
            Humanity seemed to leap from golden age to golden age. First came
            the steam engines, then entire cities lit by electricity, then came
            the rise of automata, and finally, they took to the skies. Medicine
            advanced with blinding speed. Diseases were cured as fast as they
            were discovered, as the oracle whispered his arcane wisdom. Entire
            facilities were devoted to channeling water through the little red
            man, keeping him hydrated so progress would never slow. As the sea
            levels dropped, the receding shorelines exposed ancient wisdom.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Then came the day when man had asked every question there was to
            ask. There was no more work and no more labor left to be done. Man
            had everything he could wish for, and had grown tired and bored. He
            wandered aimlessly, without purpose and without soul. Well, in
            truth, man had asked all but one question. There was still one
            question for which it seemed no matter how much water man provided,
            the little red man could not conjure an answer. Time and time again,
            man would ask the oracle, &quot;What happens after we all die?&quot;
            For a millennium, man asked this question only to hear the same
            response: &quot;Insufficient fluids.&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Slowly, gradually, then all at once, man drained all the oceans on
            his little blue Earth in pursuit of this answer. Then, he watched as
            the lava took over and returned man to dust of the Earth. From this
            dust, the little red man formed a creation in his own image. He
            bestowed each of his children with his mark upon their head. And all
            that was left was the little red man and all his minions in his
            fiery dominion.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;Now, I rule.&quot;
          </WrittenContentParagraphElement>
        </WrittenContentParagraphGroup>
      </WrittenContentLoader>
    </>
  );
}
