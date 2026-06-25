// Single source of truth. Edit copy + links here.

export const PROFILE = {
  name: 'Matthew Park',
  // Positioning line — tweak as we lock it in.
  tagline: 'creator (75K+ followers, 30M+ views)',
  email: 'matthew.parkk0@gmail.com',
}

export const SOCIALS = [
  { label: 'Email', type: 'mail', href: `mailto:${PROFILE.email}` },
  { label: 'Instagram', type: 'instagram', href: 'https://www.instagram.com/matty.park/' },
  { label: 'TikTok', type: 'tiktok', href: 'https://www.tiktok.com/@mattparxy' },
  { label: 'Twitter', type: 'twitter', href: 'https://x.com/MattyparkW' },
  { label: 'YouTube', type: 'youtube', href: 'https://www.youtube.com/@matty_park' },
]

// Placeholder reviews — swap in real ones.
export const REVIEWS = [
  { name: 'Malik', org: 'MedSchoolZone', stars: 5, when: '1 month ago', text: 'Delivered exactly what we needed, fast. The content performed way above our usual numbers.' },
  { name: 'Sarah', org: 'Bloom Skincare', stars: 5, when: '2 months ago', text: 'Easy to work with and genuinely gets short-form. Booked again immediately.' },
  { name: 'Devon', org: 'Atlas Fitness', stars: 5, when: '3 months ago', text: 'Understood the brand in one call and the videos just hit. Real results, real fast.' },
]

// Placeholder client names — replace with real logos/brands.
export const CLIENTS = ['Best Buy', 'DoorDash', 'Notion', 'AXIOM', 'SlapShift', 'Brand Five']
