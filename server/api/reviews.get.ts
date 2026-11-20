/**
 * Flux d'avis Google — Places API (New)
 *
 * - Clé : NUXT_GOOGLE_PLACES_KEY (API "Places API (New)" activée dans Google Cloud)
 * - Place ID : NUXT_GOOGLE_PLACE_ID (optionnel, retrouvé par recherche texte sinon)
 *
 * La réponse est mise en cache 6 h côté serveur : quelques appels par jour seulement.
 * Sans clé (ou en cas d'erreur), on renvoie la note globale connue et la sélection
 * manuelle de server/data/reviews.ts — jamais d'avis inventés.
 */

import { manualReviews } from '../data/reviews'

export interface PatioReview {
  author: string
  authorUrl?: string
  avatar?: string
  rating: number
  text: string
  when: string
  publishedAt?: string
}

export interface ReviewsPayload {
  source: 'google' | 'fallback'
  rating: number
  count: number
  url: string
  reviews: PatioReview[]
}

const FALLBACK: ReviewsPayload = {
  source: 'fallback',
  rating: 4.8,
  count: 430,
  url: 'https://www.google.com/maps/place/Restaurant+Le+Patio/@42.7195386,1.8382531,17z/data=!4m6!3m5!1s0x12af9d073e63ae85:0x31d9a861d55278b6!8m2!3d42.7195386!4d1.8382531',
  reviews: manualReviews,
}

const SEARCH_QUERY = 'Restaurant Le Patio, 3 Rue Victor Pilhes, 09110 Ax-les-Thermes'

interface GooglePlace {
  id?: string
  rating?: number
  userRatingCount?: number
  googleMapsUri?: string
  reviews?: {
    rating?: number
    relativePublishTimeDescription?: string
    publishTime?: string
    text?: { text?: string }
    originalText?: { text?: string }
    authorAttribution?: { displayName?: string; uri?: string; photoUri?: string }
  }[]
}

async function resolvePlaceId(key: string): Promise<string | undefined> {
  const res = await $fetch<{ places?: { id: string }[] }>('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask': 'places.id',
    },
    body: { textQuery: SEARCH_QUERY, languageCode: 'fr', maxResultCount: 1 },
  })
  return res.places?.[0]?.id
}

/** Appel Google mis en cache 6 h (null en cas d'échec : jamais mis en cache). */
const fetchGoogle = defineCachedFunction(
  async (key: string, configuredPlaceId: string): Promise<ReviewsPayload | null> => {
    try {
      const placeId = configuredPlaceId || (await resolvePlaceId(key))
      if (!placeId) return null

      const place = await $fetch<GooglePlace>(`https://places.googleapis.com/v1/places/${placeId}`, {
        query: { languageCode: 'fr' },
        headers: {
          'X-Goog-Api-Key': key,
          'X-Goog-FieldMask': 'id,rating,userRatingCount,googleMapsUri,reviews',
        },
      })

      const reviews: PatioReview[] = (place.reviews ?? [])
        .map((r) => ({
          author: r.authorAttribution?.displayName ?? 'Client Google',
          authorUrl: r.authorAttribution?.uri,
          avatar: r.authorAttribution?.photoUri,
          rating: r.rating ?? 5,
          text: (r.text?.text ?? r.originalText?.text ?? '').trim(),
          when: r.relativePublishTimeDescription ?? '',
          publishedAt: r.publishTime,
        }))
        .filter((r) => r.text.length > 0)
        // On met en avant les meilleurs avis récents
        .sort((a, b) => b.rating - a.rating || (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''))

      // Si Google ne renvoie aucun avis exploitable, on garde la sélection manuelle
      return {
        source: 'google',
        rating: place.rating ?? FALLBACK.rating,
        count: place.userRatingCount ?? FALLBACK.count,
        url: place.googleMapsUri ?? FALLBACK.url,
        reviews: reviews.length ? reviews : manualReviews,
      }
    } catch (err) {
      console.error('[reviews] Google Places error:', err)
      return null
    }
  },
  {
    name: 'google-reviews',
    maxAge: 60 * 60 * 6,
    swr: true,
    getKey: () => 'patio-v2',
    validate: (entry) => entry.value !== null,
  },
)

export default defineEventHandler(async (): Promise<ReviewsPayload> => {
  const config = useRuntimeConfig()
  const key = config.googlePlacesKey as string
  if (!key) return FALLBACK
  return (await fetchGoogle(key, config.googlePlaceId as string)) ?? FALLBACK
})
