import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { Product, Order, CartItem, ShippingAddress } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

interface CreateOrderData {
    orderItems: CartItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    totalPrice: number;
}

interface PayTRPaymentData {
    orderItems: CartItem[];
    shippingAddress: ShippingAddress;
    totalPrice: number;
    userBasket: Array<{ name: string; price: number; qty: number }>;
}

interface PayTRPaymentResponse {
    success: boolean;
    token: string;
    merchant_oid: string;
    message?: string;
}

interface PayTRCreateOrderData {
    orderItems: CartItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    totalPrice: number;
    merchant_oid: string;
}

const api: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const getProducts = async (): Promise<Product[]> => {
    const response: AxiosResponse<Product[]> = await api.get('/products');
    return response.data;
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
    const response: AxiosResponse<Product[]> = await api.get('/products/featured/list');
    return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
    const response: AxiosResponse<Product> = await api.get(`/products/${id}`);
    return response.data;
};

export const createOrder = async (orderData: CreateOrderData): Promise<Order> => {
    const response: AxiosResponse<Order> = await api.post('/orders', orderData);
    return response.data;
};

// Shipping / Tracking APIs
export const getOrderTracking = async (orderId: string): Promise<unknown> => {
    const response: AxiosResponse<unknown> = await api.get(`/shipping/track/${orderId}`);
    return response.data;
};

export const getOrderById = async (orderId: string): Promise<Order> => {
    const response: AxiosResponse<Order> = await api.get(`/orders/${orderId}`);
    return response.data;
};

// PayTR Payment APIs
export const createPayTRPayment = async (paymentData: PayTRPaymentData): Promise<PayTRPaymentResponse> => {
    const response: AxiosResponse<PayTRPaymentResponse> = await api.post('/payment/create-payment', paymentData);
    return response.data;
};

export const createPayTROrder = async (orderData: PayTRCreateOrderData): Promise<unknown> => {
    const response: AxiosResponse<unknown> = await api.post('/payment/create-order', orderData);
    return response.data;
};

export default api;
