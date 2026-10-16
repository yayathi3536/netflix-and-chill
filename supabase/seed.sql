-- ====================================================================
-- OUR UNIVERSE — Initial Seed Data for Supabase
-- Run this script in your Supabase SQL Editor to seed the database
-- ====================================================================

-- 1. FEATURED HERO & OUR STORY CHAPTERS
insert into public.memories (
  id, title, subtitle, category, date, year, duration, match_score, rating,
  synopsis, full_story, location, tags, fallback_gradient, progress, is_top_10, is_favorite, is_in_watchlist
) values
(
  'featured-story-of-us',
  'The Story of Us',
  'Chapter Infinity: Our Forever Run',
  'our-story',
  'Ongoing & Everlasting',
  '2022 - Present',
  '4 Seasons · Endless Love',
  100,
  'PG-Love · Forever',
  'From an unexpected first conversation to building our whole universe together. A cinematic journey of late-night laughter, kitchen cooking disasters, spontaneous road trips, and finding home in each other’s arms.',
  'They say love is patient and kind, but nobody mentioned how much belly-aching laughter, stolen hoodies, and burnt garlic bread would be involved. Looking back at where we started, every single wrong turn led us straight to the right person. You are my favorite plot twist, my safest sanctuary, and the only person I want to re-watch life with over and over again.',
  'Wherever We Are Together',
  array['True Love', 'Soulmates', 'Romantic Comedy', 'Slice of Life', 'Milestones'],
  'from-rose-950 via-red-950 to-neutral-950',
  88,
  null,
  true,
  true
),
(
  'story-1',
  'Chapter 1: The Day We Met',
  'The Universe Decided to Be Kind',
  'our-story',
  'October 14, 2022',
  '2022',
  '1 Season · Origin',
  100,
  'PG-Love',
  'How two distinct life paths crossed in the most serendipitous manner. A story of chance encounters, lingering looks, and an unmistakable spark.',
  'I didn’t believe in coincidences until the day you walked into my life. Every little decision, every delayed train, every friend group overlap aligned down to the exact second. When our eyes met and you introduced yourself, there was a strange, peaceful certainty that said: "Pay attention. This one changes everything."',
  'City Center Plaza',
  array['Origin', 'Destiny', 'First Sight', 'The Spark'],
  'from-red-950 via-rose-950 to-neutral-950',
  null,
  1,
  true,
  true
),
(
  'story-2',
  'Chapter 2: First Awkward Coffee Date',
  '3 Hours, Cold Latte, Warm Smiles',
  'our-story',
  'October 28, 2022',
  '2022',
  '1 Season · Butterflies',
  99,
  'PG-Love',
  'We said we would grab a quick 30-minute coffee. Three hours later, our cups were bone cold and neither of us had checked our phones even once.',
  'I was nervous enough that I changed my shirt three times before leaving the house. We sat in a corner table by the bookstore window. We talked about high school embarrassments, favorite childhood cartoons, family quirks, and weird travel bucket lists. By the time the barista started putting chairs up on tables to close, we were still deep in conversation.',
  'Corner Table Cafe',
  array['Butterflies', 'Deep Talks', 'First Date', 'Chemistry'],
  'from-amber-950 via-orange-950 to-neutral-950',
  null,
  2,
  true,
  true
),
(
  'story-3',
  'Chapter 3: When We Made It Official',
  'The Best Title in the World',
  'our-story',
  'December 24, 2022',
  '2022',
  '1 Season · Commitment',
  100,
  'PG-Love',
  'Under festive winter lights, after ice skating and warm roasted chestnuts. The gentle, honest conversation where we promised each other all our tomorrows.',
  'My hands were freezing, but holding yours felt like sitting next to a warm hearth. I told you that I didn’t just like spending time with you—I wanted you by my side through all the high peaks and quiet valleys. When you nodded and beamed with that radiant smile, my whole world clicked into place.',
  'Old Town Ice Rink',
  array['Official', 'Winter Romance', 'Promises', 'Soulmates'],
  'from-rose-950 via-pink-950 to-neutral-950',
  null,
  3,
  true,
  true
),
(
  'story-4',
  'Chapter 4: The First Big Vacation',
  'Lost Luggage, Mountain Sunrises & Love',
  'our-story',
  'May 2023',
  '2023',
  '1 Season · Adventure',
  98,
  'PG-Love',
  'Traveling together for the first time: navigating airport delays, sharing a tiny cabin in the pines, and realizing you are my ultimate travel partner for life.',
  'They say travel is the ultimate relationship litmus test. Between a flat tire in the pouring rain and sharing one toothbrush because the airline delayed our bags, we didn’t fight once—we just laughed until our ribs ached. Waking up to mountain pine mist with you curled against my side was heaven.',
  'Pine Ridge Mountain Cabin',
  array['Adventure', 'Travel Duo', 'Mountains', 'Unbreakable'],
  'from-emerald-950 via-stone-900 to-neutral-950',
  null,
  4,
  false,
  false
),
(
  'story-5',
  'Chapter 5: Moving In Together',
  'Keys to the Same Front Door',
  'our-story',
  'August 2024',
  '2024',
  '1 Season · Home',
  99,
  'PG-Love',
  'Merging two different lives, book collections, and quirky habits under one roof. Turning four walls into our personal sanctuary.',
  'Turning the key in the lock of our very own apartment. Seeing our shoes side-by-side on the mat. Waking up every single morning knowing that "goodbye, see you this weekend" is replaced forever by "good morning, my love."',
  'Our Sweet Home',
  array['Milestone', 'Cozy Living', 'Home Sweet Home', 'Forever'],
  'from-indigo-950 via-slate-900 to-neutral-950',
  null,
  5,
  true,
  true
),
(
  'story-6',
  'Chapter 6: Forever & Always (Ongoing)',
  'The Best is Yet to Come',
  'our-story',
  'Every Day Ahead',
  '2025+',
  'Infinity · No End in Sight',
  100,
  'PG-Love · Masterpiece',
  'All the unwritten adventures, future wedding bells, dream homes, passport stamps, and growing gray and silly together.',
  'I love who we were, I adore who we are right now, and I cannot wait to meet who we become together 30, 40, and 50 years from now. As long as I have your hand in mine, every tomorrow looks brighter than any yesterday.',
  'The Future We Are Building',
  array['Forever', 'Future Dreams', 'Unconditional', 'Endless'],
  'from-red-950 via-amber-950 to-neutral-950',
  null,
  6,
  true,
  true
)
on conflict (id) do nothing;

-- 2. CONTINUE WATCHING: MEMORIES
insert into public.memories (
  id, title, subtitle, category, date, year, duration, match_score, rating,
  synopsis, full_story, location, tags, fallback_gradient, progress, isInWatchlist
) values
(
  'memory-1',
  'The Rainy Ramen Stall in the Alley',
  'Season 2 · Episode 3',
  'memories',
  'November 18, 2023',
  '2023',
  '2h 15m',
  98,
  'PG-Love',
  'We were drenched to the bone after an unexpected downpour, running under our single jacket into a tiny 6-seat ramen shop. The warm broth, fogged-up glasses, and laughing our heads off.',
  'The skies opened up with zero warning. You refused to let your hair get ruined, so we sprinted through three blocks of puddle splash. When we sat on those wobbly wooden stools sipping piping hot tonkotsu broth, your cheeks were rosy pink and your laugh was the sweetest thing I had ever heard. That night proved that with you, even bad weather is magic.',
  'Hidden Noodle Bar, Downtown',
  array['Rainy Nights', 'Comfort Food', 'Pure Joy', 'Unplanned'],
  'from-blue-950 via-slate-900 to-neutral-950',
  72,
  true
),
(
  'memory-2',
  'First Apartment Painting War',
  'Season 3 · Episode 1',
  'memories',
  'August 12, 2024',
  '2024',
  '5h 30m',
  99,
  'TV-MA (Messy & Cute)',
  'What started as a serious mission to paint the bedroom "Warm Terracotta" quickly devolved into white paint fingerprints on noses and living room karaoke.',
  'We swore we would be disciplined adults. By hour two, you dabbed a drop of paint on my forehead with a paintbrush, and all rules vanished. We ended up with paint in our hair, on our elbows, and on the hardwood floors, singing along to 90s throwback playlists while eating cold takeout pizza.',
  'Our First Apartment',
  array['New Beginnings', 'Playful', 'Home', 'Chaos'],
  'from-rose-950 via-amber-950 to-neutral-950',
  45,
  true
),
(
  'memory-3',
  'Sunset Beach Drive & Sand Everywhere',
  'Season 2 · Episode 7',
  'memories',
  'July 4, 2023',
  '2023',
  '6h 10m',
  97,
  'PG-Love',
  'Windows rolled all the way down, ocean breeze tangling your hair, golden hour turning the coast into liquid gold, and finding beach sand in our shoes for weeks.',
  'There is a specific feeling of freedom that exists only when you are in the passenger seat with your feet on the dashboard, singing your heart out. We watched the sun dip below the horizon until the sky melted into deep purple and twilight stars. You rested your head against my shoulder, and I remember wishing I could pause the clock forever.',
  'Pacific Coast Highway',
  array['Road Trip', 'Golden Hour', 'Ocean Breeze', 'Freedom'],
  'from-amber-950 via-red-950 to-neutral-950',
  90,
  false
),
(
  'memory-4',
  'Midnight Kitchen Slow Dance',
  'Season 3 · Episode 4',
  'memories',
  'December 28, 2024',
  '2024',
  '35m',
  100,
  'PG-Love',
  'Past 1:00 AM on a freezing winter night. Soft acoustic jazz playing from the phone speaker on the counter while we danced barefoot on the cold tile.',
  'No fancy dress, no audience, no occasion. Just an unprompted slow dance in pajama pants under the soft yellow glow of the refrigerator light. You wrapped your arms around my neck and rested your ear against my chest. In that quiet kitchen, the entire chaotic world fell completely silent.',
  'Our Kitchen',
  array['Intimate', 'Quiet Nights', 'Pure Romance', 'Unforgettable'],
  'from-indigo-950 via-purple-950 to-neutral-950',
  30,
  true
),
(
  'memory-5',
  'Airport Reunion Tearjerker',
  'Season 2 · Episode 1',
  'memories',
  'March 15, 2023',
  '2023',
  '1h 45m',
  99,
  'PG-Love',
  'After three agonizing weeks apart for work travel. Standing by terminal gate B, spotting your smile in the crowd, and dropping bags to run into each other.',
  'Those three weeks felt like three centuries. Standing at arrivals checking the flight status every 15 seconds. The moment the double doors slid open and I saw you walking out looking around for me, my heart skipped five beats. You dropped your tote bag and collided into me with the tightest hug in human history.',
  'Terminal 2 Arrivals Gate',
  array['Reunion', 'Happy Tears', 'Airport Moments', 'Deep Love'],
  'from-emerald-950 via-teal-950 to-neutral-950',
  60,
  false
)
on conflict (id) do nothing;

-- 3. LITTLE THINGS COLLECTION
insert into public.memories (
  id, title, subtitle, category, date, year, duration, match_score, rating,
  synopsis, full_story, tags, fallback_gradient, is_in_watchlist
) values
(
  'little-1',
  'The Way Your Nose Scrunches',
  'Whenever You Genuinely Belly Laugh',
  'little-things',
  'Observed Daily',
  'Every Day',
  'Instant Mood Booster',
  100,
  'Pure Sunshine',
  'That unmistakable, adorable crinkle of your nose whenever something catches you completely off-guard with pure humor.',
  'You have a polite social laugh, but then you have your real, unrestrained belly laugh. Your eyes close into happy crescent moons, your nose scrunches up, and you snort just a little bit. It is the single most endearing sight in the galaxy and I make it my personal mission to trigger it every single day.',
  array['Quirks', 'Laughter', 'Pure Joy', 'Adorable'],
  'from-pink-950 via-rose-950 to-neutral-950',
  true
),
(
  'little-2',
  'Hoodie Thief In Broad Daylight',
  '90% of My Wardrobe Is Now Yours',
  'little-things',
  'Every Autumn & Winter',
  'Every Season',
  'Permanent Possession',
  99,
  'Cute Criminal',
  'How my oversized hoodies mysteriously migrate to your side of the closet and permanently smell like vanilla and lavender.',
  'I will search high and low for my favorite grey crewneck only to find you curled up on the sofa swimming in sleeves that are 6 inches too long for your arms. You look up with zero guilt and say, "It’s not yours anymore, it’s ours." Keep them all. You look ten times cuter in them than I ever could.',
  array['Cozy', 'Hoodies', 'Cute Habits', 'Wardrobe Heist'],
  'from-amber-950 via-neutral-900 to-neutral-950',
  false
),
(
  'little-3',
  'The Sleepy Morning Voice',
  'Whispering "Just Five More Minutes..."',
  'little-things',
  'Every Dawn',
  'Perpetual',
  'Warmest 5 Minutes',
  98,
  'Cozy Cuddles',
  'That soft, raspy, half-asleep mumble when the alarm goes off and you burrow deeper into the blankets like a baby bear.',
  'You are definitely not a morning drill sergeant. Waking you up is an art form of gentle back rubs, forehead kisses, and brewing coffee that smells good enough to coax you out of sleep. When you groggily whisper that you love me before you even have your eyes open, my heart melts into soup.',
  array['Mornings', 'Bedhead', 'Sleepy Cuddles', 'Gentle Love'],
  'from-purple-950 via-indigo-950 to-neutral-950',
  false
),
(
  'little-4',
  'The Happy Food Dance',
  'When The Dish Finally Lands On The Table',
  'little-things',
  'Every Meal We Love',
  'Routine Miracle',
  '15 Seconds of Happiness',
  99,
  'Wholesome',
  'The tiny shoulder shimmy and foot wiggle you do when our order arrives at the restaurant table.',
  'The waiter sets down the steaming plate of truffle pasta or fresh sushi. You pause, clasp your hands together, and do a rhythmic little shoulder shimmy with a wide grin on your face. Watching how much joy you extract from good food and little treats makes being with you an endless celebration.',
  array['Foodie Love', 'Happy Dance', 'Wholesome', 'Cute Habits'],
  'from-orange-950 via-rose-950 to-neutral-950',
  true
),
(
  'little-5',
  'Your Fierce, Unwavering Kindness',
  'How You Care for Every Living Thing',
  'little-things',
  'A Heart of Pure Gold',
  'Always',
  'Infinite Grace',
  100,
  'Guardian Angel',
  'The gentle empathy you give to stray dogs, overwhelmed baristas, stressed friends, and especially to me when I am down.',
  'Beyond how beautiful you are on the outside, your soul is made of pure light. You notice when someone is having a rough day and give them genuine words of encouragement. You listen without judgment. Having you as my partner makes me want to be a kinder, better human being every single day.',
  array['Kindness', 'Big Heart', 'Empathy', 'Inspiration'],
  'from-emerald-950 via-teal-950 to-neutral-950',
  true
)
on conflict (id) do nothing;

-- 4. PLACES & EXPERIENCES LIST
insert into public.memories (
  id, title, subtitle, category, date, year, duration, match_score, rating,
  synopsis, full_story, location, tags, fallback_gradient, list_status, is_in_watchlist
) values
(
  'place-1',
  'The Seaside Cliffside Sunset Walk',
  'Big Sur Highway Coastal Vista',
  'places-list',
  'Completed · June 2023',
  '2023',
  'Full Afternoon',
  99,
  'Visited Memory',
  'Walking along the rugged coastline while waves crashed 200 feet below us and the golden mist painted our faces.',
  'We found a secret turnout off the highway and climbed a small dirt path until we were sitting on a flat stone ledge above the Pacific Ocean. The salt air in your hair, holding your hand wrapped inside my jacket pocket, watching the sun dip into the sea.',
  'Big Sur, California',
  array['Visited', 'Coastline', 'Golden Hour', 'Ocean'],
  'from-cyan-950 via-blue-950 to-neutral-950',
  'visited',
  true
),
(
  'place-2',
  'Cozy Cabin in the Deep Winter Woods',
  'Woodstove, Snowfall & Endless Cocoa',
  'places-list',
  'Completed · January 2024',
  '2024',
  '3 Nights',
  100,
  'Visited Memory',
  'Zero cell service, a crackling cedar fire in the cast-iron stove, 10 inches of fresh powdery snow outside, and board games.',
  'The world disappeared for three whole days. No work emails, no notifications, no obligations. Just baking cookies from scratch, building a pathetic snowperson outside on the deck, and reading under a pile of knit blankets while the woodstove popped and crackled.',
  'Cascade Pines, Cabin 12',
  array['Visited', 'Snow Cabin', 'Cozy', 'Offline Paradise'],
  'from-slate-900 via-stone-900 to-neutral-950',
  'visited',
  true
),
(
  'place-3',
  'Tuscany Countryside Pasta Cooking Class',
  'Rolling Dough in an Ancient Olive Grove',
  'places-list',
  'Dream Bucket List · Autumn Goal',
  'Target: Next Trip',
  '1 Week Dream',
  99,
  'Bucket List Goal',
  'Renting a rustic stone villa with red clay tiles, learning authentic pasta rolling from an Italian nonna, and drinking chianti.',
  'Our dream trip together: waking up to cypress trees and rolling green hills, biking into the local village for fresh figs and pecorino, and flouring our hands as we learn how to make fresh handmade tagliatelle from scratch together.',
  'Val d’Orcia, Tuscany, Italy',
  array['Bucket List', 'Italy Dream', 'Cooking Together', 'Wanderlust'],
  'from-amber-950 via-yellow-950 to-neutral-950',
  'bucket-list',
  true
),
(
  'place-4',
  'Glass Igloo Aurora Borealis Night',
  'Stargazing at the Northern Lights from Bed',
  'places-list',
  'Dream Bucket List · Winter Wonderland',
  'Target: Next Winter',
  '4 Days',
  98,
  'Bucket List Goal',
  'Sleeping under a heated glass dome in Lapland, watching green auroral ribbons dance across the Arctic night sky wrapped in each other.',
  'Ever since you showed me that video of the Northern Lights, it became an unshakeable promise. We will go there, sip hot spiced cider, pet Finnish reindeer, and fall asleep watching emerald green and violet auroras sweep above our heads.',
  'Rovaniemi, Lapland',
  array['Bucket List', 'Northern Lights', 'Arctic Dream', 'Magic'],
  'from-teal-950 via-emerald-950 to-neutral-950',
  'bucket-list',
  true
)
on conflict (id) do nothing;

-- 5. SECRET VAULT EPISODES
insert into public.memories (
  id, title, subtitle, category, date, year, duration, match_score, rating,
  synopsis, full_story, tags, fallback_gradient, is_secret, secret_passcode, letter_content, is_in_watchlist
) values
(
  'vault-1',
  'The Letter I Wrote On Our Anniversary',
  'To The Love Of My Entire Life',
  'secret-vault',
  'Anniversary Special',
  'For Your Eyes Only',
  'Private Letter · 5 min read',
  100,
  '18+ PG-Love · Classified',
  'A heartfelt, raw confession of how much you mean to me, what you brought into my world, and my unwavering commitment to you.',
  'Click to unlock the sealed letter with our anniversary code (Hint: default 1402 or tap reveal). Contains a handwritten note written straight from my heart.',
  array['Love Letter', 'Personal', 'Classified', 'Anniversary'],
  'from-rose-950 via-red-950 to-neutral-950',
  true,
  '1402',
  'My Dearest,

If you are reading this, it means you opened our secret vault.

I wanted to create this corner of the internet just for us—away from the noise of the world, away from social media feeds and endless algorithms. A place where our memories live in cinematic glory, because our story deserves nothing less than the premiere spotlight.

Before you, I lived in black and white. You brought color, spontaneity, softness, and an astonishing amount of warmth into my days. You turned boring grocery runs into adventures. You turned bad days into quiet moments of solace where everything felt manageable again as long as I could hold your hand.

Thank you for loving me on my best days, and especially on the days where I felt tired or doubted myself. Thank you for your fierce loyalty, your radiant humor, and the grace with which you walk through this life.

No matter where our story takes us, I promise to always listen, to always choose you, to make you laugh until your cheeks hurt, and to love you more tomorrow than I do today.

Forever and always yours,
Your Biggest Fan & Forever Partner ❤️',
  true
)
on conflict (id) do nothing;

-- 6. STORY EPISODES FOR FEATURED SHOW
insert into public.story_chapters (id, memory_id, episode_number, title, duration, date, description, gradient)
values
(
  'ep-s1-1',
  'featured-story-of-us',
  1,
  'Pilot: The Day Our Worlds Collided',
  '3 hours of talking',
  'October 14',
  'Two strangers meet on an ordinary Tuesday. Casual conversation about favorite songs and dreams turns into a 3-hour marathon where time simply stood still.',
  'from-amber-900 to-stone-900'
),
(
  'ep-s1-2',
  'featured-story-of-us',
  2,
  'The First Real Date (And Butterflied Stomachs)',
  'Entire evening',
  'November 2',
  'Heart pounding while waiting for you to walk into the cafe. The moment you smiled, all rehearsed lines flew out the window. We walked for miles just to keep talking.',
  'from-rose-900 to-neutral-900'
),
(
  'ep-s2-1',
  'featured-story-of-us',
  3,
  'When It Became Official: No Turning Back',
  'A lifetime in a moment',
  'December 24',
  'Under the quiet glow of holiday streetlights, holding hands and finally saying out loud what both our hearts already knew. The easiest "yes" of my life.',
  'from-red-900 to-zinc-900'
),
(
  'ep-s2-2',
  'featured-story-of-us',
  4,
  'The Great Roadtrip & Midnight Gas Station Snacks',
  '420 miles',
  'May 18',
  'Wrong turns, screaming 2000s pop anthems at the top of our lungs, and discovering that your taste in gas station gummy worms is questionable but deeply endearing.',
  'from-orange-950 to-stone-900'
),
(
  'ep-s3-1',
  'featured-story-of-us',
  5,
  'Moving In: Assembling IKEA Without Breaking Up',
  '72 hours of boxes',
  'August 10',
  'Living out of cardboard boxes, ordering pizza on the living room floor, and learning that you need 14 pillows while I only need one. Best home ever built.',
  'from-emerald-950 to-neutral-950'
),
(
  'ep-s4-1',
  'featured-story-of-us',
  6,
  'The Unwritten Chapters (Forever & Always)',
  'The Rest of Our Lives',
  'Today & Beyond',
  'Every morning coffee, every quiet cuddle after an exhausting week, and all the grand adventures we haven’t even planned yet. The best is yet to come.',
  'from-purple-950 to-neutral-950'
)
on conflict (id) do nothing;

-- 7. LOVE COUPONS
insert into public.love_notes (id, memory_id, title, perk, terms, redeemed)
values
(
  'coup-1',
  'vault-1',
  'One Emergency Midnight Ice Cream Run',
  'Redeem anytime: I will drive to any convenience store or drive-thru in pajamas to get your exact favorite ice cream or sweet treat.',
  'No questions asked. Valid 24/7/365.',
  false
),
(
  'coup-2',
  'vault-1',
  'Full VIP Foot & Back Massage (45 Mins)',
  'Includes soothing lavender oil, ambient lighting, calm music, and zero complaining.',
  'Valid on any stressful day after work.',
  false
),
(
  'coup-3',
  'vault-1',
  'Ultimate Movie & Snack Dictator Card',
  'You pick the movie (even if it is a cheesy romance I claimed not to like), you pick the snacks, and I will not touch my phone once.',
  'Unlimited popcorn refills included.',
  false
),
(
  'coup-4',
  'vault-1',
  'Breakfast in Bed Sunday Service',
  'Fresh hot coffee, fluffy pancakes or eggs made to order, served directly to you while you stay wrapped in blankets.',
  'Chef does all dish cleaning immediately.',
  false
)
on conflict (id) do nothing;
