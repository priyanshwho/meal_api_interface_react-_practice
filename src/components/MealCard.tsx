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
      whileHover={{ y: -8, rotate: -0.3 }}
      className="group overflow-hidden rounded-[1.8rem] border border-[var(--border)] bg-[linear-gradient(180deg,var(--surface),var(--surface-soft))] shadow-[0_16px_44px_rgba(88,30,40,0.12)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={meal.strMealThumb}
          alt={meal.strMeal}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_44%,rgba(52,16,21,0.72)_100%)]" />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="rounded-full bg-[rgba(255,246,243,0.82)] px-3 py-1 text-xs font-medium text-[var(--text)] backdrop-blur-md">
            {meal.strCategory}
          </span>
          <span className="rounded-full bg-[rgba(255,246,243,0.82)] px-3 py-1 text-xs font-medium text-[var(--text)] backdrop-blur-md">
            {meal.strArea}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
          <span className="max-w-[75%] rounded-full bg-[rgba(255,246,243,0.8)] px-3 py-1 text-xs font-medium text-[var(--text)] backdrop-blur-md">
            {meal.strMeal}
          </span>
          <button
            type="button"
            onClick={onToggleFavorite}
            className="grid h-10 w-10 place-items-center rounded-full bg-[rgba(255,246,243,0.82)] text-[var(--text)] backdrop-blur-md transition hover:scale-105"
            aria-label={favorite ? 'Remove favorite' : 'Add favorite'}
          >
            <Heart className={`h-4 w-4 ${favorite ? 'fill-[var(--accent)] text-[var(--accent)]' : ''}`} />
          </button>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <p className="text-sm leading-6 text-[var(--muted)]">{getMealDigest(meal)}</p>

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--surface-soft)] px-3 py-1.5 text-xs text-[var(--text)]">
            <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
            {meal.strArea}
          </span>
          <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1.5 text-xs text-[var(--text)]">
            {meal.strCategory}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpen}
            className="flex-1 rounded-full bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5"
          >
            View recipe
          </button>
          <button
            type="button"
            onClick={onShare}
            className="grid h-11 w-11 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface-soft)] transition hover:-translate-y-0.5"
            aria-label="Share recipe"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.article>
  )
}
