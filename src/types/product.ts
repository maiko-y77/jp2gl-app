import type { Timestamp } from "firebase/firestore"

export type Product = {
  id: string
   nameEn: string
  nameJa: string
  priceJPY: number
  category: string
  availableFrom: Timestamp
  availableTo: Timestamp
  description?: string
  imageUrl?: string
  publicId?: string
};