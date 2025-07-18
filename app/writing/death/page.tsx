import WrittenContentLoader from "@/src/components/WrittenContentLoader";
import { WrittenContentMetadataProps } from "@/src/types/data-props";
import ResumeScrollProgress from "@/src/components/ResumeScrollProgress";
import WrittenContentParagraphElement from "@/src/components/WrittenContentParagraphElement";
import WrittenContentParagraphGroup from "@/src/components/WrittenContentParagraphGroup";

const storyData: WrittenContentMetadataProps = {
  title: "Death",
  subtitle: "Shane Bonkowski",
  date: "September 10, 2024",
  coverImageUrl: "/webps/writing/death.webp",
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
            A man sits alone at a rundown bar after a long day of work, his
            soulless eyes projecting a heavy, lingering despair. Deep in the
            mind of the troubled man, a war is brewing. His mind aches with a
            pulsing hatred. He can&apos;t shake the terrible thoughts. He dreams
            of torture and damnation. Eternal fires that rage and sear to the
            bone those unlucky enough to cross his path. Thoughts of the purest,
            most vile forms of evil imaginable. He orders a glass of absinthe,
            the green liquor swirling like a portal to another world, its
            bitterness masking his underlying torment.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Spanning the vast expanse of his mind, nestled between his
            horrendous thoughts, are the gaseous clouds of creation and fiery
            balls of destruction that permeate through infinity. The clouds
            contort and writhe around his thoughts like a hungry conniving
            serpent. Each fiery ball of destruction roars with the hellfire of
            the mighty eternal flames he conjures to do his bidding. In the
            surrounding graveyard, mighty boulders of unimaginable scale tumble
            and collide in utter chaotic beauty like a cosmic symphony. Amid
            this chaos, tucked away on the lucky few boulders that find a small
            window of time when the orchestra is at rest, are those who occupy.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            The occupiers live a prosperous life. For eons, they have flourished
            and advanced, a society of scientists and engineers united by one
            goal: to seek out the hidden knowledge of their universe. There is
            no war, no crime, and very few disagreements. By all accounts, they
            reside in paradise. For all but one day out of the year, that is,
            when the true cost of their prosperity must be paid.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            The annual harvest has existed for as long as their history books
            chart back. It is a night like no other, bringing the fanatic out of
            even the least devout. In the early days, they&apos;d make their
            rounds to the houses of the old and the sick.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="italic"
            textAlign="justify"
          >
            Bang. Bang. Bang.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            The doors fling open and the Crusaders flood in. They tie up the
            sacrificial fodder and drag them through the dark streets toward the
            tree line. The chosen wrap their arms around the trees in their
            final act of intimacy, their trembling hands nailed to the trunks in
            a grotesque embrace. They close their eyes and calmly wait to face
            their fate.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="italic"
            textAlign="justify"
          >
            Dong. Dong. Dong.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            The bell tower tolls an eerie chime signaling the arrival of
            midnight.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Off in the distance, a pale rider approaches, his horse tinged with
            the sickly green of a decaying corpse. He is shrouded in a loose
            black robe that whispers calamities in the wind as he rides. The
            fabric clings to his skeletal frame, revealing only bony, off-white
            hands and a skull that looks as though it has just risen from the
            grave. An evil, restless spirit, armed with a golden sword
            meticulously crafted, as if forged from the Pearly Gates of Heaven.
            When the debt collector comes to collect, those who know better
            cower in the safety of their homes to avoid his gaze of judgment.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            The treeline screams in agony all through the long night. The
            townspeople wake the next morning only to find jagged bloody stakes
            where bodies and trees once were&mdash;swift and final justice at
            the hand of his gilded sword.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            It used to be so simple.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            One year, in an act of utter disobedience and hubris, they attempted
            to deceive their servant of death. In the weeks leading up to his
            arrival, they slaughtered one-quarter of their livestock and used
            their flesh to construct effigies in their image, which they draped
            in their clothing. They left them out on the night of his arrival
            bound to the blood-stained trees where he would come to collect his
            debts.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            The treeline screamed in agony all through the long night. The
            occupiers woke the next morning, and to their shock, the effigies
            remained where they began, unclothed but otherwise untouched. They
            searched all through the village for any signs of the debt
            collector&apos;s arrival, and to their horror they found their
            life-giving river streaming red with blood. At its source, they
            found the lifeless bodies of their own piled up like a grotesque
            dam, their life essence slowly oozing into the water supply. Gently
            draped over their bodies were the clothes that previously adorned
            their effigies, as if meticulously placed one by one.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Fueled by the red hatred of the river, their crops warped into
            corrupted, rotten forms. One-quarter of their population starved to
            death in the ensuing famine. It took a decade to cleanse the river
            of their sins.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;I always collect my debts.&quot; The collector warned them.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            And they swore never to deceive him ever again.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            As their civilization has expanded across the cosmos, the
            collector&apos;s appetite has grown increasingly insatiable. What
            began as a few of the old, the weak, and the wicked has escalated
            over millions of years to entire villages, cities, countries, and
            now planets. They never dare to question his hunger out of fear of
            how far he could go if he does not get his fix. Driven by this
            merciless cycle that has grown unwieldy, the occupiers desperately
            seek a way to break free.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            This year&apos;s sacrifices are rapidly approaching.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            But this year, a secret plan is brewing that the leaders are keeping
            close to their chests. They sprawl with their fleet of hundreds of
            thousands of ships from star system to star system, depleting them
            of all their energy. Before they can even let out their final
            whimper into the dark expanse, the occupiers are already onto the
            next. They tow the ball of energy they have amassed behind their
            fleet in a gravity prison. It takes nearly as much energy to contain
            their fiery ball of destruction as it contains itself.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            The universe waxes and wanes as its life force is sucked out. At a
            rate never seen before, distortions are appearing and rippling
            throughout the cosmos. Black holes are spontaneously forming in the
            ether and tearing through galaxies. Entire galactic webs are dying
            off like the coral reefs on the shores of their home planet.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;Look at the devastation wrought upon our universe!&quot; their
            leader proclaims. &quot;How will we ever recover from this
            destruction he has unleashed upon us?&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="italic"
            textAlign="justify"
          >
            Tick. Tick. Tick.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            His mind turns like clockwork. Deep within the recesses of the
            troubled man&apos;s brain, the tides are shifting. His call to
            darkness beckons like a relentless storm, feeding on his sanity. His
            ears ring with incessant screams, and his brain throbs with
            agonizing pulses of hatred like turbulent waves in an unsettled sea.
            Memories slip away like grains of sand through clenched fingers, and
            relentless migraines lash out like fiery whips.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            He drinks to ease the terrible thoughts but it&apos;s no use.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            The chaos within him festers as nightmarish visions torment him. He
            is the architect of suffering, relishing the thought of inflicting
            unspeakable cruelties. His mind conjures scenes of the unending
            agony he will unleash upon the masses. He dreams of the rifts he
            will tear through their planets, revealing burning lakes of fire
            that spew the eternal flames that will sear their very essence.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            He stares into his reflection in the swirling green sludge in his
            glass. A demon stares back at him with a menacing smirk. He slams
            the glass down on the table and it spills, the green hatred seeping
            into the grooves of the old wooden countertop. In the commotion, all
            the other patrons turn their heads and stare with their judgemental
            eyes. Frantic, he gathers himself and stumbles out of the bar.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            On his way home, he passes a church, catching sight of a passionate
            sermon through the open doors. Slipping inside, he finds a seat in
            the back. The church doesn&apos;t erupt in flames. He exhales,
            relieved.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            The pastor reads:
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="italic"
            textAlign="justify"
          >
            Revelation 6:7-8: When the Lamb opened the fourth seal, I heard the
            voice of the fourth living creature say, &quot;Come!&quot; I looked,
            and there before me was a pale horse&mdash;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Before the pastor can finish the excerpt, the troubled man&apos;s
            ears start to ring. A cold chill runs through him, and he sinks
            deeper into his seat. He remains there in silence and despair for
            the rest of the sermon. By the end, only he and the pastor remain.
            The church is dimly lit, with only the muted light filtering through
            the stained glass to accompany him. Beside him, the iridescent white
            and yellow reflection of an angel from the glass.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Gathering his courage, he approaches the front and asks the pastor
            for advice.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;The souls of my victims haunt me. I hear their voices and
            their screams every time I close my eyes.&quot; He confesses to the
            pastor. &quot;I command the electricity to stop their hearts from
            beating, I deliver the poison to their bodies that ends their
            torment. I am death, and yet I am justice. I am the gavel and I am
            the guillotine. What am I to do?&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            They lock in gaze for a moment, and the man stares into the
            pastor&apos;s cloudy white eyes, devoid of depth. The pastor stares
            back into the man&apos;s empty black eyes, devoid of soul. The
            pastor sits in silence for a while, thinking back on the countless
            bible verses in his mind, juggling the urge to condemn the troubled
            man for his murderous sins, and the patience and empathy to help him
            find the light. He says:
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="italic"
            textAlign="justify"
          >
            Isaiah 1:18: &apos;Come now, let us reason together,&apos; says the
            Lord. &apos;Though your sins are like scarlet, they shall be as
            white as snow; though they are red like crimson, they shall become
            like wool.&apos;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Before the troubled man has a chance to reply, the pastor follows
            with:
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="italic"
            textAlign="justify"
          >
            Matthew 12:43-45: When an impure spirit comes out of a person, it
            goes through arid places seeking rest and does not find it. Then it
            says, &apos;I will return to the house I left.&apos; When it
            arrives, it finds the house unoccupied, swept clean, and put in
            order. Then it goes and takes with it seven other spirits more
            wicked than itself, and they go in and live there. And the final
            condition of that person is worse than the first.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            The man nods his head and sees himself off. He hears the pastor
            mutter a final line of scripture under his breath. The line echoes
            ominously in the dimly lit church:
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="italic"
            textAlign="justify"
          >
            Hebrews 10:26-27: If we deliberately keep on sinning after we have
            received the knowledge of the truth, no sacrifice for sins is left,
            but only a fearful expectation of judgment and of raging fire that
            will consume the enemies of God.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            As the troubled man exits, the weight of the pastor&apos;s words
            hangs heavy in the air.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            At the same time, in a distant corner of some forgotten galaxy, the
            leaders finally unveil their long-guarded plan to the rest of the
            occupiers. Deep down, they understand that mere evasion will not
            suffice. If they have any intentions of breaking free from the
            cycle, they must escape the universe altogether. So, they plan to
            redirect all the energy they have harvested into the supermassive
            black hole their home galaxy has been orbiting since the beginning
            of time, <em>Eden</em>. With the tremendous amount of energy they
            have harnessed, they plan to spin the black hole at such tremendous
            speeds that it bores a hole through spacetime itself, leaving behind
            a portal to another universe.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            It is not lost on them that this is a decision with severe
            consequences they know all too well.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            In their previous attempt to escape the collector, the occupiers
            fled to the far reaches of a newly discovered galaxy, hoping its
            isolation would shield them from his insatiable hunger. For decades,
            they thrived in their new sanctuary.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Until they didn&apos;t.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Upon discovering their refuge, the collector unleashed a
            catastrophic plague upon the galaxy, meticulously crafted to attack
            their very essence. It twisted their forms into hideous mockeries of
            their former selves, turning them into shambling husks of unending
            agony. The husks were cast aside from the general populace and
            locked away. The plague spread at a horrific speed, carried by the
            stellar winds and cosmic radiation. Before long there were too many
            to contain. Entire planets descended into chaos as the disease
            ravaged all that it touched.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            The plague poisoned the air, water, and land, leaving a desolate
            trail in its wake. Once-thriving civilizations crumbled into ruins,
            their populations dwindling to mere shadows of their former selves.
            He left no corner of the galaxy untouched. Every world bore the mark
            of the collector&apos;s relentless judgment. The once vibrant
            expanse was reduced to a graveyard of twisted forms and shattered
            hopes, a silent monument to the collector&apos;s unyielding wrath.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            And so the occupiers, once again, were forced to flee. To this day,
            no one dares to enter that forsaken galaxy, haunted by the
            monstrosities they left behind.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            The collector always collects his debts.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            In stark contrast to the crumbled ruins of the forsaken galaxy, Eden
            stands as an impenetrable fortress. It is encircled by numerous
            smaller black holes that orbit it like sentinels. Chaotic balls of
            destruction, they swirl around with blinding white halos. Armed with
            stellar beasts that orbit them like a flaming sword flashing back
            and forth, they guard the entrance. One small misstep and the
            occupier&apos;s entire fleet could meet their fate at the end of
            their fiery swords. With collection day rapidly approaching, they
            close in on their target, and along the way collect more energy from
            stray stars.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Meanwhile, the troubled man finally stumbles home, his mind in
            turmoil. The pastor&apos;s words echo painfully through his skull as
            if his thoughts are being ripped apart. He paces around his room,
            haunted by the faces of his victims. The questions won&apos;t stop:{" "}
            <em>How can I leave my job behind?</em>{" "}
            <em>How would I support my family?</em>
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;I&apos;m only a few years away from getting my pension,&quot;
            he mutters to himself, trying to soothe his conscience. &quot;I just
            need to hang in there a little longer, then it will all be
            over.&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Every excuse feels hollow, burdened by the blood on his hands. Each
            time he considers walking away, the stark reality hits him: quitting
            would mean upending everything. He feels trapped.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Eden&apos;s fleet only grows stronger as the dead stars collapse and
            are reborn as rogue black holes. They patrol all throughout the
            universe, corrupted stellar beasts set forth to consume entire
            civilizations. The troubled man hears all their voices as they cry
            in agony when the beasts come by to devour them. Somehow, the
            occupiers still push on despite the onslaught from the universe.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            The sun from their home planet rises, and with it, an arid,
            suffocating silence fills the void that can only mean one thing:
            collection day has arrived.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            The remaining occupiers storm past the guards of Eden and unleash
            all of the energy they have harnessed. Half their fleet is sucked
            into oblivion as they cross paths with the event horizons that
            sprawl in every direction like thorny vines. In an instant, the
            ships go from the edge of the horizon to the center of the
            slow-beating black hearts of the corrupted beasts, frozen in
            eternity just before they can be put out of their misery. Eden
            pulses and writhes as the energy streams into it. Their
            magneto-drive pumps spin up a powerful vortex of plasma that locks
            the supermassive black hole in their grasp. It spins and spins
            faster and faster, distorting spacetime around it. The very fabric
            of their universe is dragged around by the rotation and knotted in
            on itself.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Caught in the wake of rippling distorted spacetime, their remaining
            fleet of hundreds of thousands of ships patiently waits, bracing for
            their impending fate. All around them, the crumpled fabric of
            spacetime reveals a gallery of pasts and futures. They witness the
            collector atop his deathly pale horse, riding through villages from
            millions of years ago. They see countless scenes of slaughter, an
            unending nightmare of death&apos;s construction stretched across
            infinity. When they glimpse into the future, it blazes with blinding
            white light, forcing them to shield their eyes and turn away.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Ships are stationed at every pump, ready to fight with everything
            they have. Restless, they stand guard and wait for the collector to
            arrive, to challenge their desperate bid for freedom. Holding their
            breath, they empty their reserves into the black hole, watching as
            the last bit of energy they have swirls endlessly around its goliath
            halo.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            And they wait.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            And nothing happens.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Shocked and horrified, they quickly realize they have made a grave
            mistake. They did not have enough energy to break through.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            &quot;There must be something we can do!&quot; some of the occupiers
            plead, looking to their captains, who sit frozen in fear, terrified
            of what the collector has in store for them.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            While they wait to face their reckoning, the troubled man confronts
            his own demons with the lethal injection he has scheduled for today.
            He moves slowly through the dimly lit hall toward the execution
            room, wrestling with his decision. His heart races.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="italic"
            textAlign="justify"
          >
            Thump, Thump, Thump, Thump, Thump.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            The door is half open with a soft white glow emanating from it. Deep
            down he knows that his mind was already made the moment he left home
            to go to work this morning. He fills his syringe carefully with a
            green liquid, one fluid ounce of death swirling in its glass
            chamber. His hands steady and his heart heavy, he approaches the
            prisoner. As the needle pierces the skin, his heart slows.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="italic"
            textAlign="justify"
          >
            Thump… Thump… Thump…
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Until it gives its final beat.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="italic"
            textAlign="justify"
          >
            Thud.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Growing impatient, suspecting that the collector is playing tricks
            on them before he plans to unleash his judgment, the occupiers cry
            out into the void. &quot;Show yourself! We know that we have wronged
            you. Punish us if you must.&quot;
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            A heavy, lingering silence fills the void.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Without the pumps to keep it going, Eden&apos;s death roll grinds to
            a halt. As the fabric of reality unfurls around it, the universe
            begins to devour itself. The lights of distant stars flicker around
            them, and the nearby black holes endlessly swirl their halos in a
            chaotic display as they zoom past, dragging the occupiers with them
            through the gates of Eden.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            It is dark and desolate, a lonely passage that stretches on forever.
            They drift through the empty ether for an eternity, lost and without
            purpose, free at last but without a home. Their memories fade as the
            endless dark stretches on. Eventually, they are one with
            nothingness, as if they had never existed in the first
            place&mdash;an amorphous blob of infinity.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            Then, at last, a faint white glow pierces through the unending
            night. Suddenly, they burst into existence, hovering over a massive,
            lifeless form. He looks just like them, yet far too vast to
            appreciate in his entirety. They orbit around his head as if bound
            by some invisible tether, following him as he is scooped up and
            taken first to the coroner and then to his funeral.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            The priest reads:
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="italic"
            textAlign="justify"
          >
            Matthew 7:13-14: Enter through the narrow gate. For wide is the gate
            and broad is the road that leads to destruction, and many enter
            through it. But small is the gate and narrow the road that leads to
            life, and only a few find it.
          </WrittenContentParagraphElement>

          <WrittenContentParagraphElement
            fontStyle="normal"
            textAlign="justify"
          >
            And with their host finally laid to rest, they are released from
            their tether. Before the troubled man is lowered into the earth from
            which he came, the priest gently caresses his casket. Briefly, he
            drifts his cloudy white eyes to his reflection on the gilded accents
            of the casket, a demon idly stares back at him.
          </WrittenContentParagraphElement>
        </WrittenContentParagraphGroup>
      </WrittenContentLoader>
    </>
  );
}
