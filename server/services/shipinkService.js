/**
 * Shipink API Service
 * Documentation: https://shipink.dev/api
 */

const SHIPINK_API_URL = process.env.SHIPINK_API_URL || 'https://api.shipink.io';
const SHIPINK_API_KEY = process.env.SHIPINK_API_KEY;

class ShipinkService {
    constructor() {
        this.baseURL = SHIPINK_API_URL;
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${SHIPINK_API_KEY}`
        };
    }

    async request(method, endpoint, data = null) {
        const fetch = (await import('node-fetch')).default;
        
        const options = {
            method,
            headers: this.headers
        };

        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, options);
            const result = await response.json();
            
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
     * @param {Object} orderData - Order details
     */
    async createOrder(orderData) {
        const shipinkOrder = {
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
    async getAllOrders() {
        return await this.request('GET', '/orders');
    }

    /**
     * Get a specific order by ID
     * @param {string} orderId - Shipink order ID
     */
    async getOrder(orderId) {
        return await this.request('GET', `/orders/${orderId}`);
    }

    /**
     * Update an order
     * @param {string} orderId - Shipink order ID
     * @param {Object} updateData - Updated order data
     */
    async updateOrder(orderId, updateData) {
        return await this.request('PUT', `/orders/${orderId}`, updateData);
    }

    /**
     * Delete an order
     * @param {string} orderId - Shipink order ID
     */
    async deleteOrder(orderId) {
        return await this.request('DELETE', `/orders/${orderId}`);
    }

    // ==================== RATES ====================

    /**
     * Get available shipping rates for an order
     * @param {string} orderId - Shipink order ID
     * @param {Object} options - Optional filters (currency, min_price, max_price)
     */
    async getRates(orderId, options = {}) {
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
     * @param {Object} shipmentData - Shipment details
     */
    async createShipment(shipmentData) {
        const shipment = {
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
    async getAllShipments() {
        return await this.request('GET', '/shipments');
    }

    /**
     * Get a specific shipment by ID
     * @param {string} shipmentId - Shipink shipment ID
     */
    async getShipment(shipmentId) {
        return await this.request('GET', `/shipments/${shipmentId}`);
    }

    /**
     * Update a shipment
     * @param {string} shipmentId - Shipink shipment ID
     * @param {Object} updateData - Updated shipment data
     */
    async updateShipment(shipmentId, updateData) {
        return await this.request('PUT', `/shipments/${shipmentId}`, updateData);
    }

    /**
     * Delete a shipment
     * @param {string} shipmentId - Shipink shipment ID
     */
    async deleteShipment(shipmentId) {
        return await this.request('DELETE', `/shipments/${shipmentId}`);
    }
}

module.exports = new ShipinkService();
