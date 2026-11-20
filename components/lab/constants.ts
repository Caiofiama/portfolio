/** Card height divided by its width. */
export const CARD_ASPECT = 1.6;

/** The pre-rendered card faces in public/lab (made by /lab/cards in development). */
export const cardFace = (slug: string, side: "front" | "back") => `/lab/${slug}-${side}.webp`;
