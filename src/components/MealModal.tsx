import { motion } from 'framer-motion'
import { BookmarkCheck, BookmarkPlus, ExternalLink, Share2, X, PlayCircle } from 'lucide-react'
import { useEffect } from 'react'
import type { Meal } from '../types'
import { getMealIngredients, getMealTags, getTutorialLink } from '../utils/meals'

type MealModalProps = {
  meal: Meal
  favorite: boolean
  onClose: () => void
  onToggleFavorite: () => void
  onShare: () => void
}

export const MealModal = ({ meal, favorite, onClose, onToggleFavorite, onShare }: MealModalProps) => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const ingredients = getMealIngredients(meal)
  const tags = getMealTags(meal)
  const tutorialLink = getTutorialLink(meal)

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(35,10,16,0.54)] px-4 py-6 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={onClose}
    >
      <motion.div
        className="relative max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-4xl border border-(--border) bg-[linear-gradient(180deg,var(--surface),var(--surface-soft))] shadow-[0_35px_90px_rgba(37,12,17,0.34)]"
        initial={{ y: 30, scale: 0.98, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 30, scale: 0.98, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-full border border-(--border) bg-[rgba(255,246,243,0.84)] text-(--text) backdrop-blur-md transition hover:scale-105"
          aria-label="Close recipe modal"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid max-h-[92vh] overflow-y-auto lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative min-h-96 overflow-hidden lg:min-h-full">
            <img src={meal.strMealThumb} alt={meal.strMeal} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(37,12,17,0.1),rgba(37,12,17,0.72))]" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
              <p className="text-xs uppercase tracking-[0.45em] text-[rgba(255,248,245,0.72)]">Recipe detail sheet</p>
              <h2 className="mt-2 max-w-xl text-3xl font-bold tracking-tighter sm:text-4xl">
                {meal.strMeal}
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                <Pill label={meal.strCategory} />
                <Pill label={meal.strArea} />
                {tags.slice(0, 3).map((tag) => (
                  <Pill key={tag} label={tag} />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 p-5 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onToggleFavorite}
                className="inline-flex items-center gap-2 rounded-full border border-(--border) bg-(--surface-soft) px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5"
              >
                {favorite ? <BookmarkCheck className="h-4 w-4" /> : <BookmarkPlus className="h-4 w-4" />}
                {favorite ? 'Saved' : 'Save meal'}
              </button>
              <button
                type="button"
                onClick={onShare}
                className="inline-flex items-center gap-2 rounded-full bg-(--accent) px-4 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5"
              >
                <Share2 className="h-4 w-4" />
                Share recipe
              </button>
              {tutorialLink ? (
                <a
                  href={tutorialLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-(--border) bg-(--surface-soft) px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5"
                >
                  <PlayCircle className="h-4 w-4 text-(--accent)" />
                  Tutorial link
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </div>

            <section className="grid gap-4 rounded-3xl border border-(--border) bg-(--surface-soft) p-4 sm:p-5">
              <SectionLabel title="Story" />
              <p className="text-sm leading-7 text-(--muted)">
                {meal.strCategory} from {meal.strArea}. The ingredients and pacing are listed below in
                a soft recipe sheet format.
              </p>
            </section>

            <section className="grid gap-4 rounded-3xl border border-(--border) bg-(--surface-soft) p-4 sm:p-5">
              <SectionLabel title="Ingredients" />
              <div className="grid gap-2 sm:grid-cols-2">
                {ingredients.map((ingredient) => (
                  <div
                    key={`${ingredient.name}-${ingredient.measure}`}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-(--border) bg-(--surface) px-3 py-3"
                  >
                    <span className="text-sm font-medium">{ingredient.name}</span>
                    <span className="text-xs text-(--muted)">{ingredient.measure}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-4 rounded-3xl border border-(--border) bg-(--surface-soft) p-4 sm:p-5">
              <SectionLabel title="Instructions" />
              <p className="whitespace-pre-line text-sm leading-7 text-(--muted)">
                {meal.strInstructions}
              </p>
            </section>

            <section className="grid gap-4 rounded-3xl border border-(--border) bg-(--surface-soft) p-4 sm:p-5">
              <SectionLabel title="Tags" />
              <div className="flex flex-wrap gap-2">
                {tags.length > 0 ? tags.map((tag) => <Pill key={tag} label={tag} />) : <Pill label="No tags" />}
              </div>
            </section>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

const Pill = ({ label }: { label: string }) => (
  <span className="inline-flex items-center rounded-full border border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.12)] px-3 py-1.5 text-xs text-white backdrop-blur-md">
    {label}
  </span>
)

const SectionLabel = ({ title }: { title: string }) => (
  <div>
    <p className="text-xs uppercase tracking-[0.42em] text-(--muted)">{title}</p>
  </div>
)
