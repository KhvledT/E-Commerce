import { AddToCartResponse, GetCartResponse, ShippingAddress, CheckoutSessionResponse } from "@/interfaces";
import { AuthResponse } from "@/interfaces/auth";
import { AddToWishlistResponse, GetWishlistResponse } from "@/interfaces/wishList";
import { AddressResponse, AddressFormData } from "@/interfaces/shipping";
import { UserOrdersResponse, UpdateUserResponse, ChangePasswordResponse } from "@/interfaces/profile";

const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
};


class ApiServices {
    #BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    #getHeaders() {
        const csrfToken = getCookie('next-auth.csrf-token');
        
        return {
            "Content-Type": "application/json",
            token: csrfToken || "",
        }
    }

    #getAuthHeaders(token: string) {
        return {
            "Content-Type": "application/json",
            token: token,
        }
    }

    getProducts = async ( page: number, limit: number ) => {
        const response = await fetch(`${this.#BASE_URL}api/v1/products?page=${page}&limit=${limit}`);
        return response.json();
    }
    getProduct = async (id: string | string[]) => {
        const response = await fetch(`${this.#BASE_URL}api/v1/products/${id}`);
        return response.json();
    }

    getCategories = async () => {
        const response = await fetch(`${this.#BASE_URL}api/v1/categories`);
        return response.json();
    }
    getCategory = async (id: string | string[]) => {
        const response = await fetch(`${this.#BASE_URL}api/v1/categories/${id}`);
        return response.json();
    }
    getCategoryProducts = async (id: string | string[]) => {
        const response = await fetch(`${this.#BASE_URL}api/v1/products?category=${id}`);
        return response.json();
    }


    getBrands = async () => {
        const response = await fetch(`${this.#BASE_URL}api/v1/brands`);
        return response.json();
    }
    getBrand = async (id: string | string[]) => {
        const response = await fetch(`${this.#BASE_URL}api/v1/brands/${id}`);
        return response.json();
    }
    getBrandProducts = async (id: string | string[]) => {
        const response = await fetch(`${this.#BASE_URL}api/v1/products?brand=${id}`);
        return response.json();
    }

    

    addToCartApi = async (productId: string, token?: string) : Promise<AddToCartResponse> => {
        return await fetch(`${this.#BASE_URL}api/v1/cart`, {
            method: "post",
            body: JSON.stringify({ productId }),
            headers: token ? this.#getAuthHeaders(token) : this.#getHeaders(),
        }).then(res => res.json());
    }
    getCartApi = async (token?: string) : Promise<GetCartResponse> => {
        return await fetch(`${this.#BASE_URL}api/v1/cart`, {
            headers: token ? this.#getAuthHeaders(token) : this.#getHeaders(),
        }).then(res => res.json());
    }
    updateCartItemQuantityApi = async (itemId: string, count: number, token?: string) : Promise<GetCartResponse> => {
        return await fetch(`${this.#BASE_URL}api/v1/cart/${itemId}`, {
            method: "put",
            body: JSON.stringify({ count }),
            headers: token ? this.#getAuthHeaders(token) : this.#getHeaders(),
        }).then(res => res.json());
    }
    removeFromCartApi = async (itemId: string, token?: string) : Promise<GetCartResponse> => {
        return await fetch(`${this.#BASE_URL}api/v1/cart/${itemId}`, {
            method: "delete",
            headers: token ? this.#getAuthHeaders(token) : this.#getHeaders(),
        }).then(res => res.json());
    }
    clearCartApi = async (token?: string) : Promise<{ message: string }> => {
        return await fetch(`${this.#BASE_URL}api/v1/cart`, {
            method: "delete",
            headers: token ? this.#getAuthHeaders(token) : this.#getHeaders(),
        }).then(res => res.json());
    }


    addToWishlistApi = async (productId: string, token?: string) : Promise<AddToWishlistResponse> => {
        return await fetch(`${this.#BASE_URL}api/v1/wishlist`, {
            method: "post",
            body: JSON.stringify({ productId }),
            headers: token ? this.#getAuthHeaders(token) : this.#getHeaders(),
        }).then(res => res.json());
    }
    getWishlistApi = async (token?: string) : Promise<GetWishlistResponse> => {
        return await fetch(`${this.#BASE_URL}api/v1/wishlist`, {
            headers: token ? this.#getAuthHeaders(token) : this.#getHeaders(),
        }).then(res => res.json());
    }
    removeFromWishlistApi = async (productId: string, token?: string) : Promise<AddToWishlistResponse> => {
        return await fetch(`${this.#BASE_URL}api/v1/wishlist/${productId}`, {
            method: "delete",
            headers: token ? this.#getAuthHeaders(token) : this.#getHeaders(),
        }).then(res => res.json());
    }

    loginApi = async (email: string, password: string) : Promise<AuthResponse> => {
        return await fetch(`${this.#BASE_URL}api/v1/auth/signin`, {
                method: "post",
                headers: {
                     "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            }).then(res => res.json());
    }

    registerApi = async (name: string, email: string, password: string, rePassword: string, phone: string) : Promise<AuthResponse> => {
        return await fetch(`${this.#BASE_URL}api/v1/auth/signup`, {
            method: "post",
            headers: {
                 "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password, rePassword, phone }),
        }).then(res => res.json());
    }
    forgotPasswordApi = async (email: string) : Promise<{ message: string }> => {
        return await fetch(`${this.#BASE_URL}api/v1/auth/forgotPasswords`, {
            method: "post",
            headers: {
                 "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        }).then(res => res.json());
    }
    verifyForgotPasswordApi = async (resetCode: string) : Promise<{ message: string }> => {
        return await fetch(`${this.#BASE_URL}api/v1/auth/verifyResetCode`, {
            method: "post",
            headers: {
                 "Content-Type": "application/json",
            },
            body: JSON.stringify({ resetCode }),
        }).then(res => res.json());
    }
    resetPasswordApi = async (email: string, newPassword: string) : Promise<{ message: string }> => {
        return await fetch(`${this.#BASE_URL}api/v1/auth/resetPassword`, {
            method: "put",
            headers: {
                 "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, newPassword }),
        }).then(res => res.json());
    }
    updateLoggedUserDataApi = async (name?: string, email?: string, token?: string): Promise<UpdateUserResponse> => {
        const body: { name?: string; email?: string } = {};
    
        if (name !== undefined) {
            body.name = name;
        }
        if (email !== undefined) {
            body.email = email;
        }
    
        return await fetch(`${this.#BASE_URL}api/v1/users/updateMe/`, {
            method: "PUT",
            headers: token ? this.#getAuthHeaders(token) : this.#getHeaders(),
            body: JSON.stringify(body),
        }).then(res => res.json());
    }
    
     changePasswordApi = async (currentPassword: string, newPassword: string, confirmPassword: string, token?: string) : Promise<ChangePasswordResponse> => {
         return await fetch(`${this.#BASE_URL}api/v1/users/changeMyPassword`, {
             method: "put",
             headers: token ? this.#getAuthHeaders(token) : this.#getHeaders(),
             body: JSON.stringify({ currentPassword, password: newPassword, rePassword: confirmPassword }),
         }).then(res => res.json());
     }

    createOrderApi = async (cartId: string, shippingAddress: ShippingAddress, token?: string) : Promise<CheckoutSessionResponse> => {
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        return await fetch(`${this.#BASE_URL}api/v1/orders/checkout-session/${cartId}?url=${baseUrl}`, {
            method: "post",
            headers: token ? this.#getAuthHeaders(token) : this.#getHeaders(),
            body: JSON.stringify({ shippingAddress }),
        }).then(res => res.json());
    }
    getUserOrdersApi = async (cartOwner: string, token?: string) : Promise<UserOrdersResponse> => {
        return await fetch(`${this.#BASE_URL}api/v1/orders/user/${cartOwner}`, {
            headers: token ? this.#getAuthHeaders(token) : this.#getHeaders(),
        }).then(res => res.json());
    }
    addUserAddressApi = async (address: AddressFormData, token?: string) : Promise<{ status: string; message: string }> => {
        return await fetch(`${this.#BASE_URL}api/v1/addresses`, {
            method: "post",
            headers: token ? this.#getAuthHeaders(token) : this.#getHeaders(),
            body: JSON.stringify(address),
        }).then(res => res.json());
    }
    removeUserAddressApi = async (addressId: string, token?: string) : Promise<{ status: string; message: string }> => {
        return await fetch(`${this.#BASE_URL}api/v1/addresses/${addressId}`, {
            method: "delete",
            headers: token ? this.#getAuthHeaders(token) : this.#getHeaders(),
        }).then(res => res.json());
    }
    getUserAddressesApi = async (token?: string) : Promise<AddressResponse> => {
        return await fetch(`${this.#BASE_URL}api/v1/addresses`, {
            headers: token ? this.#getAuthHeaders(token) : this.#getHeaders(),
        }).then(res => res.json());
    }
}

export const apiServices = new ApiServices();