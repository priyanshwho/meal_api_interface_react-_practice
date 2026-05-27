import { motion } from 'framer-motion'
import { Heart, Share2, Sparkles } from 'lucide-react'
import type { Meal } from '../types'
import { getMealDigest } from '../utils/meals'

type MealCardProps = {
  meal: Meal
  favorite: boolean
  onToggleFavorite: () => void
  onOpen: () => void
  onShare: () => void
  delay: number
}

export const MealCard = ({ meal, favorite, onToggleFavorite, onOpen, onShare, delay }: MealCardProps) => {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0, transition: { delay, duration: 0.45 } }}
      exit={{ opacity: 0, y: 16, scale: 0.98 }}
      whileHover={{ y: -10, rotate: -0.4 }}
      className="group overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(180deg,var(--surface),var(--surface-soft))] shadow-[0_22px_54px_rgba(88,30,40,0.12)] transition-shadow duration-300 hover:shadow-[0_30px_72px_rgba(101,42,52,0.16)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={meal.strMealThumb}
          alt={meal.strMeal}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,247,242,0.08)_12%,transparent_42%,rgba(56,17,22,0.72)_100%)]" />
        <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-[rgba(255,248,245,0.16)] bg-[rgba(255,247,242,0.76)] px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.28em] text-[var(--text)] backdrop-blur-md">
            {meal.strCategory}
          </span>
          <span className="rounded-full border border-[rgba(255,248,245,0.16)] bg-[rgba(255,247,242,0.76)] px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.28em] text-[var(--text)] backdrop-blur-md">
            {meal.strArea}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4 space-y-3">
          <span className="inline-flex max-w-[88%] rounded-[1.1rem] border border-[rgba(255,248,245,0.16)] bg-[rgba(255,247,242,0.88)] px-4 py-2 text-sm font-semibold tracking-[-0.02em] text-[var(--text)] backdrop-blur-md">
            {meal.strMeal}
          </span>
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full bg-[rgba(255,247,242,0.74)] px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.28em] text-[var(--text)] backdrop-blur-md">
              recipe card
            </span>
          <button
            type="button"
            onClick={onToggleFavorite}
            className="grid h-10 w-10 place-items-center rounded-full border border-[rgba(255,248,245,0.16)] bg-[rgba(255,247,242,0.88)] text-[var(--text)] backdrop-blur-md transition hover:scale-105"
            aria-label={favorite ? 'Remove favorite' : 'Add favorite'}
          >
            <Heart className={`h-4 w-4 ${favorite ? 'fill-[var(--accent)] text-[var(--accent)]' : ''}`} />
          </button>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-6">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">A quick taste</p>
          <p className="text-sm leading-7 text-[var(--muted)]">{getMealDigest(meal)}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1.5 text-xs text-[var(--text)]">
            <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
            {meal.strArea}
          </span>
          <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1.5 text-xs text-[var(--text)]">
            {meal.strCategory}
          </span>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={onOpen}
            className="flex-1 rounded-full bg-[var(--accent)] px-4 py-3 text-sm font-medium text-white shadow-[0_14px_28px_rgba(173,71,81,0.24)] transition hover:-translate-y-0.5"
          >
            View recipe
          </button>
          <button
            type="button"
            onClick={onShare}
            className="grid h-11 w-11 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface-soft)] transition hover:-translate-y-0.5 hover:bg-[var(--surface-strong)]"
            aria-label="Share recipe"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.article>
  )
}
