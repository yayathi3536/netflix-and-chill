import { SiteContentItem, SiteContentMap } from '../types';

export const DEFAULT_SITE_CONTENT_LIST: SiteContentItem[] = [
  // HERO SECTION
  {
    key: 'hero_title',
    section: 'hero',
    label: 'Hero Billboard Title',
    value: 'The Story of Us',
    type: 'text',
  },
  {
    key: 'hero_subtitle',
    section: 'hero',
    label: 'Hero Subtitle / Season',
    value: 'Chapter Infinity: Our Forever Run',
    type: 'text',
  },
  {
    key: 'hero_synopsis',
    section: 'hero',
    label: 'Hero Billboard Synopsis',
    value:
      'From an unexpected first conversation to building our whole universe together. A cinematic journey of late-night laughter, kitchen cooking disasters, spontaneous road trips, and finding home in each other’s arms.',
    type: 'textarea',
  },
  {
    key: 'hero_badge',
    section: 'hero',
    label: 'Hero Ribbon Badge',
    value: '#1 in Our Hearts Today',
    type: 'text',
  },
  {
    key: 'hero_series_tag',
    section: 'hero',
    label: 'Hero Tag Label',
    value: 'Original Series',
    type: 'text',
  },
  {
    key: 'hero_backdrop_url',
    section: 'hero',
    label: 'Hero Custom Image URL (leave blank for default)',
    value: '',
    type: 'image',
  },

  // PERSONAL LOVE LETTER (VAULT & MODAL)
  {
    key: 'letter_title',
    section: 'letter',
    label: 'Love Letter Heading',
    value: 'To My One and Only Sanctuary',
    type: 'text',
  },
  {
    key: 'letter_subtitle',
    section: 'letter',
    label: 'Letter Subheading / Note',
    value: 'Vault Unlocked · For Your Eyes Only',
    type: 'text',
  },
  {
    key: 'letter_date',
    section: 'letter',
    label: 'Letter Date / Era',
    value: 'Ongoing & Everlasting',
    type: 'text',
  },
  {
    key: 'letter_content',
    section: 'letter',
    label: 'Handwritten Style Love Letter Body',
    value: `They say the universe is expanding every single millisecond, but honestly, my whole world shrank to the sweetest, warmest size the day you walked into my life.

Looking back at where we started, every single wrong turn led us straight to the right person. Thank you for loving me on the quiet days, laughing at my terrible jokes, stealing my warmest hoodies, and turning mundane grocery store runs into core memories.

You are my favorite plot twist, my safest sanctuary, and the only person I want to re-watch life with over and over again.

Happy Anniversary, my love. Forever and always.`,
    type: 'textarea',
  },
  {
    key: 'letter_signoff',
    section: 'letter',
    label: 'Letter Sign-off / Signature',
    value: 'Yours always & forever, with all my love ❤️',
    type: 'text',
  },

  // COUPLE & SETTINGS
  {
    key: 'partner1_name',
    section: 'couple',
    label: 'Partner 1 Name (Her)',
    value: 'My Girl 👑',
    type: 'text',
  },
  {
    key: 'partner2_name',
    section: 'couple',
    label: 'Partner 2 Name (Him)',
    value: 'Your Guy 🌙',
    type: 'text',
  },
  {
    key: 'anniversary_date',
    section: 'couple',
    label: 'Anniversary Date',
    value: '2025-06-15',
    type: 'date',
  },
  {
    key: 'secret_passcode',
    section: 'couple',
    label: 'Secret Vault Passcode (4-digit PIN)',
    value: '1402',
    type: 'text',
  },

  // SECTION HEADINGS & SUBTITLES
  {
    key: 'section_continue_title',
    section: 'sections',
    label: 'Continue Watching Title',
    value: 'Continue Watching: Our Memories',
    type: 'text',
  },
  {
    key: 'section_continue_sub',
    section: 'sections',
    label: 'Continue Watching Subtitle',
    value: 'Pick up right where we left off',
    type: 'text',
  },
  {
    key: 'section_our_story_title',
    section: 'sections',
    label: 'Our Story Series Title',
    value: 'Original Series: Our Story',
    type: 'text',
  },
  {
    key: 'section_our_story_sub',
    section: 'sections',
    label: 'Our Story Subtitle',
    value: 'Top 10 Relationship Chapters of All Time',
    type: 'text',
  },
  {
    key: 'storyline_custom_order',
    section: 'sections',
    label: 'Custom Storyline Chapter Order (JSON array of IDs)',
    value: '[]',
    type: 'text',
  },
  {
    key: 'section_little_things_title',
    section: 'sections',
    label: 'Little Things Collection Title',
    value: 'Collection: Little Things I Love About You',
    type: 'text',
  },
  {
    key: 'section_little_things_sub',
    section: 'sections',
    label: 'Little Things Subtitle',
    value: 'Micro-moments that steal my heart every single day',
    type: 'text',
  },
  {
    key: 'section_places_title',
    section: 'sections',
    label: 'Places & Experiences Title',
    value: 'My List: Places and Experiences Together',
    type: 'text',
  },
  {
    key: 'section_places_sub',
    section: 'sections',
    label: 'Places & Experiences Subtitle',
    value: 'Our travel passport & dream bucket list',
    type: 'text',
  },
  {
    key: 'section_vault_title',
    section: 'sections',
    label: 'Secret Vault Title',
    value: 'Hidden Episodes: Personal Surprises and Letters',
    type: 'text',
  },
  {
    key: 'section_vault_sub',
    section: 'sections',
    label: 'Secret Vault Subtitle',
    value: 'Locked confidential notes for your eyes only',
    type: 'text',
  },
];

export const DEFAULT_SITE_CONTENT_MAP: SiteContentMap = DEFAULT_SITE_CONTENT_LIST.reduce(
  (acc, item) => {
    acc[item.key] = item.value;
    return acc;
  },
  {} as SiteContentMap
);
