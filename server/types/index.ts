import { Request } from 'express';
import { Document, Types } from 'mongoose';

// User Types
export interface IUser extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin: boolean;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Product Types
export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: 'necklaces' | 'earrings' | 'bracelets' | 'rings';
  type?: string;
  material?: string;
  isNewProduct?: boolean;
  isBestseller?: boolean;
  inStock: boolean;
  countInStock: number;
  rating?: number;
  numReviews?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Cart Types
export interface ICartItem {
  product: Types.ObjectId | IProduct;
  name: string;
  image: string;
  price: number;
  qty: number;
}

// Order Types
export interface IShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface IOrderItem {
  name: string;
  qty: number;
  image: string;
  price: number;
  product: Types.ObjectId;
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId | IUser;
  orderItems: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: string;
  paymentResult?: {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
  };
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Return Request Types
export interface IReturnRequest extends Document {
  _id: Types.ObjectId;
  order: Types.ObjectId | IOrder;
  user: Types.ObjectId | IUser;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  items: {
    product: Types.ObjectId;
    quantity: number;
    reason: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// Country Types
export interface ICountry extends Document {
  _id: Types.ObjectId;
  name: string;
  code: string;
  shippingRate: number;
  isActive: boolean;
}

// Auth Types
export interface IAuthRequest extends Request {
  user?: IUser;
}

export interface ITokenPayload {
  userId: string;
  isAdmin: boolean;
}

// API Response Types
export interface IApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Shipping Types
export interface IShippingRate {
  country: string;
  rate: number;
  estimatedDays: number;
}

// Email Types
export interface IEmailData {
  to: string;
  subject: string;
  html: string;
}

// Google OAuth Types
export interface IGoogleUserData {
  email: string;
  firstName: string;
  lastName: string;
  googleId: string;
  picture?: string;
}