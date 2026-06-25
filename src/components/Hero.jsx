import { motion } from 'framer-motion'
import { EASE } from '../lib/motion'
import { PROFILE } from '../data/content'
import Socials from './Socials'

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE }}
        className="display text-[clamp(3rem,1.5rem+7vw,7rem)] font-light tracking-[-0.01em]"
      >
        {PROFILE.name}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 0.15 }}
        className="mt-4 text-[length:var(--text-body)] text-muted"
      >
        {PROFILE.tagline}
      </motion.p>

      {/* Socials sit lower, like the reference */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: EASE, delay: 0.4 }}
        className="absolute bottom-[12vh]"
      >
        <Socials />
      </motion.div>
    </section>
  )
}
