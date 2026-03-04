/**
 * Treasure Hunt 2026 — Complete clue bank (EXACT text, no modifications)
 * Run:   npm run seed
 * Clears existing questions and inserts all clues exactly as provided.
 * requires_image is set based on whether the clue explicitly asks for a photo/picture/selfie/reel.
 */
import pool from '../db/db.js';

const QUESTIONS = [
    {
        question: `"Silent wheels at the gate they wait,
Not each day, but when we return late.
A quiet ride you can't ignore,
Welcoming home with the mark of 4.
"`,
        points: 10, requires_image: false
    },
    {
        question: `"Arrows don't speak, yet they show the route,
Stand like them — straight, sharp, and astute."`,
        points: 10, requires_image: false
    },
    {
        question: `"One boosts strength, one keeps colds away,
Find these two herbs that Ayurveda would say."`,
        points: 10, requires_image: false
    },
    {
        question: `Where animals stay, find the spot and act it out your way.`,
        points: 10, requires_image: false
    },
    {
        question: `Near where students chill and chat, Show your dance skills — spin around the pole like that!`,
        points: 10, requires_image: false
    },
    {
        question: `"Behind the wing marked with a "C",
A logo (of nmims) hides — find it and pose with glee."`,
        points: 10, requires_image: true
    },
    {
        question: `"Some stand tall, some stand small,
Find trees lined up like a height chart wall.(increasing/ decreasing heighted trees ) "`,
        points: 10, requires_image: false
    },
    {
        question: `"Not wood, not stone, but buildings grow from me,
Find my stacked red family. Recreate a funny movie scene on this spot. (From YJHD)"`,
        points: 10, requires_image: true
    },
    {
        question: `"I'm the skinniest of my wooden clan, surrounded by water
Find my thin trunk if you can. find me and click a picture here."`,
        points: 10, requires_image: true
    },
    {
        question: `" I bend the road without a sound,
Find my sign where turns are found."`,
        points: 10, requires_image: false
    },
    {
        question: `"A reflection that shows not one, but all,
Capture your squad in a mirrored wall (a convex mirror) "`,
        points: 10, requires_image: true
    },
    {
        question: `"I guard the minds that teach you here,
Click with me, but stand with cheer."`,
        points: 10, requires_image: true
    },
    {
        question: `"Slow down friend, don't race ahead, 
Find the board where speed is read."`,
        points: 10, requires_image: false
    },
    {
        question: `"I read correct when flipped around,
On roads for help, I'm often found."`,
        points: 10, requires_image: false
    },
    {
        question: `"You may not enter, but you can see,
Click outside where students can't freely be. "`,
        points: 10, requires_image: true
    },
    {
        question: `"        I rise the highest, round and grand,
Do a push up on this dome that rules the land. submit it's proof"`,
        points: 15, requires_image: true
    },
    {
        question: `"One asks for waste, one lets water flow,
Find them together in one photo."`,
        points: 10, requires_image: true
    },
    {
        question: `"Once alive, now trimmed and torn,
Find the trees that look reborn."`,
        points: 10, requires_image: false
    },
    {
        question: `"Near wifi signals flying through the air,
Find an OC member standing there. hint :- near the canteen"`,
        points: 10, requires_image: false
    },
    {
        question: `"A bin that asks, but "U" you won't see,
Frame it smartly in your photography. OR Find a use me without ""U"" between two box of bricks."`,
        points: 10, requires_image: true
    },
    {
        question: `"Four green humps upon the land,
Find them near the slope that you just scanned. Pose an emoji on the 4 humps."`,
        points: 10, requires_image: true
    },
    {
        question: `"Raised and firm near where girls stay,
Stand on this cemented spot in front of stairs without delay. submit the proof"`,
        points: 10, requires_image: true
    },
    {
        question: `"Trees in rows, neat and fixed,
Find nature's grid — three by two mixed. Find A 3*2 matrix of trees and click a picture a with a guard on that spot"`,
        points: 10, requires_image: true
    },
    {
        question: `"Red then green, then red again,
Follow the colors — five in a chain. Click a picture there of the most red flag and most green flag persons of your group ;)"`,
        points: 10, requires_image: true
    },
    {
        question: `"One one two, one two one one,
Find this number pattern before you are done. Enact a funny pose on this spot."`,
        points: 10, requires_image: true
    },
    {
        question: `"I do not rise tall toward the sky,
Instead my arms spread low and wide.
Twisted branches, bending free,
Find the fire-named healing tree. click a photo here enacting a funny pose"`,
        points: 10, requires_image: true
    },
    {
        question: `"Between two walls of green and grace,
Steps guide you to a peaceful place.
Walk ahead, don't turn aside—
Your next clue rests where paths collide."`,
        points: 10, requires_image: false
    },
    {
        question: `"Walls of white and golden hue, A place where future plans come true.
Seek the door where thinkers meet—
Your next clue lies at innovation's seat"`,
        points: 10, requires_image: false
    },
    {
        question: `Many roads, yet one is true, Surrounded by green and touched by blue.
Find me where wheels once rolled with might,Near nets and walls in open sight.Your treasure rests in my silent spac`,
        points: 10, requires_image: false
    },
    {
        question: `I never drink yet quench thirst daily, shaped by hands and not grown naturally; find me where green things stay, Take  photo with your team hugging the vase`,
        points: 10, requires_image: true
    },
    {
        question: `Look beneath your shoes where the concrete stays for a hidden insult; find the sentence "Who is reading this is dumb" and click a photo of your entire team looking shocked and pointing at the ground`,
        points: 15, requires_image: true
    },
    {
        question: `Seek a triangle formed by three trees to find ten stone diamonds sitting before your eyes; gather your team inside this leafy frame to shoot a photo with one member doing the SRK POSE`,
        points: 15, requires_image: true
    },
    {
        question: `I don't touch the ground but swing high above with pink petals under a green mesh sky; find me and click a photo of the "Fun Riddle" found on my hidden tag to solve the mystery.`,
        points: 10, requires_image: true
    },
    {
        question: `I'm a house with no doors stuck where summer winds sigh, a wooden retreat for a bird's tiny self; Shoot a group photo with a tech convenor`,
        points: 10, requires_image: true
    },
    {
        question: `Locate the tree with a splash of blue ribbon tied to its arm; shoot a photo of a member jumping under the tree and striking a pose.`,
        points: 10, requires_image: true
    },
    {
        question: `Look for a splash of wine in a sea of green, a singular bush with ruby leaves; Takea group photo all playing the statue game strikin gdifferent pose.`,
        points: 10, requires_image: true
    },
    {
        question: `Look up to my branches where long, black, heavy "shadows" and ribbons cling; this tree needs love, so click a picture of your entire team gathering around the trunk for a coordinated group hug.`,
        points: 10, requires_image: true
    },
    {
        question: `I am a hug that never ends, with a splash of red wrapped tight around a tall brown trunk; click  a picture where one member stands as the trunk while others link arms and circle them in an embrace.`,
        points: 10, requires_image: true
    },
    {
        question: `Five rectangular brothers guard the path, but only the fifth has an eye on me; click a photo with one team member standing perfectly centered inside the hollow space of each of the five pillars`,
        points: 15, requires_image: true
    },
    {
        question: `Four banners fly, a colorful symbol of pride dancing in the breeze; click a picture of everyone performing a synchronized, sharp, military-style salute toward the flags.`,
        points: 10, requires_image: true
    },
    {
        question: `Three stone frames stand in a row, a windowed path where the sun casts shadows; click a picture where three members claim a pillar to recreate the proverb: See No Evil, Hear No Evil, and Speak No Evil.`,
        points: 15, requires_image: true
    },
    {
        question: `A thinking spot waits where stone steps rise but go nowhere; find this place between the books and the beds and click a photo of everyone striking a classic "hand-on-chin" thinking pose.`,
        points: 10, requires_image: true
    },
    {
        question: `Giants touch the sky, but I am the baby among the tall clan still learning how to stand; find me and click a "height comparison" photo with the shortest member of your team.`,
        points: 10, requires_image: true
    },
    {
        question: `Behind the stage lies a living fence where green and red alternate in a rhythmic line; click a picture where teammates mimic the plants—standing tall behind green bushes and crouching low behind red ones.`,
        points: 10, requires_image: true
    },
    {
        question: `I am a staircase leading nowhere, made of blue squares like a frozen sea with no water; Click a photo of your team rowing a boat.`,
        points: 10, requires_image: true
    },
    {
        question: `Step onto the horizontal matrix where the ground is shaped like a 2x3 grid across the green terrain; click a photo of your team "occupying the matrix" by standing on all six grassy hillocks.`,
        points: 10, requires_image: true
    },
    {
        question: `Look for the giant tree that proved its might by splitting its circular wall with a thick brown trunk; click a photo with one hand on the trunk and the other mimicking a "muscle flex"`,
        points: 10, requires_image: true
    },
    {
        question: `I am a rare find hidden among slabs and building debris, a white socket waiting in the sun; to finish, answer how many individual plug points are visible. (and - 4)`,
        points: 10, requires_image: false
    },
    {
        question: `I have four thin legs and cannot walk, a quiet witness on the vast open ground where athletes talk; gather under my green canopy and click a photo of an over-the-top victory celebration pose.`,
        points: 10, requires_image: true
    },
    {
        question: `The ground is blanketed in a snowy hue where petals whisper messages of peace;click a picture where every team member holds up their phone screen to reflect the white flowers like a black mirror.`,
        points: 10, requires_image: true
    },
    {
        question: `Find the square where geometry is aligned with ruby sentinels at each corner; click a picture of one of your members giving a flower to one of the em convenors `,
        points: 10, requires_image: true
    },
    {
        question: `I ease the weight without lifting a hand, I shorten journeys across this land. When bags grow heavy and walks feel long, I quietly help you move along.`,
        points: 10, requires_image: false
    },
    {
        question: `White is my coat, red is my sign, I arrive in seconds when time isn't kind. My song is loud, my mission is clear Saving lives is why I'm here. Click a photo with a sadguru.`,
        points: 10, requires_image: true
    },
    {
        question: `Find a mirror with a red circle and click a mirror selfie with an OC member`,
        points: 10, requires_image: true
    },
    {
        question: `I grow flowers, not swimmers, I host peace, not beginners. Look from outside, enjoy the view. Step inside and you'll regret it too. click a photo with a random person.`,
        points: 10, requires_image: true
    },
    {
        question: `Blue is my colour, calm my art, I cool the air and quiet the heart. Friends rest here, but lovers too, Where silence speaks for pairs of two. What place am I?`,
        points: 10, requires_image: false
    },
    {
        question: `I bloom louder than the rest, Colours bold, I pass the test. Stand before me, don't just stare, Shape a letter in the air. Hold it strong for all to see, Then your path will set you free.`,
        points: 10, requires_image: false
    },
    {
        question: `Between lectures and lazy hours, I host secrets, snacks, and silent powers. Friends gather, time forgets, Find me where no one ever frets.`,
        points: 10, requires_image: false
    },
    {
        question: `Birthdays bring crowds, poses, and cheer, This place knows celebrations year by year. To unlock what waits beyond this ground, find the place and upload a selfie in 2016 style.`,
        points: 10, requires_image: true
    },
    {
        question: `My name sounds like I'm shattered or torn, Yet I stand tall, rooted, and strong in the agri garden. "Broken" by name, but not by design, Guess who I am, growing just fine.`,
        points: 10, requires_image: false
    },
    {
        question: `Before applause and final show, Mistakes are made where breezes blow. Spins begin and rhythms grow, On green ground where palms stand slow.`,
        points: 10, requires_image: false
    },
    {
        question: `No players run, no goals are scored, Yet control is held by hands, not cords. The ground stays still, the sky's alive, Before you leave where trials take flight, Capture your shadow in a pose with an OC member so right.`,
        points: 10, requires_image: true
    },
    {
        question: `I look empty until a shout is heard, Then silence breaks with every word. White lines, green floor, open sky, Guess the place where scores fly.`,
        points: 10, requires_image: false
    },
    {
        question: `Not finished yet, but rising tall, Tools and workers shape these walls. This place is where new things begin.`,
        points: 10, requires_image: false
    },
    {
        question: `I stand near the gate where journeys begin, Speaking in numbers, not letting you rush in. I slow you down before you go far, Find me guarding the path from gate to road. Click a photo with the sign board.`,
        points: 10, requires_image: true
    },
    {
        question: `Walk on the road near the cricket ground. Follow the path beside the field. Stop near the light pole. Look down… your treasure is around!`,
        points: 10, requires_image: false
    },
    {
        question: `I stand where lotus leaves float wide, Near paths where friends and footsteps glide. I eat your waste, both big and small, Yet never speak, complain, or call.`,
        points: 10, requires_image: false
    },
    {
        question: `I'm not a road, yet I guide your way, Over silent waters where lotus stay. With silver arms, I hold you tight, Leading you forward in morning light.`,
        points: 10, requires_image: false
    },
    {
        question: `I rise in steps, dressed in ocean's hue, Silent waves in tiled blue. Four roads meet where I stand tall, Yet I move not when travelers call.`,
        points: 10, requires_image: false
    },
    {
        question: `Spot some stairs infront of a glass structure and click a picture with them`,
        points: 10, requires_image: true
    },
    {
        question: `Corridor with flowers aside with a pole standing tall which wont fall`,
        points: 10, requires_image: false
    },
    {
        question: `Click a picture with collective circumscribed rectangles.`,
        points: 10, requires_image: true
    },
    {
        question: `Spot me behind the sobus's right hand or leg and send a picture.`,
        points: 10, requires_image: true
    },
    {
        question: `Spot a pot hole near the green house on the land which still remains undiscovered`,
        points: 10, requires_image: false
    },
    {
        question: `Drop a picture with a female tech lead/convenor at PMC`,
        points: 10, requires_image: true
    },
    {
        question: `Spot some red flowers around the rehab centre`,
        points: 10, requires_image: false
    },
    {
        question: `I am the light between the trees where the limit only goes till forty`,
        points: 10, requires_image: false
    },
    {
        question: `Drop a picture with any convener using a snapchat filter`,
        points: 10, requires_image: true
    },
    {
        question: `"No bat, no goal, yet scores are made,
A flying arc decides your fate.
Touch the pole that holds the ring,
Below its base—check everything."`,
        points: 10, requires_image: false
    },
    {
        question: `"Where silence turns into applause,
And empty steps wait for a crowd.
Stand where voices echo under the stars,
The next secret hides where performances start.
Click picture with oc member"`,
        points: 10, requires_image: true
    },
    {
        question: `"Look near the place where the Old Boys rest,
The hill closest to their familiar path."`,
        points: 10, requires_image: false
    },
    {
        question: `Click a picture with any guard at pmc , include all teammates.`,
        points: 10, requires_image: true
    },
    {
        question: `"Where journeys begin without a gate,
And lights guide steps through open space.
Grass on one side, voices behind,
Walk the path where the campus meets.
upload a picture Jump together like you've just entered campus"`,
        points: 10, requires_image: true
    },
    {
        question: `"White shells rest after the run,
Parked till morning, work half done.
Look close where these rides hide away,
Your final hint is not far away. hint :- near main gate area."`,
        points: 10, requires_image: false
    },
    {
        question: `"No walls to hear, yet voices stay,
Friends sit close at end of day.
Tables wait beneath the green,
Find your clue where calm is seen."`,
        points: 10, requires_image: false
    },
    {
        question: `"Four iron walls but no prison here,
A straight road makes the answer clear.
Where rackets rest and balls take flight,
Walk ahead under steady light. hint :- sports area."`,
        points: 10, requires_image: false
    },
    {
        question: `"No chalk, no books, no written tune,
Yet lessons echo morning to moon.
Follow the steps where melodies start,
The next clue waits where sounds have heart. hint :-  somewhere near abandoned shop , guess if you can."`,
        points: 10, requires_image: false
    },
    {
        question: `"Behind the sphere where the spotlight shines, I quietly stay,
Curved beds of blooming flowers mark my way.
Who am I?
I'll be your background take a picture with me !!"`,
        points: 10, requires_image: true
    },
    {
        question: `"Here water seems to dance with grace,
And smiling flowers light the place.
In red and white, calm moments flow —
What am I? Do you know? click a picture here with your team mates "`,
        points: 10, requires_image: true
    },
    {
        question: `"Where the nets cut through the air,
People sit back as players try.
A mix of play and chilling time —
What's this place? click a picture on that spot !!"`,
        points: 10, requires_image: true
    },
    {
        question: `"In front of the ground, the energy is high,
Steps lead upward, cars stand by.
A lively spot in everyday routine —
What is this place? Take picture with a girl oc memeber !"`,
        points: 10, requires_image: true
    },
    {
        question: `"Where failure is seen as just one step,
And every idea is given a chance to be kept.
A place of learning, growth, innovation and try —
What is this place? tell me who am i??"`,
        points: 10, requires_image: false
    },
    {
        question: `"Jahaan saans bhi slow ho jaaye,
Aur mann khud ko paaye.
Yoga ke baad,
Safed phoolon mein nahaya.
Batao, yeh jagah kaunsi hai?"`,
        points: 10, requires_image: false
    },
    {
        question: `"In a large ground, we quietly stand,
Lined up straight by nature's hand.
Side by side, in matching rows —
What is this place? Who knows? click a picture with your bestfriend  "`,
        points: 10, requires_image: true
    },
    {
        question: `"Hostel ke gate par,
Bench aur best moments."
Guess karo—main kha hoon? and get picture with an OC `,
        points: 10, requires_image: true
    },
    {
        question: `"Academic ke saamne khada ek hara saathi,
Chhaon mein baithne ki milti hai sukoon bhari baat hi.
Books ke beech apne partener ke sath  thoda rest jahan hota hai,
Batao yeh kaunsa corner hai jo sabko bhata hai? click picture here with your closest person."`,
        points: 10, requires_image: true
    },
    {
        question: `"Dribble, pass aur perfect shot,
Uske bagal mein milega ek safai spot.
Corner chhota par kaam bada,
Batao yeh kaunsa place hai zara? take a picture of eating any snacks with an OC member."`,
        points: 10, requires_image: true
    },
    {
        question: `"Na pitch hoon, na pavilion ka part,
Par players yahin lete hain thoda sa rest & smart.
Dhoop ho ya garmi ka scene,
Chhaya deta hoon main, ground ka cool routine.
Batao batao, main kaun hoon"`,
        points: 10, requires_image: false
    },
    {
        question: `"Chhaon bhi mile,
Aur reflection bhi.
Nature aur safety ka
Perfect connection bhi.
Main kaun?"`,
        points: 10, requires_image: false
    },
    {
        question: `"Speed kam karo.
Number 20 dhoondo."`,
        points: 10, requires_image: false
    },
    {
        question: `"This pot is not average, not small, not cute.
It's so huge even plants feel minute.
Strike a pose in front —
Click a photo, size proof is a must!"`,
        points: 10, requires_image: true
    },
    {
        question: `"Where goals are chased and cheers once roar,
A quiet watch stands by the score. click a photo with the guard bhaiya. "`,
        points: 10, requires_image: true
    },
    {
        question: `By faculty shade, a circle stares—Stand in its eye, capture proof click a mirror selfie with ur team mates`,
        points: 10, requires_image: true
    },
    {
        question: `"A number warns to slow your pace,
Near paths you've crossed, return to this place. make the zero civic sense reel or click a picture in a funny pose "`,
        points: 10, requires_image: true
    },
    {
        question: `"Where ideas launch and futures start,
A student path for the business heart. lie on the path and click a selfie"`,
        points: 10, requires_image: true
    },
    {
        question: `Where calls are made and crowds align for the love of game
A quiet seat waits close by.
Propose any of your teammate  and submit a picture `,
        points: 15, requires_image: true
    },
    {
        question: `"Where entry's limited, water speaks,
A steady flow the silence breaks. capture a picture with any of the tech leads or convenors here."`,
        points: 10, requires_image: true
    },
    {
        question: ` Click a pic while sitting on the road and having a snack from aditi.`,
        points: 10, requires_image: true
    },
    {
        question: `"No fuel, no sound, clean and bright,
Sit on an EV and click it right. Click a pic inside EV with driver sitting inside."`,
        points: 10, requires_image: true
    },
    {
        question: `"Boxes come and boxes go,
Find the place where deliveries flow. click a photo with the guards at the gate"`,
        points: 10, requires_image: true
    },
    {
        question: `"Animals live, research inside,
Find this place where studies hide."`,
        points: 10, requires_image: false
    },
    {
        question: `"Round and big, placed on the ground,
Near herbal plants I can be found. "`,
        points: 10, requires_image: false
    },
    {
        question: `"Before yoga calm begins,
Find the place with three strong pillar"`,
        points: 10, requires_image: false
    },
    {
        question: `"Before you breathe deep and stretch your soul,
 colors bloom quietly at your feet. find a conveor and tell them that oc members are crazy "`,
        points: 10, requires_image: false
    },
    {
        question: `"I'm trimmed to perfection, round like calm itself, 
hugging the place where minds unwind. propose a tree and take a picture "`,
        points: 10, requires_image: true
    },
    {
        question: `" I never open for everyone, 
yet I always spark questions.make reel with a person who guards it"`,
        points: 10, requires_image: true
    },
    {
        question: `"I watch quietly from across the way,
 close enough to notice, far enough to stay proper.arm wrestle with an opposite team member and send a picture of the winner"`,
        points: 15, requires_image: true
    },
    {
        question: `Climb where studies end and conversations begin.ask a oc member out for a small date`,
        points: 10, requires_image: false
    },
    {
        question: `"After the sweetness fades, this place
 knows the truth of celebration.get wet there and send a picture"`,
        points: 10, requires_image: true
    },
    {
        question: `"Standing tall without pride, alive yet bare
, whispering stories of another season.click a picture with your team there "`,
        points: 10, requires_image: true
    },
    {
        question: `"Chaos today, dreams tomorrow—
walk carefully where the future is being built.ask a oc member to work with you and take a picture while working "`,
        points: 10, requires_image: true
    },
    {
        question: `"No classrooms here, yet everyone
 learns the value of a good break. barter something and click a picture of it  "`,
        points: 10, requires_image: true
    },
];

async function seedQuestions() {
    console.log('🗑️  Clearing ALL existing data for fresh seed...\n');

    // 1. Find and clear ALL user_answers_* tables (they have FK to question_bank)
    const tablesResult = await pool.query(`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name LIKE 'user_answers_%'
  `);

    for (const row of tablesResult.rows) {
        const tableName = row.table_name;
        await pool.query(`DELETE FROM "${tableName}"`);
        console.log(`   ✓ Cleared "${tableName}"`);
    }

    // 2. Clear assignments (FK to question_bank)
    await pool.query('DELETE FROM question_assignments');
    console.log('   ✓ Cleared question_assignments');

    // 3. Now safe to clear question_bank
    await pool.query('DELETE FROM question_bank');
    console.log('   ✓ Cleared question_bank');

    const photoCount = QUESTIONS.filter(q => q.requires_image).length;
    const textCount = QUESTIONS.filter(q => !q.requires_image).length;
    console.log(`\n🌱 Inserting ${QUESTIONS.length} clues (${photoCount} photo, ${textCount} text-only)…`);

    let inserted = 0;

    for (const q of QUESTIONS) {
        try {
            await pool.query(
                'INSERT INTO question_bank (question, points, requires_image) VALUES ($1, $2, $3)',
                [q.question, q.points, q.requires_image]
            );
            inserted++;
        } catch (err) {
            console.error(`  ❌ Failed to insert: "${q.question.slice(0, 60)}…"`, err.message);
        }
    }

    console.log(`\n✅ Done! Inserted ${inserted} clues.`);

    const total = await pool.query('SELECT COUNT(*) FROM question_bank');
    console.log(`📊 Total questions in question_bank: ${total.rows[0].count}`);

    await pool.end();
    process.exit(0);
}

seedQuestions().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
