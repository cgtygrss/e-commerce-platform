/**
 * Shipink API Service
 * Documentation: https://shipink.dev/api
 */

import { Types } from 'mongoose';

const SHIPINK_API_URL = process.env.SHIPINK_API_URL || 'https://api.shipink.io';
const SHIPINK_API_KEY = process.env.SHIPINK_API_KEY || '';

interface ShipinkCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district?: string;
  postal_code: string;
  country: string;
}

interface ShipinkItem {
  name: string;
  quantity: number;
  price: string;
  sku: string;
}

interface ShipinkOrder {
  customer: ShipinkCustomer;
  store: string;
  store_id: string;
  status: string;
  items: ShipinkItem[];
  currency: string;
  payment_type: string;
  price: string;
  cod_price: string;
  notes: string;
  reference: string;
}

interface ShipinkAddress {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  district?: string;
  postal_code: string;
  country: string;
}

interface ShipinkShipment {
  order_id: string;
  rate_id: string;
  carrier: string;
  service: string;
  address_from: ShipinkAddress;
  address_to: ShipinkAddress;
  reference: string;
}

interface OrderData {
  orderId: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone?: string;
    district?: string;
  };
  email: string;
  items: Array<{
    name: string;
    qty: number;
    price: number;
    product?: Types.ObjectId | string;
  }>;
  totalPrice: number;
  paymentMethod: string;
  notes?: string;
}

interface ShipmentData {
  orderId: string;
  rateId: string;
  carrier: string;
  service: string;
  addressTo: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    district?: string;
  };
  addressFrom?: Partial<{
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    district: string;
    postalCode: string;
    country: string;
  }>;
  reference?: string;
}

interface ShipinkResponse<T = unknown> {
  data: T;
  meta?: {
    message?: string;
  };
}

class ShipinkService {
  private baseURL: string;
  private headers: Record<string, string>;

  constructor() {
    this.baseURL = SHIPINK_API_URL;
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${SHIPINK_API_KEY}`
    };
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data: unknown = null
  ): Promise<ShipinkResponse<T>> {
    const fetch = (await import('node-fetch')).default;

    const options: {
      method: string;
      headers: Record<string, string>;
      body?: string;
    } = {
      method,
      headers: this.headers
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, options);
      const result = await response.json() as ShipinkResponse<T> & { meta?: { message?: string } };

      if (!response.ok) {
        throw new Error(result.meta?.message || 'Shipink API error');
      }

      return result;
    } catch (error) {
      console.error('Shipink API Error:', error);
      throw error;
    }
  }

  // ==================== ORDERS ====================

  /**
   * Create a new order in Shipink
   * @param orderData - Order details
   */
  async createOrder(orderData: OrderData): Promise<ShipinkResponse<{ id: string }>> {
    const shipinkOrder: ShipinkOrder = {
      customer: {
        name: `${orderData.shippingAddress.firstName} ${orderData.shippingAddress.lastName}`,
        email: orderData.email || '',
        phone: orderData.shippingAddress.phone || '',
        address: orderData.shippingAddress.address,
        city: orderData.shippingAddress.city,
        district: orderData.shippingAddress.district || '',
        postal_code: orderData.shippingAddress.postalCode,
        country: orderData.shippingAddress.country || 'TR'
      },
      store: 'api',
      store_id: orderData.orderId,
      status: 'pending',
      items: orderData.items.map(item => ({
        name: item.name,
        quantity: item.qty,
        price: item.price.toString(),
        sku: item.product?.toString() || ''
      })),
      currency: 'TRY',
      payment_type: orderData.paymentMethod === 'cod' ? 'cod' : 'prepaid',
      price: orderData.totalPrice.toString(),
      cod_price: orderData.paymentMethod === 'cod' ? orderData.totalPrice.toString() : '0',
      notes: orderData.notes || '',
      reference: orderData.orderId
    };

    return await this.request('POST', '/orders', shipinkOrder);
  }

  /**
   * Get all orders from Shipink
   */
  async getAllOrders(): Promise<ShipinkResponse<unknown[]>> {
    return await this.request('GET', '/orders');
  }

  /**
   * Get a specific order by ID
   * @param orderId - Shipink order ID
   */
  async getOrder(orderId: string): Promise<ShipinkResponse<unknown>> {
    return await this.request('GET', `/orders/${orderId}`);
  }

  /**
   * Update an order
   * @param orderId - Shipink order ID
   * @param updateData - Updated order data
   */
  async updateOrder(orderId: string, updateData: unknown): Promise<ShipinkResponse<unknown>> {
    return await this.request('PUT', `/orders/${orderId}`, updateData);
  }

  /**
   * Delete an order
   * @param orderId - Shipink order ID
   */
  async deleteOrder(orderId: string): Promise<ShipinkResponse<unknown>> {
    return await this.request('DELETE', `/orders/${orderId}`);
  }

  // ==================== RATES ====================

  /**
   * Get available shipping rates for an order
   * @param orderId - Shipink order ID
   * @param options - Optional filters (currency, min_price, max_price)
   */
  async getRates(
    orderId: string,
    options: { currency?: string; min_price?: string; max_price?: string } = {}
  ): Promise<ShipinkResponse<unknown>> {
    let endpoint = `/orders/${orderId}/rates`;
    const params = new URLSearchParams();

    if (options.currency) params.append('currency', options.currency);
    if (options.min_price) params.append('min_price', options.min_price);
    if (options.max_price) params.append('max_price', options.max_price);

    const queryString = params.toString();
    if (queryString) {
      endpoint += `?${queryString}`;
    }

    return await this.request('GET', endpoint);
  }

  // ==================== SHIPMENTS ====================

  /**
   * Create a new shipment
   * @param shipmentData - Shipment details
   */
  async createShipment(shipmentData: ShipmentData): Promise<ShipinkResponse<{
    id: string;
    tracking_number: string;
    tracking_url: string;
  }>> {
    const shipment: ShipinkShipment = {
      order_id: shipmentData.orderId,
      rate_id: shipmentData.rateId,
      carrier: shipmentData.carrier,
      service: shipmentData.service || 'standard',
      address_from: {
        name: shipmentData.addressFrom?.name || 'Lâl Takı',
        phone: shipmentData.addressFrom?.phone || process.env.STORE_PHONE || '',
        email: shipmentData.addressFrom?.email || process.env.STORE_EMAIL || '',
        address: shipmentData.addressFrom?.address || process.env.STORE_ADDRESS || '',
        city: shipmentData.addressFrom?.city || process.env.STORE_CITY || 'İstanbul',
        district: shipmentData.addressFrom?.district || '',
        postal_code: shipmentData.addressFrom?.postalCode || '',
        country: shipmentData.addressFrom?.country || 'TR'
      },
      address_to: {
        name: shipmentData.addressTo.name,
        phone: shipmentData.addressTo.phone || '',
        email: shipmentData.addressTo.email || '',
        address: shipmentData.addressTo.address,
        city: shipmentData.addressTo.city,
        district: shipmentData.addressTo.district || '',
        postal_code: shipmentData.addressTo.postalCode,
        country: shipmentData.addressTo.country || 'TR'
      },
      reference: shipmentData.reference || ''
    };

    return await this.request('POST', '/shipments', shipment);
  }

  /**
   * Get all shipments
   */
  async getAllShipments(): Promise<ShipinkResponse<unknown[]>> {
    return await this.request('GET', '/shipments');
  }

  /**
   * Get a specific shipment by ID
   * @param shipmentId - Shipink shipment ID
   */
  async getShipment(shipmentId: string): Promise<ShipinkResponse<unknown>> {
    return await this.request('GET', `/shipments/${shipmentId}`);
  }

  /**
   * Update a shipment
   * @param shipmentId - Shipink shipment ID
   * @param updateData - Updated shipment data
   */
  async updateShipment(shipmentId: string, updateData: unknown): Promise<ShipinkResponse<unknown>> {
    return await this.request('PUT', `/shipments/${shipmentId}`, updateData);
  }

  /**
   * Delete a shipment
   * @param shipmentId - Shipink shipment ID
   */
  async deleteShipment(shipmentId: string): Promise<ShipinkResponse<unknown>> {
    return await this.request('DELETE', `/shipments/${shipmentId}`);
  }
}

export default new ShipinkService();
