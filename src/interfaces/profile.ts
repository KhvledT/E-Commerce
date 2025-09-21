export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface UpdateUserData {
  name: string | undefined;
  email: string | undefined;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface Order {
  _id: string;
  shippingAddress: {
    details: string;
    phone: string;
    city: string;
  };
  taxPrice: number;
  shippingPrice: number;
  totalOrderPrice: number;
  paymentMethodType: string;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
  id: number;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  cartItems: OrderItem[];
  __v: number;
}

export interface OrderItem {
  count: number;
  _id: string;
  product: {
    subcategory: Array<{
      _id: string;
      name: string;
      slug: string;
      category: string;
    }>;
    ratingsQuantity: number;
    _id: string;
    title: string;
    imageCover: string;
    category: {
      _id: string;
      name: string;
      slug: string;
      image: string;
    };
    brand: {
      _id: string;
      name: string;
      slug: string;
      image: string;
    };
    ratingsAverage: number;
    id: string;
  };
  price: number;
}

export interface UserOrdersResponse {
  status?: string;
  data?: Order[];
  orders?: Order[];
  message?: string;
}

export interface UpdateUserResponse {
  message: string;
  user: UpdateUserResponseData;
}
export interface UpdateUserResponseData {
  name: string;
  email: string;
}

export interface ChangePasswordResponse {
  message: string;
  user: {
    name: string;
    email: string;
    role: string;
  };
  token: string;
}
