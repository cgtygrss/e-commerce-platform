// User Types
export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other' | '';
  birthDate?: string;
  address?: Address;
  isAdmin: boolean;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

// Product Types
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: 'necklaces' | 'earrings' | 'bracelets' | 'rings';
  color?: string;
  material?: string;
  inStock: boolean;
  isFeatured: boolean;
  isNewProduct?: boolean;
  isBestseller?: boolean;
  rating?: number;
  numReviews?: number;
  createdAt: string;
  updatedAt: string;
}

// Cart Types
export interface CartItem {
  product: string;
  name: string;
  image: string;
  price: number;
  qty: number;
}

export interface CartState {
  cartItems: CartItem[];
}

// Order Types
export interface OrderItem {
  name: string;
  qty: number;
  image: string;
  price: number;
  product: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface PaymentResult {
  id?: string;
  status?: string;
  update_time?: string;
  email_address?: string;
}

export interface Order {
  _id: string;
  user: string | User;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentResult?: PaymentResult;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'return_requested' | 'return_approved' | 'refunded' | 'cancelled';
  shipinkOrderId?: string;
  shipinkShipmentId?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  carrier?: string;
  estimatedDelivery?: string;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Return Request Types
export interface ReturnItem {
  product: string;
  name: string;
  qty: number;
  price: number;
  image?: string;
}

export interface ReturnRequest {
  _id: string;
  order: string | Order;
  user: string | User;
  items: ReturnItem[];
  reason: 'defective' | 'wrong_item' | 'not_as_described' | 'changed_mind' | 'size_issue' | 'quality_issue' | 'arrived_late' | 'other';
  reasonDetails: string;
  status: 'pending' | 'approved' | 'rejected' | 'refunded' | 'cancelled';
  refundAmount: number;
  adminNotes: string;
  images: string[];
  trackingNumber: string;
  returnAddress: string;
  createdAt: string;
  updatedAt: string;
}

// Country Types
export interface Country {
  _id: string;
  name: string;
  code: string;
  phoneCode: string;
  phoneFormat: string;
  phonePlaceholder: string;
  flag?: string;
  cities: string[];
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Payment Types
export interface PaymentRequest {
  orderId: string;
  amount: number;
  userIp: string;
  userEmail: string;
  userName: string;
  userPhone: string;
  userAddress: string;
}

export interface PaymentResponse {
  success: boolean;
  iframeUrl?: string;
  message?: string;
}

// Shipping Types
export interface ShippingRate {
  country: string;
  rate: number;
  estimatedDays: number;
}

// Context Types
export interface AuthContextType {
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

export interface CartContextType {
  cart: CartState;
  dispatch: React.Dispatch<CartAction>;
}

export type CartAction =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QTY'; payload: { product: string; qty: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

// Component Props Types
export interface ProductCardProps {
  product: Product;
}

export interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  width?: string;
}

export interface LayoutProps {
  children: React.ReactNode;
}