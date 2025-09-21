import { Brand } from "./brand"
import { Category, Subcategory } from "./category"

export interface AddToWishlistResponse {
    status: string
    message: string
    data: string[]
  }
  
  export interface GetWishlistResponse {
    status: string
    count: number
    data: WishlistItem[]
  }
  
  export interface WishlistItem {
    sold: number
    images: string[]
    subcategory: Subcategory[]
    ratingsQuantity: number
    _id: string
    title: string
    slug: string
    description: string
    quantity: number
    price: number
    imageCover: string
    category: Category
    brand: Brand
    ratingsAverage: number
    createdAt: string
    updatedAt: string
    __v: number
    id: string
    priceAfterDiscount?: number
  }
  
  