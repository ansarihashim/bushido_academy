import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

/* ---------------------------------------------------------------------------
   Single source of truth for all editable site text.
   - CONTENT_DEFAULTS: key -> default string (used as fallback before/after seed)
   - CONTENT_GROUPS:   how the admin editor groups keys by page/section
   - seedContent():    writes every default into Firestore content/{key}
--------------------------------------------------------------------------- */

export const CONTENT_DEFAULTS = {
  // ----- HOME -----
  hero_tagline: 'Discipline · Strength · Honor',
  hero_badge: 'FORGED IN DISCIPLINE',
  hero_subtitle: 'KARATE KICKBOXING · SPORTS ACADEMY',
  stat_years: '27+',
  stat_years_label: 'YEARS EXPERIENCE',
  stat_students: '1000+',
  stat_students_label: 'STUDENTS TRAINED',
  stat_disciplines_label: 'MARTIAL ARTS',
  karate_title: 'KARATE SHOTOKAI',
  karate_label: 'TRADITIONAL',
  karate_desc:
    'Rooted in centuries of Japanese tradition. Powerful strikes, deep stances, and unwavering discipline. Master kata, kihon, and kumite on the path of the warrior.',
  kickboxing_title: 'KICKBOXING',
  kickboxing_label: 'MODERN COMBAT',
  kickboxing_desc:
    'High-intensity striking. Punches, kicks, knees, and footwork. Build explosive power, fight conditioning, and razor reflexes inside the ring.',
  founder_label: 'THE FOUNDER',
  founder_heading: 'MEET THE FOUNDER',
  founder_subtitle:
    '4th Dan Black Belt | 27+ Years Experience | National Referee',
  founder_bio:
    'Founder of Bushido Academy and a dedicated martial artist with over two decades of experience shaping champions.',
  cta_heading: 'ARE YOU READY?',
  cta_subtext: 'Join Bushido Academy and train under expert guidance',

  // ----- ABOUT -----
  about_hero_label: 'WHO WE ARE',
  about_hero_heading: 'About Us',
  about_hero_subtext:
    'A legacy of discipline, honor, and martial arts excellence — built in Mumbai, shaped by tradition.',
  about_story_label: 'OUR STORY',
  about_story_heading: 'Our Academy',
  about_story_text:
    'Bushido Karate Kickboxing & Sports Academy is a premier martial arts academy based in Mumbai, founded by Afzal Sultan Khan. What began as a handful of students in a modest hall has grown into a home for warriors — a place where sweat, respect, and perseverance are taught in equal measure.',
  about_philosophy_heading: 'THE WAY OF THE WARRIOR',
  about_discipline_quote: 'Without discipline, strength is meaningless.',
  about_honor_quote: 'Respect your opponent. Respect yourself.',
  about_perseverance_quote: 'Fall seven times. Rise eight.',

  // ----- KARATE PAGE -----
  karate_page_heading: 'KARATE SHOTOKAI',
  karate_what_heading: 'What is Karate Shotokai?',
  karate_what_text:
    'Shotokai is one of the most widely practiced styles of karate, developed by Gichin Funakoshi and his son Gigo Funakoshi. It is characterised by deep, long stances that build powerful, stable movement and explosive linear techniques.',
  karate_learn_heading: 'What You Will Learn',
  kata_title: 'Kata',
  kata_desc:
    'Choreographed sequences of movements that encode the principles of attack and defense.',
  kihon_title: 'Kihon',
  kihon_desc:
    'The fundamentals — stances, strikes, blocks, and kicks drilled to perfection.',
  kumite_title: 'Kumite',
  kumite_desc:
    'Controlled sparring against a partner. Apply timing, distance, and strategy.',
  belt_grading_title: 'Belt Grading',
  belt_grading_desc:
    'Structured examinations that mark your progress from white belt to black belt and beyond.',

  // ----- KICKBOXING PAGE -----
  kickboxing_page_heading: 'KICKBOXING',
  kickboxing_what_heading: 'What is Kickboxing?',
  kickboxing_what_text:
    'High-intensity combat sport combining punches and kicks with relentless footwork and conditioning. It is as much a fitness discipline as it is a combat art — building explosive power, stamina, and razor-sharp reflexes.',
  padwork_title: 'Pad Work',
  padwork_desc: 'Develop power and accuracy on focus mitts and Thai pads.',
  sparring_title: 'Sparring',
  sparring_desc: 'Controlled fight practice to sharpen reflexes and timing.',
  conditioning_title: 'Conditioning',
  conditioning_desc: 'Build the stamina and strength of a fighter.',
  ringready_title: 'Ring Ready',
  ringready_desc: 'Prepare for competition with fight-specific drills.',

  // ----- CONTACT -----
  contact_heading: 'THE DOJO AWAITS YOU',
  contact_subtext:
    'Every champion started with a single step. Take yours today.',
  contact_quote:
    "Whether you're a beginner finding your path or a seasoned martial artist seeking mastery — there is a place for you at Bushido Academy.",
  contact_map_heading: 'VISIT THE DOJO',
  contact_map_subtext: 'Train where champions are made.',

  // ----- GALLERY -----
  gallery_label: 'CAPTURED MOMENTS',
  gallery_heading: 'GALLERY',
  gallery_subtext:
    'Every photograph is a moment of dedication, sweat, and triumph.',

  // ----- EVENTS -----
  events_label: 'TOURNAMENTS · WORKSHOPS · GRADINGS',
  events_heading: 'Events',
  events_subtext:
    'Stay updated on competitions, belt gradings, and special training workshops.',

  // ----- TRAINERS -----
  trainers_label: 'THE TEAM',
  trainers_heading: 'Our Trainer',
  trainers_subtext:
    'Meet the dedicated instructor guiding every student on the path of the warrior.',

  // ----- FOOTER -----
  footer_description:
    'Training warriors in karate, kickboxing, and sports disciplines.',
  footer_copyright:
    '© 2025 Bushido Karate Kickboxing & Sports Academy. All rights reserved.',
}

export const CONTENT_GROUPS = [
  {
    title: 'Home',
    keys: [
      'hero_tagline',
      'hero_badge',
      'hero_subtitle',
      'stat_years',
      'stat_years_label',
      'stat_students',
      'stat_students_label',
      'stat_disciplines_label',
      'karate_title',
      'karate_label',
      'karate_desc',
      'kickboxing_title',
      'kickboxing_label',
      'kickboxing_desc',
      'founder_label',
      'founder_heading',
      'founder_name',
      'founder_subtitle',
      'founder_bio',
      'cta_heading',
      'cta_subtext',
    ],
  },
  {
    title: 'About',
    keys: [
      'about_hero_label',
      'about_hero_heading',
      'about_hero_subtext',
      'about_story_label',
      'about_story_heading',
      'about_story_text',
      'about_philosophy_heading',
      'about_discipline_quote',
      'about_honor_quote',
      'about_perseverance_quote',
    ],
  },
  {
    title: 'Karate Page',
    keys: [
      'karate_page_heading',
      'karate_what_heading',
      'karate_what_text',
      'karate_learn_heading',
      'kata_title',
      'kata_desc',
      'kihon_title',
      'kihon_desc',
      'kumite_title',
      'kumite_desc',
      'belt_grading_title',
      'belt_grading_desc',
    ],
  },
  {
    title: 'Kickboxing Page',
    keys: [
      'kickboxing_page_heading',
      'kickboxing_what_heading',
      'kickboxing_what_text',
      'padwork_title',
      'padwork_desc',
      'sparring_title',
      'sparring_desc',
      'conditioning_title',
      'conditioning_desc',
      'ringready_title',
      'ringready_desc',
    ],
  },
  {
    title: 'Contact',
    keys: [
      'contact_heading',
      'contact_subtext',
      'contact_quote',
      'contact_map_heading',
      'contact_map_subtext',
    ],
  },
  {
    title: 'Gallery',
    keys: ['gallery_label', 'gallery_heading', 'gallery_subtext'],
  },
  {
    title: 'Events',
    keys: ['events_label', 'events_heading', 'events_subtext'],
  },
  {
    title: 'Trainers',
    keys: ['trainers_label', 'trainers_heading', 'trainers_subtext'],
  },
  {
    title: 'Footer',
    keys: ['footer_description', 'footer_copyright'],
  },
]

/* Founder name lives in the Home group above but isn't a separate default
   string in the spec; provide a sensible default so the editor isn't blank. */
if (!CONTENT_DEFAULTS.founder_name) {
  CONTENT_DEFAULTS.founder_name = 'AFZAL SULTAN KHAN'
}

/* Write every default into Firestore content/{key}. Safe to run repeatedly. */
export async function seedContent() {
  const entries = Object.entries(CONTENT_DEFAULTS)
  for (const [key, value] of entries) {
    await setDoc(doc(db, 'content', key), { value })
  }
  return entries.length
}
