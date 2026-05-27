export type Meal = {
  idMeal: string
  strMeal: string
  strDrinkAlternate: string | null
  strCategory: string
  strArea: string
  strInstructions: string
  strMealThumb: string
  strTags: string | null
  strYoutube: string | null
  strSource: string | null
  strImageSource: string | null
  strCreativeCommonsConfirmed: string | null
  dateModified: string | null
  [key: string]: string | null | undefined
}

export type MealsApiPage = {
  page: number
  limit: number
  totalPages: number
  previousPage: boolean
  nextPage: boolean
  totalItems: number
  currentPageItems: number
  data: Meal[]
}

export type MealsApiResponse = {
  statusCode: number
  data: MealsApiPage
}