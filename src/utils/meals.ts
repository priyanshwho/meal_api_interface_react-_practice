import type { Meal } from '../types'

export type MealIngredient = {
  name: string
  measure: string
}

const INGREDIENT_LIMIT = 20

const trimText = (value: string) => value.replace(/\s+/g, ' ').trim()

export const getMealIngredients = (meal: Meal): MealIngredient[] => {
  const ingredients: MealIngredient[] = []

  for (let index = 1; index <= INGREDIENT_LIMIT; index += 1) {
    const ingredient = meal[`strIngredient${index}`]
    const measure = meal[`strMeasure${index}`]

    if (typeof ingredient !== 'string' || ingredient.trim() === '') {
      continue
    }

    ingredients.push({
      name: trimText(ingredient),
      measure: typeof measure === 'string' && measure.trim() !== '' ? trimText(measure) : 'to taste',
    })
  }

  return ingredients
}

export const getMealTags = (meal: Meal): string[] => {
  if (!meal.strTags) {
    return []
  }

  return meal.strTags
    .split(',')
    .map((tag) => trimText(tag))
    .filter(Boolean)
}

export const getMealDigest = (meal: Meal) => {
  const cleaned = trimText(meal.strInstructions).replace(/\s*\.(?=\s)/g, '.')
  const chunks = cleaned.split(/(?<=[.!?])\s+/).filter(Boolean)

  return trimText(chunks.slice(0, 2).join(' ')).slice(0, 190)
}

const mealSearchText = (meal: Meal) =>
  [
    meal.strMeal,
    meal.strCategory,
    meal.strArea,
    meal.strTags ?? '',
    meal.strInstructions,
    ...getMealIngredients(meal).flatMap((ingredient) => [ingredient.name, ingredient.measure]),
  ]
    .join(' ')
    .toLowerCase()

export const mealMatchesQuery = (meal: Meal, query: string) => {
  if (!query.trim()) {
    return true
  }

  return mealSearchText(meal).includes(query.toLowerCase().trim())
}

export const getTutorialLink = (meal: Meal) => meal.strYoutube ?? meal.strSource ?? ''
