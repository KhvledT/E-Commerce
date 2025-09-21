"use client";
import { apiServices } from "@/Services/api";
import { useEffect, useState } from "react";
import { createContext } from "react";
import { useSession } from "next-auth/react";


export interface CartContextType {
    cartCount: number;
    setCartCount: (cartCount: number) => void;
    isLoading: boolean;
    cartOwner: string | null;
    setCartOwner: (cartOwner: string) => void;
}
export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartContextProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const [cartCount, setCartCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [cartOwner, setCartOwner] = useState<string | null>(null);

    async function getCartCount() {
        setIsLoading(true);
      
        const response = await apiServices.getCartApi(session?.user?.token);
        setCartCount(response.numOfCartItems || 0);
        if (localStorage.getItem("email") === session?.user?.email) {
      
          if (
            response.data &&
            response.data.cartOwner !== null &&
            response.data.cartOwner !== undefined &&
            response.data.cartOwner !== ""
          ) {
            localStorage.setItem("cartOwner", response.data.cartOwner);
            setCartOwner(response.data.cartOwner);
          } else {
            
            // If the server returned null/undefined keep the existing value cartOwner id
            // fa4a5etny wa ana b7lha wallahy :)
            const existingOwner = localStorage.getItem("cartOwner");
            setCartOwner(existingOwner);
          }
      
          setCartCount(response.numOfCartItems || 0);
        } else {
          localStorage.removeItem("cartOwner");
          localStorage.setItem("email", session?.user?.email || "");
        }
      
        setIsLoading(false);
      }
      
    useEffect(() => {
        if (session?.user?.token) {
            getCartCount();
        }
    }, [session]);

    return (
        <CartContext.Provider value={{ cartCount, setCartCount, isLoading, cartOwner, setCartOwner }}>
            {children}
        </CartContext.Provider>
    )   
}