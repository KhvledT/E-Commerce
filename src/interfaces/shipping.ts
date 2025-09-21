export interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
}

export interface UserAddress {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
}

export interface AddressResponse {
  status: string;
  message: string;
  data: UserAddress[];
}

export interface AddAddressRequest {
  name: string;
  details: string;
  phone: string;
  city: string;
}

export interface AddressFormData {
  name: string;
  details: string;
  phone: string;
  city: string;
}

export interface CheckoutSessionResponse {
  status: string;
  session: {
    url: string;
    success_url: string;
    cancel_url: string;
  };
}
