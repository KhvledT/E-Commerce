import { Brand } from "./brand"
import { Category, Subcategory } from "./category"

export interface AddToCartResponse {
    status: string
    message: string
    numOfCartItems: number
    cartId: string
    data: CartData<string>
  }
  export interface GetCartResponse {
    status: string;
    numOfCartItems: number;
    cartId: string;
    data: CartData<CartProductItem>;
  }
  
export interface CartData<T> {
    _id: string
    cartOwner: string
    products: CartProduct<T>[]
    createdAt: string
    updatedAt: string
    totalCartPrice: number
  }
  
export interface CartProduct<T> {
    count: number
    _id: string
    product: T
    price: number
  }

  export interface CartProductItem {
    subcategory: Subcategory[];
    _id: string;
    title: string;
    quantity: number;
    imageCover: string;
    category: Category;
    brand: Brand;
    ratingsAverage: number;
    id: string;
  }