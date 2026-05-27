import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BookOpen,
  Filter,
  Heart,
  LoaderCircle,
  MoonStar,
  RefreshCcw,
  Search,
  Sparkles,
  SunMedium,
} from 'lucide-react'
import { MealCard } from './components/MealCard'
import { MealModal } from './components/MealModal'
import { MealsSkeleton } from './components/MealsSkeleton'
import { useIntersectionTrigger } from './hooks/useIntersectionTrigger'
import { useLocalStorageState } from './hooks/useLocalStorageState'
import { useMealsCatalog } from './hooks/useMealsCatalog'
import { getMealDigest, getMealIngredients, getMealTags, mealMatchesQuery } from './utils/meals'
import type { Meal } from './types'

const PAGE_SIZE = 12

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55 },
  },
}

const App = () => {
  const { meals, isLoading, isSyncing, error, refetch, totalMeals } = useMealsCatalog()
  const [theme, setTheme] = useLocalStorageState<'light' | 'dark'>('meals-explorer-theme', 'light')
  const [favoriteIds, setFavoriteIds] = useLocalStorageState<string[]>('meals-explorer-favorites', [])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All plates')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)
  const [shareFeedback, setShareFeedback] = useState('')
  const [randomMeal, setRandomMeal] = useState<Meal | null>(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const categories = useMemo(() => {
    const unique = new Set(meals.map((meal) => meal.strCategory).filter(Boolean))
    return ['All plates', ...Array.from(unique).sort((left, right) => left.localeCompare(right))]
  }, [meals])

  const filteredMeals = useMemo(() => {
    return meals.filter((meal) => {
      const matchesCategory = category === 'All plates' || meal.strCategory === category
      return matchesCategory && mealMatchesQuery(meal, search)
    })
  }, [category, meals, search])

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [category, search])

  const visibleMeals = filteredMeals.slice(0, visibleCount)
  const favorites = useMemo(
    () => meals.filter((meal) => favoriteIds.includes(meal.idMeal)),
    [favoriteIds, meals],
  )
  const favoriteCount = favoriteIds.length

  const toggleFavorite = (mealId: string) => {
    setFavoriteIds((current) =>
      current.includes(mealId)
        ? current.filter((id) => id !== mealId)
        : [...current, mealId],
    )
  }

  const generateRandomMeal = () => {
    const pool = filteredMeals.length > 0 ? filteredMeals : meals
    if (pool.length === 0) {
      return
    }

    const nextMeal = pool[Math.floor(Math.random() * pool.length)]
    setRandomMeal(nextMeal)
    setSelectedMeal(nextMeal)
  }

  const shareMeal = async (meal: Meal) => {
    const ingredients = getMealIngredients(meal)
      .slice(0, 4)
      .map((ingredient) => `${ingredient.measure} ${ingredient.name}`)
      .join(', ')
    const text = `${meal.strMeal} · ${meal.strCategory} · ${meal.strArea}. ${getMealDigest(meal)} ${ingredients}`

    try {
      if (navigator.share) {
        await navigator.share({
          title: meal.strMeal,
          text,
          url: meal.strYoutube ?? window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(text)
        setShareFeedback('Recipe details copied')
        window.setTimeout(() => setShareFeedback(''), 1800)
      }
    } catch {
      setShareFeedback('Share cancelled')
      window.setTimeout(() => setShareFeedback(''), 1800)
    }
  }

  const loadMoreRef = useIntersectionTrigger(() => {
    setVisibleCount((count) => Math.min(filteredMeals.length, count + PAGE_SIZE))
  }, visibleCount >= filteredMeals.length || filteredMeals.length === 0)

  const openRandomFromFavorites = () => {
    if (favorites.length === 0) {
      generateRandomMeal()
      return
    }

    const nextMeal = favorites[Math.floor(Math.random() * favorites.length)]
    setSelectedMeal(nextMeal)
    setRandomMeal(nextMeal)
  }

  const heroMeal = randomMeal ?? filteredMeals[0] ?? meals[0]
  const ingredientPreview = heroMeal ? getMealIngredients(heroMeal).slice(0, 3) : []
  const featuredTags = heroMeal ? getMealTags(heroMeal).slice(0, 3) : []

  useEffect(() => {
    if (!heroMeal && meals.length > 0) {
      setRandomMeal(meals[0])
    }
  }, [heroMeal, meals])

  return (
    <div className="relative min-h-screen overflow-hidden text-[var(--text)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,208,191,0.42),_transparent_32%),radial-gradient(circle_at_85%_18%,_rgba(175,77,87,0.22),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(116,24,34,0.16),_transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.22] [background-image:linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px)] [background-size:28px_28px]" />

      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_76%,transparent)] px-4 py-4 shadow-[0_20px_60px_rgba(79,20,31,0.08)] backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[linear-gradient(145deg,var(--accent-soft),var(--surface-strong))] shadow-[0_18px_35px_rgba(105,35,44,0.18)]">
              <Sparkles className="h-5 w-5 text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-[0.7rem] uppercase tracking-[0.5em] text-[var(--muted)]">Meals Explorer</p>
              <h1 className="font-[700] text-xl tracking-[-0.04em] sm:text-2xl">
                dreamy recipe atlas
              </h1>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center lg:justify-end">
            <label className="group flex min-w-0 flex-1 items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 shadow-[0_14px_40px_rgba(99,40,49,0.08)] transition hover:border-[var(--accent-soft)]">
              <Search className="h-4 w-4 text-[var(--muted)] transition group-focus-within:text-[var(--accent)]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
                placeholder="Search meals, cuisine, ingredients, tags"
              />
            </label>

            <div className="flex items-center gap-2 self-end">
              <button
                type="button"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-4 text-sm shadow-[0_14px_40px_rgba(99,40,49,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(99,40,49,0.14)]"
              >
                {theme === 'dark' ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
                <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
              </button>

              <button
                type="button"
                onClick={openRandomFromFavorites}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-[var(--accent)] px-4 text-sm font-medium text-white shadow-[0_18px_36px_rgba(163,60,73,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_26px_48px_rgba(163,60,73,0.38)]"
              >
                <RefreshCcw className="h-4 w-4" />
                <span className="hidden sm:inline">Random meal</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="grid gap-6">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(145deg,var(--surface),var(--surface-strong))] p-6 shadow-[0_30px_80px_rgba(72,19,28,0.14)] backdrop-blur-xl sm:p-8 lg:p-10"
          >
            <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle,_rgba(255,211,197,0.9),_rgba(255,211,197,0))] blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 right-8 h-52 w-52 rounded-full bg-[radial-gradient(circle,_rgba(149,44,57,0.32),_rgba(149,44,57,0))] blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2 text-xs uppercase tracking-[0.35em] text-[var(--muted)]">
                  <BookOpen className="h-3.5 w-3.5 text-[var(--accent)]" />
                  editorial meal archive
                </span>

                <div className="space-y-4">
                  <h2 className="max-w-2xl text-4xl font-[700] leading-none tracking-[-0.07em] sm:text-5xl lg:text-6xl">
                    {heroMeal ? heroMeal.strMeal : 'Meals Explorer'}
                  </h2>
                  <p className="max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                    A soft surreal recipe atlas with dusty rose light, muted coral shadows,
                    floating glass cards, and a tiny bit of culinary weirdness.
                  </p>
                </div>

                {heroMeal ? (
                  <div className="flex flex-wrap gap-3">
                    <Badge icon={<Filter className="h-3.5 w-3.5" />} label={heroMeal.strCategory} />
                    <Badge icon={<Sparkles className="h-3.5 w-3.5" />} label={heroMeal.strArea} />
                    <Badge icon={<Heart className="h-3.5 w-3.5" />} label={`${favoriteCount} favorites`} />
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={generateRandomMeal}
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white shadow-[0_18px_36px_rgba(163,60,73,0.28)] transition hover:-translate-y-0.5"
                  >
                    <Sparkles className="h-4 w-4" />
                    Surprise me
                  </button>
                  <button
                    type="button"
                    onClick={refetch}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-5 py-3 text-sm font-medium shadow-[0_12px_26px_rgba(99,40,49,0.08)] transition hover:-translate-y-0.5"
                  >
                    <LoaderCircle className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh catalog
                  </button>
                </div>
              </div>

              <div className="space-y-4 rounded-[1.75rem] border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_80%,transparent)] p-5 shadow-[0_16px_46px_rgba(98,39,48,0.1)] backdrop-blur-md">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">Featured recipe</p>
                    <p className="mt-1 text-lg font-[700] tracking-[-0.03em]">{heroMeal?.strMeal ?? 'Select a meal'}</p>
                  </div>
                  {heroMeal ? (
                    <button
                      type="button"
                      onClick={() => setSelectedMeal(heroMeal)}
                      className="rounded-full border border-[var(--border)] px-3 py-2 text-xs font-medium transition hover:bg-[var(--surface-strong)]"
                    >
                      Open recipe
                    </button>
                  ) : null}
                </div>

                {heroMeal ? (
                  <>
                    <div className="space-y-2 text-sm text-[var(--muted)]">
                      <p>{getMealDigest(heroMeal)}</p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {featuredTags.length > 0 ? (
                          featuredTags.map((tag) => <Pill key={tag} label={tag} />)
                        ) : (
                          <Pill label="No tags listed" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                      <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">Ingredient hints</p>
                      <ul className="grid gap-2 text-sm text-[var(--text)]">
                        {ingredientPreview.map((ingredient) => (
                          <li key={`${ingredient.name}-${ingredient.measure}`} className="flex items-center justify-between gap-4 rounded-full bg-[var(--surface)] px-3 py-2">
                            <span>{ingredient.name}</span>
                            <span className="text-xs text-[var(--muted)]">{ingredient.measure}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <StatCard label="Recipes" value={totalMeals} accent="var(--accent)" />
                      <StatCard label="Favorites" value={favoriteCount} accent="var(--accent-2)" />
                      <StatCard label="Visible" value={visibleMeals.length} accent="var(--accent-soft)" />
                      <StatCard label="Mood" value={theme === 'dark' ? 'Noir' : 'Blush'} accent="var(--border-strong)" />
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </motion.div>
        </section>

        <section className="rounded-[2rem] border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_84%,transparent)] p-4 shadow-[0_24px_70px_rgba(87,31,40,0.11)] backdrop-blur-xl sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.45em] text-[var(--muted)]">Browse meals</p>
              <h2 className="mt-1 text-2xl font-[700] tracking-[-0.05em] sm:text-3xl">
                {filteredMeals.length} matches, {visibleMeals.length} shown
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    item === category
                      ? 'border-[var(--accent)] bg-[var(--accent)] text-white shadow-[0_18px_34px_rgba(163,60,73,0.28)]'
                      : 'border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text)] hover:-translate-y-0.5 hover:bg-[var(--surface-strong)]'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {isLoading ? (
              <MealsSkeleton count={12} />
            ) : filteredMeals.length === 0 ? (
              <EmptyState
                title="No recipes matched"
                copy="Try a gentler search term or switch the category lens."
                actionLabel="Clear filters"
                onAction={() => {
                  setSearch('')
                  setCategory('All plates')
                }}
              />
            ) : (
              <AnimatePresence mode="popLayout">
                {visibleMeals.map((meal, index) => (
                  <MealCard
                    key={meal.idMeal}
                    meal={meal}
                    favorite={favoriteIds.includes(meal.idMeal)}
                    onToggleFavorite={() => toggleFavorite(meal.idMeal)}
                    onOpen={() => setSelectedMeal(meal)}
                    onShare={() => void shareMeal(meal)}
                    delay={index * 0.03}
                  />
                ))}
              </AnimatePresence>
            )}
          </div>

          <div ref={loadMoreRef} className="flex min-h-24 items-center justify-center py-4 text-sm text-[var(--muted)]">
            {isSyncing ? 'Warming the catalog...' : visibleCount < filteredMeals.length ? 'Scroll for more meals' : 'You reached the end of the archive'}
          </div>
        </section>

        {error ? (
          <ErrorBanner
            message={error}
            onRetry={refetch}
          />
        ) : null}
      </main>

      <AnimatePresence>
        {selectedMeal ? (
          <MealModal
            meal={selectedMeal}
            favorite={favoriteIds.includes(selectedMeal.idMeal)}
            onClose={() => setSelectedMeal(null)}
            onToggleFavorite={() => toggleFavorite(selectedMeal.idMeal)}
            onShare={() => void shareMeal(selectedMeal)}
          />
        ) : null}
      </AnimatePresence>

      <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
        <AnimatePresence>
          {shareFeedback ? (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm shadow-[0_18px_40px_rgba(58,18,24,0.18)] backdrop-blur-xl"
            >
              {shareFeedback}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}

type BadgeProps = {
  label: string
  icon: ReactNode
}

const Badge = ({ label, icon }: BadgeProps) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2 text-sm shadow-[0_10px_24px_rgba(89,32,40,0.08)]">
    {icon}
    {label}
  </span>
)

type PillProps = {
  label: string
  active?: boolean
  onClick?: () => void
}

const Pill = ({ label, active = false, onClick }: PillProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
      active
        ? 'bg-[var(--accent)] text-white shadow-[0_14px_28px_rgba(163,60,73,0.24)]'
        : 'bg-[var(--surface-soft)] text-[var(--text)] hover:bg-[var(--surface-strong)]'
    }`}
  >
    {label}
  </button>
)

type StatCardProps = {
  label: string
  value: number | string
  accent: string
}

const StatCard = ({ label, value, accent }: StatCardProps) => (
  <div className="rounded-[1.35rem] border border-[var(--border)] bg-[var(--surface-soft)] p-4 shadow-[0_10px_24px_rgba(97,42,51,0.08)]">
    <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">{label}</p>
    <p className="mt-2 text-2xl font-[700] tracking-[-0.04em]" style={{ color: accent }}>
      {value}
    </p>
  </div>
)

type HintCardProps = {
  title: string
  copy: string
}

const HintCard = ({ title, copy }: HintCardProps) => (
  <div className="rounded-[1.35rem] border border-[var(--border)] bg-[var(--surface-soft)] p-4 shadow-[0_10px_24px_rgba(97,42,51,0.08)] transition hover:-translate-y-0.5 hover:bg-[var(--surface-strong)]">
    <p className="text-sm font-[700] tracking-[-0.02em]">{title}</p>
    <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{copy}</p>
  </div>
)

type EmptyStateProps = {
  title: string
  copy: string
  actionLabel: string
  onAction: () => void
}

const EmptyState = ({ title, copy, actionLabel, onAction }: EmptyStateProps) => (
  <div className="col-span-full rounded-[1.75rem] border border-dashed border-[var(--border-strong)] bg-[linear-gradient(180deg,var(--surface-soft),var(--surface))] p-8 text-center shadow-[0_10px_24px_rgba(88,34,41,0.06)]">
    <p className="text-xl font-[700] tracking-[-0.04em]">{title}</p>
    <p className="mt-2 text-sm text-[var(--muted)]">{copy}</p>
    <button
      type="button"
      onClick={onAction}
      className="mt-5 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white"
    >
      {actionLabel}
    </button>
  </div>
)

type ErrorBannerProps = {
  message: string
  onRetry: () => void
}

const ErrorBanner = ({ message, onRetry }: ErrorBannerProps) => (
  <div className="rounded-[1.5rem] border border-[rgba(136,49,61,0.38)] bg-[linear-gradient(135deg,rgba(255,220,214,0.9),rgba(255,232,228,0.82))] p-5 text-[var(--text)] shadow-[0_20px_48px_rgba(111,36,46,0.12)]">
    <p className="text-sm font-[700]">Something slowed the recipe stream.</p>
    <p className="mt-1 text-sm text-[var(--muted)]">{message}</p>
    <button
      type="button"
      onClick={onRetry}
      className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white"
    >
      <RefreshCcw className="h-4 w-4" />
      Try again
    </button>
  </div>
)

export default App
