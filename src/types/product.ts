import type { Timestamp } from "firebase/firestore"

export type Product = {
  id: string
  name: string
  priceJPY: number
  category: string
  availableFrom: Timestamp
  availableTo: Timestamp
  description?: string
};