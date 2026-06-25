import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { fadeUp, stagger, viewport } from '../lib/motion'
import { REVIEWS, CLIENTS } from '../data/content'

function Stars({ count }) {
  return (
    <span className="flex items-center gap-0.5 text-ink" aria-label={`${count} out of 5`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={15} fill="currentColor" strokeWidth={0} />
      ))}
      <span className="ml-1.5 font-mono text-[0.7rem] text-faint">{count}.0</span>
    </span>
  )
}

export default function Reviews() {
  return (
    <section id="reviews" className="px-6 pb-[var(--space-section)] pt-[6vh]">
      <div className="mx-auto max-w-[1100px]">
        <h2 className="text-center text-[clamp(1.8rem,1.2rem+2.4vw,3rem)] font-semibold uppercase tracking-tight">
          Reviews + Clients
        </h2>

        {/* Reviews */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="mt-12 grid gap-5 md:grid-cols-3"
        >
          {REVIEWS.map((r) => (
            <motion.figure
              key={r.name + r.org}
              variants={fadeUp}
              className="flex flex-col rounded-2xl border border-line bg-paper p-6 shadow-[var(--shadow-soft)]"
            >
              <figcaption className="mb-3 font-semibold">
                {r.name} from {r.org} said…
              </figcaption>
              <div className="flex items-center justify-between">
                <Stars count={r.stars} />
                <span className="font-mono text-[0.68rem] text-faint">{r.when}</span>
              </div>
              <blockquote className="mt-4 text-muted leading-relaxed">“{r.text}”</blockquote>
            </motion.figure>
          ))}
        </motion.div>

        {/* Client logos (text placeholders for now) */}
        <motion.ul
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="mt-16 flex flex-wrap items-center justify-center gap-x-12 gap-y-6"
        >
          {CLIENTS.map((c) => (
            <motion.li
              key={c}
              variants={fadeUp}
              className="font-semibold uppercase tracking-tight text-faint transition-colors duration-300 hover:text-ink"
              style={{ fontSize: 'clamp(1rem, 0.8rem + 1vw, 1.5rem)' }}
            >
              {c}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
