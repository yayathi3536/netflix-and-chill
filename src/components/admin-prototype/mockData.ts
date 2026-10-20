import {
  PrototypeMemory,
  PrototypePhoto,
  PrototypeLetter,
  PrototypeChapter,
  PrototypeSiteContent,
  PrototypeCoupon,
  PrototypeActivity,
  PrototypeSettings,
} from './types';

export const INITIAL_MOCK_MEMORIES: PrototypeMemory[] = [
  {
    id: 'mem-1',
    title: 'The Stargazing Midnight Drive',
    category: 'our-story',
    date: '2023-08-14',
    year: '2023',
    duration: '4h 20m',
    matchScore: 99,
    rating: 'TV-MA (Mostly Adorable)',
    synopsis: 'We packed a fleece blanket, hot chai, and drove until city lights faded into the Milky Way.',
    fullStory:
      'We left the city at 11:30 PM with zero map directions, just chasing the dark sky. Wrapped in an oversized wool blanket on the hood of the car, we spotted four shooting stars and made the exact same secret wish.',
    location: 'Skyline Ridge Vista',
    tags: ['Stargazing', 'Roadtrip', 'Late Night', 'First Summer'],
    coverUrl:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    isFeatured: true,
    status: 'published',
    createdAt: '2023-08-15T02:00:00Z',
  },
  {
    id: 'mem-2',
    title: 'The Rainy Kyoto Matcha Cafe',
    category: 'memories',
    date: '2024-04-18',
    year: '2024',
    duration: '2h 15m',
    matchScore: 98,
    rating: 'PG-Love',
    synopsis: 'Drenched in sudden spring rain, ducking into an old wooden cafe that smelled of roasted tea.',
    fullStory:
      'The rain started pounding against the cobblestones without warning. We squeezed under a tiny umbrella laughing hysterically, dashed into a 90-year-old wooden teahouse, and split a steaming bowl of hot dango.',
    location: 'Gion District, Kyoto',
    tags: ['Travel', 'Kyoto', 'Rainy Day', 'Matcha'],
    coverUrl:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    isFeatured: false,
    status: 'published',
    createdAt: '2024-04-19T10:30:00Z',
  },
  {
    id: 'mem-3',
    title: 'Our First Kitchen Disaster Cake',
    category: 'little-things',
    date: '2023-11-04',
    year: '2023',
    duration: '3h 40m',
    matchScore: 96,
    rating: 'PG-Chaos',
    synopsis: 'Flour on our noses, an oven timer that never beeped, and the funniest burnt chocolate cake ever made.',
    fullStory:
      'We tried baking a triple-layer molten chocolate lava cake for an anniversary countdown. The middle collapsed into a volcano crater, flour was literally everywhere including the ceiling, yet it tasted like pure joy.',
    location: 'Our Cozy Apartment Kitchen',
    tags: ['Baking', 'Laughs', 'Quirks', 'Chocolate'],
    coverUrl:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80',
    isFeatured: false,
    status: 'published',
    createdAt: '2023-11-05T01:15:00Z',
  },
  {
    id: 'mem-4',
    title: 'Sunrise Over the Ocean Cliffs',
    category: 'places-list',
    date: '2024-09-22',
    year: '2024',
    duration: '1h 30m',
    matchScore: 100,
    rating: 'TV-Epic',
    synopsis: 'Waking up at 5:00 AM in freezing mist just to watch the sky catch fire in gold and lavender.',
    fullStory:
      'Standing at the precipice with the sound of roaring waves beneath us. You held both my cold hands inside your warm oversized coat pocket while the first rays of sunlight bathed the sea.',
    location: 'Big Sur Coastline',
    tags: ['Sunrise', 'Bucket List', 'Coastline', 'Golden Hour'],
    coverUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    isFeatured: false,
    status: 'published',
    createdAt: '2024-09-23T06:00:00Z',
  },
  {
    id: 'mem-5',
    title: 'The Secret Vault Keepsake Box',
    category: 'secret-vault',
    date: '2024-12-31',
    year: '2024',
    duration: 'Forever',
    matchScore: 100,
    rating: 'Vault-Protected',
    synopsis: 'Ticket stubs, dried wildflowers, handwritten napkins, and the dreams we swore to protect.',
    fullStory:
      'A wooden cedar box tucked behind the bookshelf where we stash boarding passes, cinema stubs with smeared dates, polaroid strips from street corners, and letters written at 3:00 AM.',
    location: 'The Keepsake Shelf',
    tags: ['Secrets', 'Keepsakes', 'Anniversary', 'Vault'],
    coverUrl:
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
    isFeatured: false,
    status: 'draft',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'mem-6',
    title: 'Acoustic Guitar On The Rooftop',
    category: 'memories',
    date: '2024-06-10',
    year: '2024',
    duration: '2h 00m',
    matchScore: 97,
    rating: 'PG-Cozy',
    synopsis: 'Singing off-key under fairy lights with city traffic humming quietly six stories below.',
    fullStory:
      'We carried two folding chairs and string lights up the fire escape. Neither of us could play guitar perfectly, but singing our favorite indie songs until midnight made the entire world feel small and safe.',
    location: 'Rooftop Terrace',
    tags: ['Music', 'Fairy Lights', 'Acoustic', 'Summer Breeze'],
    coverUrl:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    isFeatured: false,
    status: 'published',
    createdAt: '2024-06-11T12:00:00Z',
  },
];

export const INITIAL_MOCK_PHOTOS: PrototypePhoto[] = [
  {
    id: 'photo-1',
    title: 'Golden Sunset at the Pier',
    caption: 'The moment the sky turned into melted peach candy.',
    category: 'trips',
    url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80',
    date: '2024-07-15',
    location: 'Santa Monica Boardwalk',
    createdAt: '2024-07-16T18:00:00Z',
  },
  {
    id: 'photo-2',
    title: 'Fairy Lights Celebration',
    caption: 'Celebrating our anniversary dinner under hanging garden lights.',
    category: 'celebrations',
    url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
    date: '2024-09-01',
    location: 'The Glasshouse Greenhouse',
    createdAt: '2024-09-02T20:00:00Z',
  },
  {
    id: 'photo-3',
    title: 'Laughing in the Rain',
    caption: 'Zero regrets about not bringing a second raincoat.',
    category: 'candid',
    url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
    date: '2023-10-12',
    location: 'Central Park Walkway',
    createdAt: '2023-10-13T14:30:00Z',
  },
  {
    id: 'photo-4',
    title: 'Snowy Mountain Getaway',
    caption: 'Sipping cinnamon hot cocoa after the first snowfall of the season.',
    category: 'trips',
    url: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&w=800&q=80',
    date: '2023-12-24',
    location: 'Aspen Cabin',
    createdAt: '2023-12-25T09:00:00Z',
  },
  {
    id: 'photo-5',
    title: 'The Promise Key Milestone',
    caption: 'Engraved with coordinates to the exact bench where we confessed our love.',
    category: 'milestones',
    url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
    date: '2024-02-14',
    location: 'Botanical Overlook',
    createdAt: '2024-02-15T11:00:00Z',
  },
  {
    id: 'photo-6',
    title: 'Late Night Bookstore Run',
    caption: 'Hidden among the poetry aisle at 10 PM on a quiet Thursday.',
    category: 'candid',
    url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
    date: '2024-05-09',
    location: 'Strand Books',
    createdAt: '2024-05-10T16:00:00Z',
  },
  {
    id: 'photo-7',
    title: 'Desert Camping under the Stars',
    caption: 'Campfire embers and the sound of wind whispering through canyon rocks.',
    category: 'trips',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    date: '2024-11-19',
    location: 'Joshua Tree Park',
    createdAt: '2024-11-20T08:00:00Z',
  },
  {
    id: 'photo-8',
    title: 'Our Handcrafted Scrapbook',
    caption: 'Glue sticks, vintage stamps, and 365 polaroids glued with love.',
    category: 'milestones',
    url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
    date: '2024-12-30',
    location: 'Studio Desk',
    createdAt: '2024-12-31T22:00:00Z',
  },
];

export const INITIAL_MOCK_LETTERS: PrototypeLetter[] = [
  {
    id: 'let-1',
    title: 'A Letter for 3:00 AM on a Tuesday',
    recipient: 'To My Favorite Person in the Entire Universe',
    date: '2024-08-14',
    readTime: '3 min read',
    status: 'published',
    content: `If you are reading this in the quiet hours of the night when the world is asleep and your mind is wandering, I want you to remember something simple:

From the second you stepped into my life, everything changed its color. The mundane became cinematic. Rainy bus stops became poetry. Even the sound of kettle whistling in the morning sounded like our personal soundtrack.

No matter how overwhelming tomorrow feels or how fast the world spins, you will always have a home in my arms. You are my greatest adventure and my softest landing.

Forever yours,
Always & Beyond.`,
    createdAt: '2024-08-14T19:00:00Z',
  },
  {
    id: 'let-2',
    title: '1,000 Days of Us (And Counting)',
    recipient: 'To The Girl Who Stole My Heart in Autumn',
    date: '2024-10-01',
    readTime: '4 min read',
    status: 'published',
    content: `Today marks one thousand days since we first agreed that life was better when we took on the world together.

I still remember the first time you laughed so hard you snorted and tried to hide your face behind your hands. I fell in love with you in that exact heartbeat. 

Thank you for being my patient listener, my late-night chef, my roadtrip navigator, and the person who makes me want to be better every single day. Here is to the next ten thousand days.`,
    createdAt: '2024-10-01T08:00:00Z',
  },
  {
    id: 'let-3',
    title: 'When You Need a Gentle Reminder',
    recipient: 'To My Sunshine on Overcast Days',
    date: '2024-11-12',
    readTime: '2 min read',
    status: 'draft',
    content: `Take a deep breath. Drop your shoulders. Drink a glass of water.

You carry so much with so much grace, but you do not have to carry it alone. Whatever doubt is whispering in your ear today, let my voice be louder: you are brilliant, you are cherished, and I believe in you more than words could ever describe.`,
    createdAt: '2024-11-12T14:00:00Z',
  },
  {
    id: 'let-4',
    title: 'The Unwritten Vows',
    recipient: 'To My Eternal Partner in Crime',
    date: '2024-12-25',
    readTime: '5 min read',
    status: 'published',
    content: `I promise to always save you the last fry from the carton. 
I promise to listen to your voice memos even when they are ten minutes long.
I promise to hold your hand through the storms, celebrate every tiny win like it’s a World Cup victory, and love you fiercely in all seasons.`,
    createdAt: '2024-12-25T21:00:00Z',
  },
];

export const INITIAL_MOCK_CHAPTERS: PrototypeChapter[] = [
  {
    id: 'chap-1',
    order: 1,
    title: 'The First Spark: How We Met',
    duration: '22 min',
    date: 'Spring 2022',
    description: 'An accidental conversation over spilled iced latte that turned into a four-hour walk.',
    storyContent:
      'Neither of us planned to stay at the coffee shop for more than five minutes. But when you laughed at my terrible pun and asked what book I was reading, time completely stopped ticking.',
    coverUrl:
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    createdAt: '2022-04-10T12:00:00Z',
  },
  {
    id: 'chap-2',
    order: 2,
    title: 'The Summer of Lost Maps',
    duration: '28 min',
    date: 'Summer 2022',
    description: 'Getting hopelessly lost along the northern highway with no signal and an auxiliary cord.',
    storyContent:
      'Our GPS died two hours before dusk. We took random exits, found a roadside diner with neon lights, and ate blueberry pie while listening to vintage 80s synth tracks on repeat.',
    coverUrl:
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    createdAt: '2022-07-20T15:00:00Z',
  },
  {
    id: 'chap-3',
    order: 3,
    title: 'Moving Boxes & Fairy Lights',
    duration: '35 min',
    date: 'Winter 2023',
    description: 'Our first shared apartment keys, eating takeout on the living room floor before the sofa arrived.',
    storyContent:
      'Surrounded by brown cardboard boxes taped shut with red tape. We did not even have forks, so we ate takeout noodles with plastic spoons under string lights taped to the window frame.',
    coverUrl:
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    createdAt: '2023-01-15T18:00:00Z',
  },
  {
    id: 'chap-4',
    order: 4,
    title: 'Under the Tokyo Neon',
    duration: '42 min',
    date: 'Spring 2024',
    description: 'Chasing midnight ramen counters, subway ticket mysteries, and cherry blossom petals.',
    storyContent:
      'Dodging umbrellas across Shibuya crossing, discovering a hidden jazz bar behind an unmarked iron door, and walking back to our hotel as pink sakura petals drifted through the headlights.',
    coverUrl:
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    createdAt: '2024-04-25T11:00:00Z',
  },
  {
    id: 'chap-5',
    order: 5,
    title: 'Forever & The Next Galaxy',
    duration: 'Ongoing',
    date: 'Present & Beyond',
    description: 'Writing the next chapters hand-in-hand, knowing the best is yet to come.',
    storyContent:
      'Every chapter before this was just the prologue. Here is where the real story begins—building our dream house, adopting that golden retriever, and loving each other through all the pages ahead.',
    coverUrl:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    status: 'draft',
    createdAt: '2025-01-01T00:00:00Z',
  },
];

export const INITIAL_MOCK_SITE_CONTENT: PrototypeSiteContent = {
  heroTitle: 'THE STORY OF US',
  heroSubtitle: 'OUR UNIVERSE ORIGINAL SERIES • SEASON 2',
  heroTagline:
    'Two hearts, endless galaxies, and a million little memories written in the stars.',
  heroCtaText: 'Relive The Journey',
  heroBackdropUrl:
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=80',
  seriesHeading: 'Original Series: Our Timeline',
  moviesHeading: 'Blockbuster Memories & Relives',
  quirksHeading: 'Little Quirks & Favorite Habits',
  placesHeading: 'Our Bucket List & Visited Heavens',
  partner1Name: 'Karan',
  partner2Name: 'My Sunshine',
  anniversaryDate: 'October 14, 2022',
  milestoneQuote: 'In all the universe and all the timelines, finding you was my destiny.',
};

export const INITIAL_MOCK_COUPONS: PrototypeCoupon[] = [
  {
    id: 'cp-1',
    title: 'Late Night Ice Cream Run',
    description: 'Redeemable anytime after 10 PM. Double scoops with waffle cones guaranteed.',
    terms: 'Valid 24/7. No objections allowed, pajamas acceptable attire.',
    validUntil: 'Forever',
    status: 'active',
    category: 'food',
    createdAt: '2024-01-10T12:00:00Z',
  },
  {
    id: 'cp-2',
    title: 'Full Back Massage (No Time Limit)',
    description: 'Warm lavender oil, calming lo-fi music, and no complaining about sore thumbs.',
    terms: 'Minimum 30 minutes, maximum whenever you drift off to sleep.',
    validUntil: '2025-12-31',
    status: 'active',
    category: 'romance',
    createdAt: '2024-02-14T15:00:00Z',
  },
  {
    id: 'cp-3',
    title: 'Win Any Argument Free Pass',
    description: 'Instant surrender card. You are 100% right, I am 100% wrong, no rebuttals.',
    terms: 'One-time use per season. Must be presented with a victorious smirk.',
    validUntil: 'Forever',
    status: 'redeemed',
    category: 'chill',
    createdAt: '2024-03-20T09:00:00Z',
  },
  {
    id: 'cp-4',
    title: 'Surprise Roadtrip Adventure',
    description: 'Pack a weekend bag in 20 minutes without asking where we are driving.',
    terms: 'Includes all playlists, snacks, and scenic roadside stops.',
    validUntil: '2026-06-30',
    status: 'active',
    category: 'adventure',
    createdAt: '2024-05-01T16:00:00Z',
  },
  {
    id: 'cp-5',
    title: 'Breakfast In Bed Royale',
    description: 'Fluffy buttermilk pancakes, fresh strawberries, hot coffee, and zero kitchen cleanup for you.',
    terms: 'Available on any Saturday or Sunday morning.',
    validUntil: 'Forever',
    status: 'active',
    category: 'food',
    createdAt: '2024-06-12T10:00:00Z',
  },
];

export const INITIAL_MOCK_ACTIVITIES: PrototypeActivity[] = [
  {
    id: 'act-1',
    action: 'create',
    targetType: 'Memory',
    targetTitle: 'Acoustic Guitar On The Rooftop',
    timestamp: '2 hours ago',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    id: 'act-2',
    action: 'update',
    targetType: 'Letter',
    targetTitle: '1,000 Days of Us (And Counting)',
    timestamp: 'Yesterday at 8:15 PM',
    badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
  },
  {
    id: 'act-3',
    action: 'create',
    targetType: 'Photo',
    targetTitle: 'Our Handcrafted Scrapbook',
    timestamp: '2 days ago',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    id: 'act-4',
    action: 'update',
    targetType: 'Content',
    targetTitle: 'Hero Billboard Tagline',
    timestamp: '3 days ago',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  },
  {
    id: 'act-5',
    action: 'create',
    targetType: 'Chapter',
    targetTitle: 'Forever & The Next Galaxy',
    timestamp: '5 days ago',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    id: 'act-6',
    action: 'update',
    targetType: 'Coupon',
    targetTitle: 'Win Any Argument Free Pass',
    timestamp: '1 week ago',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  },
];

export const DEFAULT_PROTOTYPE_SETTINGS: PrototypeSettings = {
  themeAccent: 'netflix-red',
  contentDensity: 'comfortable',
  dateFormat: 'MMM D, YYYY',
  autoSaveDrafts: true,
  enableSoundEffects: true,
};
