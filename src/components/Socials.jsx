import { Mail, Instagram, Twitter, Youtube } from 'lucide-react'
import { SOCIALS } from '../data/content'

// TikTok isn't in lucide — small inline glyph.
function TikTok({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.5 5.5a4.5 4.5 0 0 0 3.5 1.7v2.6a7 7 0 0 1-3.5-.95v5.3a5.65 5.65 0 1 1-5.65-5.65c.2 0 .4.01.6.04v2.7a2.95 2.95 0 1 0 2.05 2.8V2.5h2.95a4.5 4.5 0 0 0 0 .02V5.5Z" />
    </svg>
  )
}

const GLYPH = {
  mail: Mail,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  tiktok: TikTok,
}

export default function Socials() {
  return (
    <ul className="flex items-center justify-center gap-3.5">
      {SOCIALS.map((s) => {
        const Icon = GLYPH[s.type]
        return (
          <li key={s.label}>
            <a
              href={s.href}
              target={s.href.startsWith('http') ? '_blank' : undefined}
              rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              aria-label={s.label}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-faint transition-all duration-300 ease-out-expo hover:border-ink hover:text-ink"
            >
              <Icon size={16} />
            </a>
          </li>
        )
      })}
    </ul>
  )
}
