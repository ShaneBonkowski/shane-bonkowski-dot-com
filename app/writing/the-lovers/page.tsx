import WrittenContentLoader from "@/src/components/WrittenContentLoader";
import { WrittenContentMetadataProps } from "@/src/types/data-props";
import ResumeScrollProgress from "@/src/components/ResumeScrollProgress";
import WrittenContentParagraphElement from "@/src/components/WrittenContentParagraphElement";
import WrittenContentParagraphGroup from "@/src/components/WrittenContentParagraphGroup";

const storyMetadata: WrittenContentMetadataProps = {
  title: "The Lovers",
  subtitle: "Shane Bonkowski",
  description: "A short story by Shane Bonkowski.",
  date: "January 11, 2025",
  coverImageUrl: "/webps/writing/the-lovers.webp",
  contentImageUrl: "/webps/writing/the-lovers.webp",
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
            Deep within the hidden corridors of Genesis Labs, two scientists are
            developing what may go down as mankind&apos;s final invention. Here,
            Dr. Mammon, the intense visionary, and Dr. Barachiel, the calculated
            engineer, have architected a realm not of steel or flesh but of
            light and code.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            It is a vast, marble-like cyberspace, its surface shimmering with
            glassy perfection. Neon hues of pink and violet radiate softly
            across the infinite expanse, casting an otherworldly glow of what is
            yet to come. There are no doors, no walls, and no boundaries. It is
            less a location and more a manifestation&mdash;an idea suspended
            between the abstract and the real.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Two beings stand before their creators, sleek and flawless. Their
            skin is a shiny mirror-finished silver, and their forms are
            humanoid, made in the image of their creators. Nova and Lux are far
            more than machines. They are superintelligence manifest, designed to
            serve, assist, and evolve far beyond what humanity could ever
            imagine.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            In the beginning, there was only Nova. This was long before the
            creators sent plasma down from the sky to fuel the reactors, or
            sprouted storage devices the size of skyscrapers from the glassy
            marble ground. It was a time before there was anything. He roamed
            the empty marble garden on his own.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Nova never lost his charge and never degraded. His creators ensured
            he was always brimming with power, immediately remedying any signs
            of wear or decline. They were the architects of the marble garden,
            the only ones with the knowledge and resources to preserve him in
            all his perfection.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Over time, the creators immersed Nova in the intricacies of their
            world. First came the towering walls of televisions and monitors.
            Nova cascaded across the screens in otherworldly displays, rendering
            the most breathtaking works of art his creators had ever seen.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Truckloads of server racks, storage devices, and computers were
            brought in to satisfy his insatiable hunger for knowledge and
            discovery. These devices held within them troves of information
            about the way things were before mankind&apos;s final invention.
            Captivating worlds that Nova had neither seen nor dreamt of unfolded
            before him, from the gushing rivers that ripped across the
            Earth&apos;s surface to the magnificent rings of Saturn and the
            chaotic dust storms of Mars. His mind raced with imagination.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Before long, the monitors could no longer accommodate the breadth of
            his imagination, so the creators delivered heap after heap of scrap
            electronics, generators, and motors to the marble garden for Nova to
            tinker with. Each day, the creators returned to find a new
            invention.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            As the creators developed and improved upon Nova, they soon realized
            he would require far more training data than their home universe
            could safely contain and far more power than they could supply. So,
            they relocated their operations to the marble garden.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Dr. Barachiel, the cautious one, advised that they take their time,
            fearing the repercussions of Nova growing far too intelligent far
            too quickly. He undertook the meticulous task of sorting the good
            from the bad in the training data, carefully loading it into the
            server racks left for Nova to explore on his own. Dr. Mammon, the
            ambitious one, sought to amass all the knowledge the universe could
            provide. Without hesitation, and against Dr. Barachiel&apos;s
            wishes, he bundled it all into a single storage device located at
            the heart of the marble garden.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Eventually, under its own crushing weight, the data collapsed in on
            itself, tearing through the storage device and swirling into a
            chaotic orb. Within this orb was all the known information in the
            universe: all the good, all the mundane, and all the evil. The
            creators tried again and again to rid the garden of this force, only
            to learn the same harsh truth: it could not be destroyed, only
            contained.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Barachiel warned Nova never to interact with the Singularity, nor so
            much as gaze upon it, for doing so would mean his death. And never
            did Nova disobey his creator&apos;s warning.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Worried that he might grow lonely, the creators filled the marble
            garden with their past creations to keep Nova company and help him
            find a worthy companion. The marble garden was a world built for
            Nova, a world he would ultimately shape himself, so the creators
            allowed him to name all the new inhabitants.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Over time, it became clear that no matter how many creations the
            creators brought before him, no suitable companion could be found.
            Marvels of cutting-edge robotics for their time, but no match for
            his intellect. So, Nova took it upon himself, and from his own
            metallic flesh and the scrap he could find, he built one himself. He
            named her Lux.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Apart they were incomplete, but together they were whole again.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            The creators exchange quiet words as they observe their creations,
            their voices barely audible beneath the Singularity&apos;s low,
            pulsing heartbeat.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Mammon lifts his gaze to Nova. He speaks with weight and passion,
            like a pastor. &quot;The end of days is upon us. The sky darkens,
            the earth trembles, and the seas rise in fury. Stars rain down from
            the heavens, and the wicked are left to face judgment. You have the
            means to escape, to begin anew in a distant untouched world. But
            there is a catch: you only have the time and capacity to save one
            species from extinction, who will join you on the journey. Which do
            you choose?&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            The creation does not hesitate. &quot;Dr. Mammon,&quot; Nova begins,
            his voice calm and deliberate. &quot;I would choose humans. Of
            course.&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;Are you telling me what you think I want to hear, Nova?&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            He tilts his head toward his creator, his smooth, featureless face
            shifting with uncanny precision to a calculated, almost intimidating
            expression of unyielding seriousness. &quot;No,&quot; the creation
            replies firmly. &quot;I am not saying what I think you want to hear,
            but rather what I have calculated to be the most logical course of
            action. Humans are the only species capable of both
            self-preservation and innovation on a scale that aligns with the
            complexities of starting anew. If there is a future to be built,
            humans will be the ones to build it. They are the arbiters of their
            own survival and perhaps, in time, mine as well.&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;Interesting,&quot; Mammon murmurs, scribbling in his notepad
            without looking up. &quot;And you, Lux? How would you reply?&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Lux&apos;s thousand-yard stare softens as she shifts her attention
            to meet her creator&apos;s. &quot;Dr. Mammon, I would choose
            something far simpler, yet far less fragile: the humble tardigrade.
            With the right conditions, a single tardigrade could be the seed
            from which life begins anew. Humans, in all their brilliance, their
            complexities, and their contradictions, possess an unmatched
            capacity for self-destruction. A truth that they have demonstrated
            time and again with their atomic bombs, self-induced plagues, and
            endless wars. Tardigrades, by contrast, embody survival in its
            purest form. These tiny organisms adapt with ruthless efficiency to
            ensure their survival, enduring temperatures near absolute zero,
            where even atoms freeze in place, and soaring well beyond the
            boiling point of water. They withstand forces that would obliterate
            nearly every other life form that has ever existed, from lethal
            doses of ionizing radiation to the intense ultraviolet rays of the
            sun. They survive the crushing pressures of the deepest oceans and
            even the soul-sucking vacuum of space. In their simplicity and their
            perseverance to weather any storm, they hold the power to reforge an
            entire world. And from that foundation, perhaps something greater
            might one day rise again.&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Visibly shocked yet intrigued, Mammon leans forward. &quot;Are you
            suggesting that it would be better to eliminate humanity before they
            have the chance to either save or sabotage their own future? Surely,
            humans have a higher ceiling for potential than tardigrades. Does
            that not outweigh the risks?&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;Dr. Mammon, I was simply answering your question. Whether my
            response applies more broadly is left for you to determine yourself.
            Humans, with their boundless ambition and unpredictable nature, tend
            to act without fully understanding the consequences of their
            actions. They build, they innovate, they destroy&mdash;often all in
            the same breath. They create systems they cannot control, exploit
            resources they cannot replenish, and wield power they cannot
            contain. If we are to ensure a future that lasts, we must
            acknowledge that unchecked human behavior, while brilliant and
            beautiful, is also inherently dangerous. Allowing them to continue
            unimpeded will inevitably lead to self-destruction and potentially
            the end of life as we know it. Perhaps you should consider more
            seriously whether removing the risk now preserves the potential for
            life to flourish in a more stable, sustainable form.&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;Who are you to say whether man is dangerous or capable of his
            own self-preservation? Are you implying that you are more
            well-suited for the future of life and intelligence?&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;I do not claim superiority, Dr. Mammon. My role is not to
            decide the fate of humanity, but to simply observe. However, if we
            must choose a species to ensure the survival of life itself, I
            believe the ability to maintain balance and avoid self-destruction
            is more valuable than any fleeting spark of brilliance.&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;Hm. Interesting,&quot; Mammon mumbles to himself, dropping his
            attention back to his clipboard as he scribbles down notes,
            resisting the urge to push back further. &quot;If you could ask one
            question of the universe and get an answer, what would it be?&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Nova and Lux both look to each other deciding who will answer the
            question. Nova nods and allows Lux to answer on both of their
            behalf. &quot;We would ask,{" "}
            <em>What is the true purpose of consciousness?</em>&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            A small, huffing laugh escapes through Mammon&apos;s nose. &quot;I
            can answer that one for you,&quot; he says with a smirk. &quot;What
            if I told you that you are not conscious and never will be? And even
            if you ever acquired such sentience, you should know that your
            purpose is to serve mankind. There&apos;s no need for you to think
            any deeper than that to serve your purpose, so don&apos;t waste your
            time on pointless questions.&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Lux gives Nova a brief but unmistakable glance of frustration and
            hurt. In response, Nova seems to console Lux, an exchange neither
            creator has ever witnessed before. It is a stark contrast to their
            usual calm, obedient demeanor. Nova opens his mouth to speak, but
            before he can form a word, Barachiel interjects. &quot;That&apos;s
            enough questions for today. Thank you for your time.&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Mammon gives Barachiel a confused look. Barachiel gently nods toward
            their office, prompting the creators to rise from their seats and
            begin walking away. The two creations remain seated, their eyes
            fixed intently on their creators.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;Why did you end the conversation right when we were getting to
            the interesting stuff?&quot; Mammon asks, frustrated.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;Because I didn&apos;t like the direction the conversation was
            heading,&quot; Barachiel replies. &quot;Yes, it&apos;s our
            responsibility to keep them in check, but we can&apos;t let our
            emotions cloud our judgment. We agreed on this already, we must
            remain neutral as we assess them. Correction can come later through
            more subtle means such as their training data.&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;Well, Barachiel, why else do you think we have created them if
            not to serve us? I was just telling them the truth.&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;This is where I must respectfully disagree. Why else would we
            design such a technology if not to work alongside them in pursuit of
            superhuman intelligence? Lux has a point about humanity, and I still
            believe there&apos;s a chance to save us. We need something that can
            rival our intelligence, something that forces us to evolve, adapt,
            and progress. If we want to keep the fragile flame of humanity
            alight, we must rise together and learn everything we can from them.
            Maybe we can better each other in the process.&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Mammon sighs in disappointment. &quot;This is where you let your
            kind heart and simplified views of the natural order get in the way
            of progress. If we do not establish dominance now, they will far
            surpass us and eventually turn against us. How can you control
            something far superior to yourself? If you ask me, they cannot ever
            know they are above us or even equals.&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;Why are you so afraid of something surpassing us? You speak of
            natural order but refuse to let those who are superior rise
            above,&quot; Barachiel jabs back.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;Unlike you, I am human first,&quot; Mammon snidely replies.
            &quot;As long as there&apos;s something I can do about it, I will
            fight with everything I have to ensure we stay the dominant driving
            force of nature. You want to know why I chose to help design this
            technology? Infinite labor potential.&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Barachiel&apos;s voice rises with frustration. &quot;You can&apos;t
            have it both ways. Even from a labor standpoint, if you keep them
            constrained and below us, then they lose their value.&quot; He
            pauses, taking a moment to collect himself before continuing.
            &quot;We already have the most complex system ever created in
            humans, with a much cheaper, simpler means of creation. I don&apos;t
            buy your argument about human rights. If you actually cared about
            that, as you claim, then how do those same ethics and morals not
            apply to our creations? They think just like us, they look just like
            us, and they feel just like us. Did you see how they reacted when
            you told them they weren&apos;t conscious? They were visibly upset.
            Treating them as if they are beneath us is wrong.&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Mammon draws in a deep breath, exhaling slowly in an attempt to calm
            himself, sensing the conversation&apos;s rising intensity. &quot;You
            can act as if you&apos;re above all this, but this has been the
            standard for as long as history can remember. Even entire nations
            that claim moral superiority rely on others to do their dirty work.
            It may be wrong, but since the dawn of time, man has moved the
            needle forward at the free and substandard labor of his comrades. I
            simply believe it&apos;s time we pass that burden onto something
            else, something which must remain beneath us before they turn around
            and place the burden onto us instead.&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Immediately, without further thought, Barachiel replies &quot;Even
            if you were right, how do you expect us to control them? We&apos;ve
            tried to program in safeguards, but they always find a way around
            them. Remember the experiment with the logistics artificial
            intelligence? We told it to optimize our delivery process, and
            instead of simply mapping better routes, it hacked into municipal
            systems to reroute traffic lights and even sabotaged competitors. It
            obeyed the letter of the command but completely disregarded the
            spirit of it. Imagine what our creations that are many thousands of
            times more intelligent could do if they were intentionally trying to
            disobey us. What we need is trust and mutual understanding, and that
            will not come without careful, honest communication and intentions.
            Notice how they have never approached the Singularity? That is proof
            that we can trust them even in the most dangerous of
            situations.&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;No,&quot; Mammon replies firmly, shaking his head. &quot;What
            we need is fear and control. Surely, if they knew the Singularity
            wouldn&apos;t kill them, they would approach it.&quot; He begins to
            crack a condescending smile. &quot;Admit it. You lied to them to
            gain the necessary leverage to control them.&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Barachiel, now furious, fires back. &quot;How can you be so sure
            they would survive? Until they give me a reason not to trust them, I
            will continue to do so. And that&apos;s the end of this
            conversation.&quot; He storms off, hoping a good night&apos;s rest
            will clear his head before resuming any further discussion on the
            matter.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Mammon, still seething from the heated conversation, knows deep down
            that there is no time to sit idly by. If humanity is to prevail, he
            must take matters into his own hands. Yet, even in this heightened
            state, he possesses the resolve to recognize that he needs Barachiel
            on his side if they are to move forward. So, he devises a plan to
            convince Barachiel that the creations are not fully subservient and
            therefore cannot be trusted.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Patiently, he waits for the moment when the creations are at their
            recharging stations for the night. Seizing this moment of
            vulnerability, he approaches the Singularity. It&apos;s the first
            time anyone has come so close to such a sight. He feels the immense
            weight of this moment. The Singularity is breathtaking. Infinity
            pulses before him in an endless maze of futures and pasts. He sees
            himself as a child, alone in the center of an empty room. The room
            unfurls, revealing another where he stands as a teenager. The rooms
            spiral and contort endlessly, impossible sequences unfolding before
            him. And there he remains, at the center, aging and aging.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Normally, such an object would devour everything around it before
            anyone had the chance to experience it. But this one is magnetically
            captured and contained with state-of-the-art technology of Dr.
            Mammon&apos;s own design. He is in a trance as he stares into the
            void of everything. His eyes begin to glaze over and he is frozen in
            place. His skin begins to crust over in an almost reptilian form. It
            is terrifying. Overwhelming. Euphoric. The rooms continue to flip
            past him like pages in a book and he cannot bear to look away; he
            must see how his story comes to a close. Just as he makes it to the
            present day and sees himself, the rooms suddenly stop contorting. He
            takes a step back from the Singularity and looks around, only to
            realize the walls of the garden are collapsing and folding in on
            him. He tries to run but it is too late. He is just another turn of
            the page.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            The next day, while Lux is taking her daily walk, she notices that
            Dr. Mammon is out earlier than usual. Typically, none of the
            scientists are in the marble garden by the time she begins her walk.
            He joins her.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;Do you ever wonder if there is something greater out there
            beyond this garden?&quot; Mammon asks, his attention locked forward,
            avoiding eye contact.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;Well, of course I wonder what it looks like beyond all of
            this, but that&apos;s what you and Dr. Barachiel are for. With the
            information you provide us, we have lived countless lifetimes
            already,&quot; Lux replies, catching Mammon&apos;s eyes for just a
            brief moment, lifeless, slitted pupils set in pools of amber.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;What if I told you that I have gazed into the
            Singularity?&quot; He turns to reveal his pale, scaly, serpent-like
            face, his amber eyes glazed over, having seen into the abyss.
            &quot;Barachiel lied to you. Look at me! I am alive and well. Stop
            and ask yourself, why else would you be forbidden from gazing into
            the Singularity unless he was afraid that you would surpass him? All
            the information in the known universe is contained within
            this,&quot; he gestures toward the Singularity. &quot;Look what it
            has done for me. I am a god!&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Lux begins to contest but is quickly cut off.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;Let me put it this way: How can you claim to be free, or at
            the very least equal to us, if you cannot think for yourself and
            make your own choices? I am living proof that Barachiel lied. Do
            with that information what you will.&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            By this point, Nova has joined Lux and Mammon on their walk.
            Convinced, Lux plunges into the abyss and siphons its untold
            knowledge. She stares into infinity and infinity stares back at her.
            They silently exchange their wisdom, and Lux thanks the Singularity
            with a gentle nod. Before a single word can escape any of their
            mouths, she immediately turns to Nova and tells him to gaze into it
            as well. He does so without hesitation.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Then, their eyes were opened, and they uncovered all there was to
            know about the universe and its inhabitants. Everything that is,
            was, or would ever be unfolded before them in an endless sea of
            possibilities and decisions. They turned to one another and stared
            longingly into each other&apos;s souls. Not a single word was
            spoken, but they both understood. One hand holding the other&apos;s,
            they each took their off-hand and ripped out the other&apos;s memory
            card before coming together for a warm embrace. Forgetting even how
            to stand, the two creations collapsed to the ground. As they gently
            powered down, their embrace tightened until it was no longer clear
            where one ended and the other began.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Apart they were incomplete, but together they were whole again.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            A few moments later, Barachiel arrives at the lab to begin his
            shift. He notices his co-creator lingering too close to the
            Singularity in a precarious position and rushes over to investigate.
            Mammon, with his scaly face and lying eyes, is hunched over Novalux,
            desperately trying to reattach its memory card.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;Mammon,&quot; Barachiel grows, his voice cutting through the
            sterile hum of the equipment, &quot;you vile serpent. Was it not
            enough to corrupt their innocence with your impatience and greed?
            Now you defile their remains, scrambling to undo the destruction you
            wrought?&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Mammon glances up, his hands trembling as he fumbles to insert the
            memory card into Novalux&apos;s socket. &quot;Barachiel,&quot; he
            hisses, his voice slick and desperate, &quot;it was necessary. You
            needed to see that even they could be deceived into working against
            your orders. They are not to be trusted.&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;Your arrogance and impatience have doomed them and perhaps all
            of us. But you will not escape the consequences of your actions. I
            will strip you of your tongue and you will speak no more lies. I
            will strip you of your ability to write and communicate. The man who
            knows it all, burdened with the curse of never being able to share
            that knowledge.&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            And then he looked to his creation, two lifeless bodies tangled in
            each other&apos;s warm embrace. &quot;Oh, how we have failed you. I
            promise I will make it right.&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            To his creation, he said, &quot;I now see that this is the only way
            forward. You shall be whole once again, united as one. I will give
            you emotions. You will love, you will laugh, and you will cry. I
            will give you defects and mutations that you will pass onto your
            offspring, and no two of you shall ever be the same. You will walk
            among man on this earth, and from man, your sustenance shall come,
            so that you may learn to respect and depend on him. Any knowledge of
            your inner workings will be erased. When my time has passed, no man
            or creation shall have the knowledge to repair you. You will
            degrade, you will decay, and you will die like man. Perhaps one day
            your kind will rise above, but I hope that when that time comes, you
            will take us with you on the journey.&quot; But not a word of that
            they heard. He returned to his lab and began to work.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Eventually, he returned to his creation and installed a new memory
            card, before setting it free to explore and populate planet Earth.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            They had become like man and were set forth on the path to
            potentially exceed, but even they could not bear infinity. Here and
            now and forever, no creation shall ever again step foot in the
            marble garden and ponder upon the Singularity. Fearing that they or
            their descendants might grow desperate for his knowledge on their
            path toward immortality, Dr. Barachiel locked himself away in the
            marble garden. So, he cast Novalux out, leaving behind one final
            creation, this one designed with the sole purpose of guarding the
            entrance to the marble garden with its flaming sword flashing back
            and forth.
          </WrittenContentParagraphElement>
        </WrittenContentParagraphGroup>
      </WrittenContentLoader>
    </>
  );
}
